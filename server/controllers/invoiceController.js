const Invoice = require('../models/Invoice');
const ServiceJob = require('../models/ServiceJob');
const Estimate = require('../models/Estimate');
const Counter = require('../models/Counter');

// @desc    Generate final invoice for a service job
// @route   POST /api/invoices
// @access  Private (Staff, Admin)
exports.generateInvoice = async (req, res, next) => {
  try {
    const { serviceJobId, additionalCharges = 0 } = req.body;

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

    // Retrieve approved estimate
    const estimate = await Estimate.findOne({ serviceJobId: job._id, status: 'APPROVED' });
    if (!estimate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate final invoice without an approved estimate'
      });
    }

    // Check if invoice already exists
    let invoice = await Invoice.findOne({ serviceJobId: job._id });
    if (invoice) {
      return res.status(200).json({
        success: true,
        message: 'Invoice already generated for this job',
        data: invoice
      });
    }

    const subtotal = estimate.subtotal + Number(additionalCharges);
    const taxRate = Number(process.env.TAX_RATE || 0.18);
    const tax = Math.round(subtotal * taxRate);
    const total = subtotal + tax;

    const seq = await Counter.getNextSequence('invoiceNumber');
    const invoiceNumber = `INV-${seq}`;

    invoice = await Invoice.create({
      invoiceNumber,
      serviceJobId: job._id,
      estimateId: estimate._id,
      customerId: job.customerId._id,
      vehicleId: job.vehicleId._id,
      parts: estimate.parts,
      labour: estimate.labour,
      additionalCharges: Number(additionalCharges),
      subtotal,
      tax,
      total,
      paymentStatus: 'UNPAID'
    });

    const populated = await Invoice.findById(invoice._id)
      .populate('customerId', 'name email phone address')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType')
      .populate('serviceJobId', 'jobNumber status reportedProblem');

    res.status(201).json({
      success: true,
      message: `Final invoice ${invoiceNumber} generated for ₹${total.toLocaleString()}`,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType')
      .populate('serviceJobId', 'jobNumber status reportedProblem');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Customer ownership guard
    if (req.user.role === 'CUSTOMER' && invoice.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this invoice'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get invoice by Service Job ID
// @route   GET /api/invoices/job/:jobId
// @access  Private
exports.getInvoiceByJobId = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ serviceJobId: req.params.jobId })
      .populate('customerId', 'name email phone address')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType')
      .populate('serviceJobId', 'jobNumber status reportedProblem');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found for this service job'
      });
    }

    if (req.user.role === 'CUSTOMER' && invoice.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this invoice'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's own invoices
// @route   GET /api/invoices/my
// @access  Private (Customer)
exports.getMyInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ customerId: req.user._id })
      .populate('vehicleId', 'registrationNumber brand model')
      .populate('serviceJobId', 'jobNumber status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices (Staff, Admin)
// @route   GET /api/invoices
// @access  Private (Staff, Admin)
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { paymentStatus } = req.query;
    let query = {};
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const invoices = await Invoice.find(query)
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'registrationNumber brand model')
      .populate('serviceJobId', 'jobNumber status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};
