const express = require('express');
const router = express.Router();
const { createInspection, getInspectionByJobId, getAllInspections } = require('../controllers/inspectionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('STAFF', 'ADMIN'), createInspection);
router.get('/', authorize('STAFF', 'ADMIN'), getAllInspections);
router.get('/:jobId', getInspectionByJobId);

module.exports = router;
