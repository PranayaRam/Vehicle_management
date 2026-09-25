const express = require('express');
const router = express.Router();
const {
  generateEstimate,
  getEstimateByJobId,
  approveEstimate,
  rejectEstimate
} = require('../controllers/estimateController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('STAFF', 'ADMIN'), generateEstimate);
router.get('/job/:jobId', getEstimateByJobId);
router.put('/:id/approve', approveEstimate);
router.put('/:id/reject', rejectEstimate);

module.exports = router;
