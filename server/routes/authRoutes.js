const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  createStaff,
  toggleUserStatus
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// User management
router.get('/users', protect, authorize('STAFF', 'ADMIN'), getAllUsers);
router.post('/staff', protect, authorize('ADMIN'), createStaff);
router.put('/users/:id/status', protect, authorize('ADMIN'), toggleUserStatus);

module.exports = router;
