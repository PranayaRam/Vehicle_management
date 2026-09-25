const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const ServiceType = require('../models/ServiceType');
const Counter = require('../models/Counter');

// @desc    Create a new service booking
// @route   POST /api/bookings
// @access  Private (Customer, Admin)
exports.createBooking = async (req, res, next) => {
  try {
    const { vehicleId, serviceTypeId, preferredDate, preferredTime, problemDescription } = req.body;

    if (!vehicleId || !serviceTypeId || !preferredDate || !preferredTime || !problemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle, service type, preferred date, time, and problem description'
      });
    }

    // Date validation: Ensure date is not before today (allowing today)
    const bookingDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Preferred service date cannot be in the past'
      });
    }

    // Verify Vehicle exists and verify customer ownership
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Selected vehicle not found'
      });
    }

    // Rule: Customer cannot book a vehicle belonging to another customer
    if (req.user.role === 'CUSTOMER' && vehicle.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only book service for your own vehicle'
      });
    }

    // Verify ServiceType exists and is active
    const serviceType = await ServiceType.findById(serviceTypeId);
    if (!serviceType || !serviceType.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Selected service type is currently unavailable'
      });
    }

    // Generate unique sequential business identifier e.g. BK-1001
    const seq = await Counter.getNextSequence('bookingNumber');
    const bookingNumber = `BK-${seq}`;

    const booking = await Booking.create({
      bookingNumber,
      customerId: vehicle.customerId,
      vehicleId,
      serviceTypeId,
      preferredDate: bookingDate,
      preferredTime: preferredTime.trim(),
      problemDescription: problemDescription.trim(),
      status: 'BOOKED'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage')
      .populate('serviceTypeId', 'name basePrice estimatedDuration')
      .populate('customerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Service appointment booked successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for current customer
// @route   GET /api/bookings/my
// @access  Private (Customer)
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage')
      .populate('serviceTypeId', 'name basePrice estimatedDuration')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings with filters (Staff & Admin)
// @route   GET /api/bookings
// @access  Private (Staff, Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, date, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const queryDate = new Date(date);
      const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
      query.preferredDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage')
      .populate('serviceTypeId', 'name basePrice estimatedDuration')
      .sort({ preferredDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage vin')
      .populate('serviceTypeId', 'name description basePrice estimatedDuration');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ownership check
    if (req.user.role === 'CUSTOMER' && booking.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Staff & Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Staff, Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const validStatuses = ['BOOKED', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (remarks) {
      booking.cancellationReason = remarks;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ownership verification
    if (booking.customerId.toString() !== req.user._id.toString() && req.user.role === 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only cancel your own booking'
      });
    }

    // Business rule: Cannot cancel if already checked-in
    if (booking.status === 'CHECKED_IN') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle has already been checked into the service bay. Please contact service advisor.'
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled'
      });
    }

    booking.status = 'CANCELLED';
    booking.cancellationReason = reason ? reason.trim() : 'Cancelled by customer';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
