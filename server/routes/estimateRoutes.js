const express = require('express');
const router = express.Router();
const {
  generateEstimate,
  getEstimateByJobId,
  approveEstimate,
  rejectEstimate,
  getAllEstimates,
  getMyEstimates
} = require('../controllers/estimateController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('STAFF', 'ADMIN'), generateEstimate);
router.get('/', authorize('STAFF', 'ADMIN'), getAllEstimates);
router.get('/my', getMyEstimates);
router.get('/job/:jobId', getEstimateByJobId);
router.put('/:id/approve', approveEstimate);
router.put('/:id/reject', rejectEstimate);

module.exports = router;
