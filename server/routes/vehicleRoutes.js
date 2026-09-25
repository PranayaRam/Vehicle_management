const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getMyVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

// Private routes for authenticated users
router.use(protect);

router.post('/', createVehicle);
router.get('/my', getMyVehicles);
router.get('/', authorize('STAFF', 'ADMIN'), getAllVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
