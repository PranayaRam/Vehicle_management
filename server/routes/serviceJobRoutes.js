const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJobStatus
} = require('../controllers/serviceJobController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', getMyJobs);
router.get('/', authorize('STAFF', 'ADMIN'), getAllJobs);
router.get('/:id', getJobById);
router.put('/:id/status', authorize('STAFF', 'ADMIN'), updateJobStatus);

module.exports = router;
