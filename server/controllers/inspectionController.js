const Inspection = require('../models/Inspection');
const ServiceJob = require('../models/ServiceJob');
const StatusHistory = require('../models/StatusHistory');

// @desc    Record vehicle multi-point inspection
// @route   POST /api/inspections
// @access  Private (Staff, Admin)
exports.createInspection = async (req, res, next) => {
  try {
    const { serviceJobId, inspectionItems, overallNotes } = req.body;

    if (!serviceJobId || !inspectionItems || !Array.isArray(inspectionItems) || inspectionItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service job ID and inspection checklist items'
      });
    }

    const job = await ServiceJob.findById(serviceJobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Service job not found'
      });
    }

    // Check if an inspection was already conducted
    let inspection = await Inspection.findOne({ serviceJobId });
    if (inspection) {
      // Update existing inspection
      inspection.inspectionItems = inspectionItems;
      inspection.overallNotes = overallNotes ? overallNotes.trim() : '';
      inspection.inspectedBy = req.user._id;
      inspection.inspectionDate = new Date();
      await inspection.save();
    } else {
      inspection = await Inspection.create({
        serviceJobId,
        inspectionItems,
        overallNotes: overallNotes ? overallNotes.trim() : '',
        inspectedBy: req.user._id,
        inspectionDate: new Date()
      });
    }

    // Advance service job status to ESTIMATE_PENDING if currently INSPECTION
    if (job.status === 'INSPECTION') {
      const oldStatus = job.status;
      job.status = 'ESTIMATE_PENDING';
      await job.save();

      await StatusHistory.create({
        serviceJobId: job._id,
        oldStatus,
        newStatus: 'ESTIMATE_PENDING',
        changedBy: req.user._id,
        remarks: `Multi-point inspection completed by ${req.user.name}. Ready for estimate preparation.`
      });
    }

    const populatedInspection = await Inspection.findById(inspection._id)
      .populate('inspectedBy', 'name email role')
      .populate('serviceJobId', 'jobNumber status reportedProblem');

    res.status(201).json({
      success: true,
      message: 'Vehicle inspection recorded successfully. Job advanced to Estimate Pending.',
      data: populatedInspection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inspection details for a service job
// @route   GET /api/inspections/:jobId
// @access  Private
exports.getInspectionByJobId = async (req, res, next) => {
  try {
    const inspection = await Inspection.findOne({ serviceJobId: req.params.jobId })
      .populate('inspectedBy', 'name email role')
      .populate('serviceJobId');

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: 'No inspection record found for this service job'
      });
    }

    // Ownership check for customer
    if (req.user.role === 'CUSTOMER' && inspection.serviceJobId.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view inspections for another customer\'s vehicle'
      });
    }

    res.status(200).json({
      success: true,
      data: inspection
    });
  } catch (error) {
    next(error);
  }
};
