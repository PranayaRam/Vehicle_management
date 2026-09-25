const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/', authorize('STAFF', 'ADMIN'), getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', authorize('STAFF', 'ADMIN'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
