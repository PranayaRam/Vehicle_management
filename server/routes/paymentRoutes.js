const express = require('express');
const router = express.Router();
const { recordPayment, getPaymentsByInvoiceId, getAllPayments, getMyPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', recordPayment);
router.get('/', authorize('STAFF', 'ADMIN'), getAllPayments);
router.get('/my', getMyPayments);
router.get('/:invoiceId', getPaymentsByInvoiceId);

module.exports = router;
