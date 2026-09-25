const express = require('express');
const router = express.Router();
const { performCheckIn, getCheckInByBookingId } = require('../controllers/checkInController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('STAFF', 'ADMIN'), performCheckIn);
router.get('/booking/:bookingId', getCheckInByBookingId);

module.exports = router;
