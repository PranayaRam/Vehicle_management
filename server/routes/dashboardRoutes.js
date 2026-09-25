const express = require('express');
const router = express.Router();
const {
  getCustomerDashboard,
  getStaffDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/customer', authorize('CUSTOMER', 'ADMIN'), getCustomerDashboard);
router.get('/staff', authorize('STAFF', 'ADMIN'), getStaffDashboard);
router.get('/admin', authorize('ADMIN'), getAdminDashboard);

module.exports = router;
