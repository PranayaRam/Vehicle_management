const express = require('express');
const router = express.Router();
const {
  generateInvoice,
  getInvoiceById,
  getInvoiceByJobId,
  getMyInvoices,
  getAllInvoices
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('STAFF', 'ADMIN'), generateInvoice);
router.get('/my', getMyInvoices);
router.get('/', authorize('STAFF', 'ADMIN'), getAllInvoices);
router.get('/job/:jobId', getInvoiceByJobId);
router.get('/:id', getInvoiceById);

module.exports = router;
