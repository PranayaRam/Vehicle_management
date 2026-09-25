const ServiceJob = require('../models/ServiceJob');
const StatusHistory = require('../models/StatusHistory');

// Valid status transitions map
const VALID_TRANSITIONS = {
  INSPECTION: ['ESTIMATE_PENDING', 'CANCELLED'],
  ESTIMATE_PENDING: ['APPROVED', 'CANCELLED'],
  APPROVED: ['IN_SERVICE', 'CANCELLED'],
  IN_SERVICE: ['QUALITY_CHECK', 'CANCELLED'],
  QUALITY_CHECK: ['READY_FOR_DELIVERY', 'IN_SERVICE', 'CANCELLED'],
  READY_FOR_DELIVERY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};

// @desc    Get all service jobs (Staff & Admin)
// @route   GET /api/service-jobs
// @access  Private (Staff, Admin)
exports.getAllJobs = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { jobNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await ServiceJob.find(query)
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage')
      .populate('assignedStaffId', 'name email')
      .populate('bookingId', 'bookingNumber preferredDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's own service jobs
// @route   GET /api/service-jobs/my
// @access  Private (Customer)
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await ServiceJob.find({ customerId: req.user._id })
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage')
      .populate('assignedStaffId', 'name email')
      .populate('bookingId', 'bookingNumber preferredDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service job with status history
// @route   GET /api/service-jobs/:id
// @access  Private
exports.getJobById = async (req, res, next) => {
  try {
    const job = await ServiceJob.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage vin')
      .populate('assignedStaffId', 'name email phone')
      .populate('bookingId', 'bookingNumber preferredDate preferredTime');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Service job not found'
      });
    }

    // Ownership check for customer
    if (req.user.role === 'CUSTOMER' && job.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this service job'
      });
    }

    // Retrieve Status History
    const history = await StatusHistory.find({ serviceJobId: job._id })
      .populate('changedBy', 'name role')
      .sort({ changedAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        job,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service job status (Staff, Admin)
// @route   PUT /api/service-jobs/:id/status
// @access  Private (Staff, Admin)
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const job = await ServiceJob.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Service job not found'
      });
    }

    const currentStatus = job.status;
    const allowedNext = VALID_TRANSITIONS[currentStatus] || [];

    // Enforce valid status transitions
    if (!allowedNext.includes(status) && req.user.role !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from ${currentStatus} to ${status}. Allowed: ${allowedNext.join(', ')}`
      });
    }

    job.status = status;
    if (remarks) {
      job.serviceNotes = job.serviceNotes ? `${job.serviceNotes}\n${remarks}` : remarks;
    }
    await job.save();

    // Log in StatusHistory
    await StatusHistory.create({
      serviceJobId: job._id,
      oldStatus: currentStatus,
      newStatus: status,
      changedBy: req.user._id,
      remarks: remarks || `Status changed from ${currentStatus} to ${status}`
    });

    res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
      data: job
    });
  } catch (error) {
    next(error);
  }
};
