const express = require('express');
const router = express.Router();
const {
  getServiceTypes,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType
} = require('../controllers/serviceTypeController');
const { protect, authorize } = require('../middleware/auth');

// Public route to view service types
router.get('/', getServiceTypes);
router.get('/:id', getServiceTypeById);

// Admin-restricted routes
router.post('/', protect, authorize('ADMIN'), createServiceType);
router.put('/:id', protect, authorize('ADMIN'), updateServiceType);
router.delete('/:id', protect, authorize('ADMIN'), deleteServiceType);

module.exports = router;
