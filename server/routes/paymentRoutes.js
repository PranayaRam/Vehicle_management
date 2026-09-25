const express = require('express');
const router = express.Router();
const { recordPayment, getPaymentsByInvoiceId } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', recordPayment);
router.get('/:invoiceId', getPaymentsByInvoiceId);

module.exports = router;
