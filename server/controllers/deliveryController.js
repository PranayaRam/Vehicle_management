const Delivery = require('../models/Delivery');
const ServiceJob = require('../models/ServiceJob');
const Invoice = require('../models/Invoice');
const StatusHistory = require('../models/StatusHistory');

// @desc    Mark vehicle ready for delivery (Staff, Admin)
// @route   PUT /api/delivery/ready/:jobId
// @access  Private (Staff, Admin)
exports.markReadyForDelivery = async (req, res, next) => {
  try {
    const job = await ServiceJob.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Service job not found'
      });
    }

    if (job.status !== 'QUALITY_CHECK' && job.status !== 'IN_SERVICE') {
      return res.status(400).json({
        success: false,
        message: `Cannot mark ready for delivery from status '${job.status}'. Must complete service and quality check first.`
      });
    }

    job.status = 'READY_FOR_DELIVERY';
    await job.save();

    await StatusHistory.create({
      serviceJobId: job._id,
      oldStatus: 'QUALITY_CHECK',
      newStatus: 'READY_FOR_DELIVERY',
      changedBy: req.user._id,
      remarks: 'All quality inspections, cleaning, and road test passed. Vehicle ready for delivery in Bay 1.'
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle marked as Ready for Delivery',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete vehicle delivery handover
// @route   POST /api/delivery
// @access  Private (Staff, Admin)
exports.completeDelivery = async (req, res, next) => {
  try {
    const { serviceJobId, recipientName, deliveryNotes, adminOverride } = req.body;

    if (!serviceJobId || !recipientName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceJobId and recipientName'
      });
    }

    const job = await ServiceJob.findById(serviceJobId).populate('vehicleId customerId');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Service job not found'
      });
    }

    // Rule 9 Check 1: Job must be in READY_FOR_DELIVERY
    if (job.status !== 'READY_FOR_DELIVERY' && !(adminOverride && req.user.role === 'ADMIN')) {
      return res.status(400).json({
        success: false,
        message: `Vehicle cannot be delivered. Service status must be READY_FOR_DELIVERY (currently ${job.status}).`
      });
    }

    // Rule 9 Check 2: Invoice must be PAID in full
    const invoice = await Invoice.findOne({ serviceJobId: job._id });
    if (!invoice) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deliver vehicle without a generated invoice'
      });
    }

    if (invoice.paymentStatus !== 'PAID' && !(adminOverride && req.user.role === 'ADMIN')) {
      return res.status(400).json({
        success: false,
        message: `Vehicle cannot be delivered. Outstanding balance requires payment (Invoice status: ${invoice.paymentStatus}).`
      });
    }

    // Create Delivery record
    const delivery = await Delivery.create({
      serviceJobId: job._id,
      vehicleId: job.vehicleId._id,
      customerId: job.customerId._id,
      deliveredBy: req.user._id,
      recipientName: recipientName.trim(),
      deliveryNotes: deliveryNotes ? deliveryNotes.trim() : 'Delivered after customer inspection and payment sign-off'
    });

    // Update job status to COMPLETED
    job.status = 'COMPLETED';
    await job.save();

    await StatusHistory.create({
      serviceJobId: job._id,
      oldStatus: 'READY_FOR_DELIVERY',
      newStatus: 'COMPLETED',
      changedBy: req.user._id,
      remarks: `Vehicle delivered to ${recipientName}. Handover completed by ${req.user.name}.`
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle delivery completed and logged into service history!',
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete service history for a vehicle
// @route   GET /api/delivery/history/:vehicleId
// @access  Private
exports.getVehicleServiceHistory = async (req, res, next) => {
  try {
    const completedJobs = await ServiceJob.find({
      vehicleId: req.params.vehicleId,
      status: 'COMPLETED'
    })
      .populate('vehicleId', 'registrationNumber brand model variant currentMileage')
      .populate('assignedStaffId', 'name')
      .sort({ updatedAt: -1 });

    // Fetch invoices and inspections for each completed job
    const history = await Promise.all(
      completedJobs.map(async (job) => {
        const [invoice, delivery, inspection] = await Promise.all([
          Invoice.findOne({ serviceJobId: job._id }),
          Delivery.findOne({ serviceJobId: job._id }).populate('deliveredBy', 'name'),
          require('../models/Inspection').findOne({ serviceJobId: job._id })
        ]);

        return {
          job,
          invoice,
          delivery,
          inspection
        };
      })
    );

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};
