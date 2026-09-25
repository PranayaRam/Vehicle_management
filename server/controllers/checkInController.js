const CheckIn = require('../models/CheckIn');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const ServiceJob = require('../models/ServiceJob');
const StatusHistory = require('../models/StatusHistory');
const Counter = require('../models/Counter');

// @desc    Perform vehicle check-in and create service job
// @route   POST /api/check-in
// @access  Private (Staff, Admin)
exports.performCheckIn = async (req, res, next) => {
  try {
    const {
      bookingId,
      currentMileage,
      fuelLevel,
      exteriorCondition,
      existingDamage,
      customerComplaint,
      notes
    } = req.body;

    if (!bookingId || currentMileage === undefined || !fuelLevel || !customerComplaint) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking ID, mileage, fuel level, and verified complaint'
      });
    }

    const booking = await Booking.findById(bookingId).populate('vehicleId customerId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'CHECKED_IN') {
      return res.status(400).json({
        success: false,
        message: 'This vehicle has already been checked in'
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot check in a cancelled booking'
      });
    }

    const vehicle = await Vehicle.findById(booking.vehicleId._id);
    const intakeMileage = Number(currentMileage);

    // Mileage rule: intake mileage cannot be less than last recorded mileage
    if (intakeMileage < vehicle.currentMileage) {
      return res.status(400).json({
        success: false,
        message: `Intake mileage (${intakeMileage} km) cannot be less than vehicle's recorded mileage (${vehicle.currentMileage} km)`
      });
    }

    // Update vehicle's current mileage
    vehicle.currentMileage = intakeMileage;
    await vehicle.save();

    // 1. Create CheckIn record
    const checkIn = await CheckIn.create({
      bookingId: booking._id,
      vehicleId: vehicle._id,
      staffId: req.user._id,
      currentMileage: intakeMileage,
      fuelLevel,
      exteriorCondition: exteriorCondition ? exteriorCondition.trim() : 'Standard condition',
      existingDamage: existingDamage ? existingDamage.trim() : 'No prior damage reported',
      customerComplaint: customerComplaint.trim(),
      notes: notes ? notes.trim() : ''
    });

    // 2. Update booking status to CHECKED_IN
    booking.status = 'CHECKED_IN';
    await booking.save();

    // 3. Generate sequential Service Job Number e.g. SJ-1001
    const seq = await Counter.getNextSequence('jobNumber');
    const jobNumber = `SJ-${seq}`;

    // 4. Create Service Job
    const serviceJob = await ServiceJob.create({
      jobNumber,
      bookingId: booking._id,
      customerId: booking.customerId._id,
      vehicleId: vehicle._id,
      assignedStaffId: req.user._id,
      status: 'INSPECTION',
      reportedProblem: customerComplaint.trim(),
      serviceNotes: notes ? `Intake: ${notes.trim()}` : ''
    });

    // 5. Record in StatusHistory
    await StatusHistory.create({
      serviceJobId: serviceJob._id,
      oldStatus: 'BOOKED',
      newStatus: 'INSPECTION',
      changedBy: req.user._id,
      remarks: `Vehicle checked in by ${req.user.name}. Odometer: ${intakeMileage} km, Fuel: ${fuelLevel}.`
    });

    const populatedJob = await ServiceJob.findById(serviceJob._id)
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'registrationNumber brand model variant fuelType currentMileage')
      .populate('assignedStaffId', 'name email role');

    res.status(201).json({
      success: true,
      message: `Vehicle checked in successfully. Service Job ${jobNumber} initialized.`,
      data: {
        checkIn,
        serviceJob: populatedJob
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get check-in details for a booking
// @route   GET /api/check-in/booking/:bookingId
// @access  Private
exports.getCheckInByBookingId = async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findOne({ bookingId: req.params.bookingId })
      .populate('staffId', 'name email')
      .populate('vehicleId', 'registrationNumber brand model')
      .populate('bookingId');

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'No check-in record found for this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: checkIn
    });
  } catch (error) {
    next(error);
  }
};
