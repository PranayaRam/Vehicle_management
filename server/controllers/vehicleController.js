const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private (Customer, Admin)
exports.createVehicle = async (req, res, next) => {
  try {
    const {
      registrationNumber,
      brand,
      model,
      variant,
      manufacturingYear,
      fuelType,
      currentMileage,
      vin,
      customerId
    } = req.body;

    if (!registrationNumber || !brand || !model || !manufacturingYear || !fuelType || currentMileage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required vehicle details'
      });
    }

    const regUpper = registrationNumber.toUpperCase().trim().replace(/\s+/g, '');

    // Check if registration number already exists
    const existingVehicle = await Vehicle.findOne({ registrationNumber: regUpper });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: `Vehicle with registration number ${regUpper} is already registered`
      });
    }

    // Assign customer ownership
    let assignedCustomer = req.user._id;
    if (req.user.role === 'ADMIN' && customerId) {
      assignedCustomer = customerId;
    }

    const vehicle = await Vehicle.create({
      customerId: assignedCustomer,
      registrationNumber: regUpper,
      brand: brand.trim(),
      model: model.trim(),
      variant: variant ? variant.trim() : '',
      manufacturingYear: Number(manufacturingYear),
      fuelType,
      currentMileage: Number(currentMileage),
      vin: vin ? vin.toUpperCase().trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicles belonging to current logged-in customer
// @route   GET /api/vehicles/my
// @access  Private (Customer)
exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicles (Staff & Admin)
// @route   GET /api/vehicles
// @access  Private (Staff, Admin)
exports.getAllVehicles = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { registrationNumber: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const vehicles = await Vehicle.find(query)
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('customerId', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Ownership check: Customer can only view their own vehicle
    if (req.user.role === 'CUSTOMER' && vehicle.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this vehicle'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Ownership check
    if (req.user.role === 'CUSTOMER' && vehicle.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot update another customer\'s vehicle'
      });
    }

    const { brand, model, variant, manufacturingYear, fuelType, currentMileage, vin } = req.body;

    // Mileage rule: mileage cannot decrease
    if (currentMileage !== undefined) {
      const newMileage = Number(currentMileage);
      if (newMileage < vehicle.currentMileage && req.user.role === 'CUSTOMER') {
        return res.status(400).json({
          success: false,
          message: `Updated mileage (${newMileage} km) cannot be less than existing recorded mileage (${vehicle.currentMileage} km)`
        });
      }
      vehicle.currentMileage = newMileage;
    }

    if (brand) vehicle.brand = brand.trim();
    if (model) vehicle.model = model.trim();
    if (variant !== undefined) vehicle.variant = variant.trim();
    if (manufacturingYear) vehicle.manufacturingYear = Number(manufacturingYear);
    if (fuelType) vehicle.fuelType = fuelType;
    if (vin !== undefined) vehicle.vin = vin.toUpperCase().trim();

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Ownership check
    if (req.user.role === 'CUSTOMER' && vehicle.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot delete another customer\'s vehicle'
      });
    }

    // Business check: Prevent deletion if active bookings exist
    const activeBookings = await Booking.find({
      vehicleId: vehicle._id,
      status: { $in: ['BOOKED', 'CONFIRMED', 'CHECKED_IN'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active service bookings or jobs'
      });
    }

    await Vehicle.findByIdAndDelete(vehicle._id);

    res.status(200).json({
      success: true,
      message: 'Vehicle removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
