const express = require('express');
const router = express.Router();
const {
  markReadyForDelivery,
  completeDelivery,
  getVehicleServiceHistory,
  getAllDeliveries
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('STAFF', 'ADMIN'), getAllDeliveries);
router.put('/ready/:jobId', authorize('STAFF', 'ADMIN'), markReadyForDelivery);
router.post('/', authorize('STAFF', 'ADMIN'), completeDelivery);
router.get('/history/:vehicleId', getVehicleServiceHistory);

module.exports = router;
