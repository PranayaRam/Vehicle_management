const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const ServiceJob = require('../models/ServiceJob');
const StatusHistory = require('../models/StatusHistory');

// @desc    Record or simulate payment against an invoice
// @route   POST /api/payments
// @access  Private (Customer, Staff, Admin)
exports.recordPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, paymentMethod, transactionReference } = req.body;

    if (!invoiceId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide invoiceId, amount, and paymentMethod'
      });
    }

    const payAmount = Number(amount);
    if (payAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero'
      });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Customer ownership guard
    if (req.user.role === 'CUSTOMER' && invoice.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only make payments for your own invoices'
      });
    }

    if (invoice.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'This invoice has already been paid in full'
      });
    }

    // Overpayment validation
    const remainingDue = invoice.total - (invoice.amountPaid || 0);
    if (payAmount > remainingDue) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${payAmount}) exceeds remaining balance (₹${remainingDue})`
      });
    }

    // 1. Create Payment record
    const payment = await Payment.create({
      invoiceId: invoice._id,
      amount: payAmount,
      paymentMethod,
      transactionReference: transactionReference ? transactionReference.trim() : `PAY-${Date.now().toString().slice(-6)}`,
      recordedBy: req.user._id,
      status: 'SUCCESS'
    });

    // 2. Update Invoice payment status
    invoice.amountPaid += payAmount;
    if (invoice.amountPaid >= invoice.total) {
      invoice.paymentStatus = 'PAID';
    } else {
      invoice.paymentStatus = 'PARTIAL';
    }
    await invoice.save();

    // 3. Log in StatusHistory
    await StatusHistory.create({
      serviceJobId: invoice.serviceJobId,
      oldStatus: 'BILLING',
      newStatus: invoice.paymentStatus === 'PAID' ? 'PAID' : 'PARTIALLY_PAID',
      changedBy: req.user._id,
      remarks: `Payment of ₹${payAmount.toLocaleString()} received via ${paymentMethod}. Ref: ${payment.transactionReference}.`
    });

    res.status(201).json({
      success: true,
      message: `Payment of ₹${payAmount.toLocaleString()} processed successfully. Invoice status: ${invoice.paymentStatus}.`,
      data: {
        payment,
        invoice
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments for an invoice
// @route   GET /api/payments/:invoiceId
// @access  Private
exports.getPaymentsByInvoiceId = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Customer ownership guard
    if (req.user.role === 'CUSTOMER' && invoice.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view payments for your own invoices'
      });
    }

    const payments = await Payment.find({ invoiceId: req.params.invoiceId })
      .populate('recordedBy', 'name role')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Staff, Admin)
// @route   GET /api/payments
// @access  Private (Staff, Admin)
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('recordedBy', 'name role')
      .populate({
        path: 'invoiceId',
        select: 'invoiceNumber total amountPaid paymentStatus',
        populate: [
          { path: 'customerId', select: 'name email phone' },
          { path: 'vehicleId', select: 'registrationNumber brand model' },
          { path: 'serviceJobId', select: 'jobNumber' }
        ]
      })
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer payments
// @route   GET /api/payments/my
// @access  Private (Customer)
exports.getMyPayments = async (req, res, next) => {
  try {
    const customerInvoices = await Invoice.find({ customerId: req.user._id }).select('_id');
    const invoiceIds = customerInvoices.map((inv) => inv._id);

    const payments = await Payment.find({ invoiceId: { $in: invoiceIds } })
      .populate('recordedBy', 'name role')
      .populate({
        path: 'invoiceId',
        select: 'invoiceNumber total amountPaid paymentStatus invoiceDate',
        populate: {
          path: 'serviceJobId',
          select: 'jobNumber',
          populate: {
            path: 'vehicleId',
            select: 'registrationNumber brand model'
          }
        }
      })
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};
