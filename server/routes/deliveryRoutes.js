const express = require('express');
const router = express.Router();
const {
  markReadyForDelivery,
  completeDelivery,
  getVehicleServiceHistory
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.put('/ready/:jobId', authorize('STAFF', 'ADMIN'), markReadyForDelivery);
router.post('/', authorize('STAFF', 'ADMIN'), completeDelivery);
router.get('/history/:vehicleId', getVehicleServiceHistory);

module.exports = router;
