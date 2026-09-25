const express = require('express');
const router = express.Router();
const {
  getLabour,
  getLabourById,
  createLabour,
  updateLabour,
  deleteLabour
} = require('../controllers/labourController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('STAFF', 'ADMIN'), getLabour);
router.get('/:id', authorize('STAFF', 'ADMIN'), getLabourById);
router.post('/', authorize('ADMIN'), createLabour);
router.put('/:id', authorize('ADMIN'), updateLabour);
router.delete('/:id', authorize('ADMIN'), deleteLabour);

module.exports = router;
