const Estimate = require('../models/Estimate');
const ServiceJob = require('../models/ServiceJob');
const Part = require('../models/Part');
const Labour = require('../models/Labour');
const StatusHistory = require('../models/StatusHistory');
const Counter = require('../models/Counter');

// @desc    Generate or update estimate for a service job
// @route   POST /api/estimates
// @access  Private (Staff, Admin)
exports.generateEstimate = async (req, res, next) => {
  try {
    const { serviceJobId, parts = [], labour = [], notes } = req.body;

    if (!serviceJobId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceJobId'
      });
    }

    const job = await ServiceJob.findById(serviceJobId).populate('vehicleId customerId');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Service job not found'
      });
    }

    // 1. Process and recalculate Parts on backend
    let processedParts = [];
    let partsTotal = 0;

    for (const item of parts) {
      const partDoc = await Part.findById(item.partId);
      if (!partDoc) {
        return res.status(400).json({
          success: false,
          message: `Part not found in inventory with ID ${item.partId}`
        });
      }

      const qty = Number(item.quantity);
      if (qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Quantity for part ${partDoc.name} must be greater than zero`
        });
      }

      // Rule: Prevent adding quantity greater than available stock
      if (qty > partDoc.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${partDoc.name}. Available: ${partDoc.stockQuantity}, Requested: ${qty}`
        });
      }

      const itemTotal = qty * partDoc.unitPrice;
      partsTotal += itemTotal;

      processedParts.push({
        partId: partDoc._id,
        name: partDoc.name,
        quantity: qty,
        unitPrice: partDoc.unitPrice,
        total: itemTotal
      });
    }

    // 2. Process and recalculate Labour on backend
    let processedLabour = [];
    let labourTotal = 0;

    for (const item of labour) {
      const labourDoc = await Labour.findById(item.labourId);
      if (!labourDoc) {
        return res.status(400).json({
          success: false,
          message: `Labour item not found with ID ${item.labourId}`
        });
      }

      const qty = Number(item.quantity || 1);
      const itemTotal = qty * labourDoc.charge;
      labourTotal += itemTotal;

      processedLabour.push({
        labourId: labourDoc._id,
        name: labourDoc.name,
        quantity: qty,
        unitCharge: labourDoc.charge,
        total: itemTotal
      });
    }

    // 3. Backend Financial Calculations
    const subtotal = partsTotal + labourTotal;
    const taxRate = Number(process.env.TAX_RATE || 0.18);
    const tax = Math.round(subtotal * taxRate);
    const total = subtotal + tax;

    // Check if estimate already exists for this job
    let estimate = await Estimate.findOne({ serviceJobId });

    if (estimate) {
      estimate.parts = processedParts;
      estimate.labour = processedLabour;
      estimate.subtotal = subtotal;
      estimate.tax = tax;
      estimate.total = total;
      estimate.status = 'PENDING_APPROVAL';
      estimate.notes = notes ? notes.trim() : '';
      await estimate.save();
    } else {
      const seq = await Counter.getNextSequence('estimateNumber');
      const estimateNumber = `EST-${seq}`;

      estimate = await Estimate.create({
        estimateNumber,
        serviceJobId: job._id,
        customerId: job.customerId._id,
        parts: processedParts,
        labour: processedLabour,
        subtotal,
        taxRate,
        tax,
        total,
        status: 'PENDING_APPROVAL',
        notes: notes ? notes.trim() : ''
      });
    }

    // Update job status to ESTIMATE_PENDING
    job.status = 'ESTIMATE_PENDING';
    await job.save();

    await StatusHistory.create({
      serviceJobId: job._id,
      oldStatus: 'INSPECTION',
      newStatus: 'ESTIMATE_PENDING',
      changedBy: req.user._id,
      remarks: `Estimate ${estimate.estimateNumber} generated for ₹${total.toLocaleString()}. Awaiting customer approval.`
    });

    res.status(201).json({
      success: true,
      message: `Estimate ${estimate.estimateNumber} generated successfully and submitted for customer approval.`,
      data: estimate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get estimate for a service job
// @route   GET /api/estimates/job/:jobId
// @access  Private
exports.getEstimateByJobId = async (req, res, next) => {
  try {
    const estimate = await Estimate.findOne({ serviceJobId: req.params.jobId })
      .populate('serviceJobId')
      .populate('customerId', 'name email phone');

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found for this service job'
      });
    }

    // Ownership check for customer
    if (req.user.role === 'CUSTOMER' && estimate.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view estimates for your own vehicles'
      });
    }

    res.status(200).json({
      success: true,
      data: estimate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer approves estimate
// @route   PUT /api/estimates/:id/approve
// @access  Private (Customer, Admin)
exports.approveEstimate = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    // Ownership check
    if (req.user.role === 'CUSTOMER' && estimate.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only approve estimates for your own vehicle'
      });
    }

    if (estimate.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'This estimate is already approved'
      });
    }

    // 1. Deduct allocated parts from inventory stock
    for (const p of estimate.parts) {
      await Part.findByIdAndUpdate(p.partId, {
        $inc: { stockQuantity: -p.quantity }
      });
    }

    // 2. Mark estimate APPROVED
    estimate.status = 'APPROVED';
    estimate.approvedAt = new Date();
    if (remarks) estimate.customerRemarks = remarks.trim();
    await estimate.save();

    // 3. Advance ServiceJob status to APPROVED
    const job = await ServiceJob.findById(estimate.serviceJobId);
    if (job) {
      const oldStatus = job.status;
      job.status = 'APPROVED';
      await job.save();

      await StatusHistory.create({
        serviceJobId: job._id,
        oldStatus,
        newStatus: 'APPROVED',
        changedBy: req.user._id,
        remarks: `Customer digitally approved estimate ${estimate.estimateNumber} for ₹${estimate.total.toLocaleString()}. ${remarks ? 'Remarks: ' + remarks : ''}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Estimate approved successfully! Workshop technicians have been authorized to begin servicing.',
      data: estimate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer rejects estimate
// @route   PUT /api/estimates/:id/reject
// @access  Private (Customer, Admin)
exports.rejectEstimate = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    if (req.user.role === 'CUSTOMER' && estimate.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only reject estimates for your own vehicle'
      });
    }

    estimate.status = 'REJECTED';
    estimate.rejectedAt = new Date();
    estimate.customerRemarks = remarks ? remarks.trim() : 'Estimate declined by customer';
    await estimate.save();

    const job = await ServiceJob.findById(estimate.serviceJobId);
    if (job) {
      await StatusHistory.create({
        serviceJobId: job._id,
        oldStatus: job.status,
        newStatus: job.status,
        changedBy: req.user._id,
        remarks: `Estimate ${estimate.estimateNumber} rejected by customer: ${estimate.customerRemarks}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Estimate has been marked as rejected. Service advisor has been notified.',
      data: estimate
    });
  } catch (error) {
    next(error);
  }
};
