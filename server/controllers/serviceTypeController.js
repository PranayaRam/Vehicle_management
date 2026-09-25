const ServiceType = require('../models/ServiceType');

// @desc    Get all service types
// @route   GET /api/service-types
// @access  Public / Private
exports.getServiceTypes = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    let query = { isActive: true };

    // If admin explicitly wants all including inactive
    if (includeInactive === 'true' && req.user && req.user.role === 'ADMIN') {
      query = {};
    }

    const serviceTypes = await ServiceType.find(query).sort({ basePrice: 1 });

    res.status(200).json({
      success: true,
      count: serviceTypes.length,
      data: serviceTypes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service type by ID
// @route   GET /api/service-types/:id
// @access  Public / Private
exports.getServiceTypeById = async (req, res, next) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: serviceType
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service type
// @route   POST /api/service-types
// @access  Private (Admin)
exports.createServiceType = async (req, res, next) => {
  try {
    const { name, description, basePrice, estimatedDuration, isActive } = req.body;

    if (!name || !description || basePrice === undefined || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, basePrice, and estimatedDuration'
      });
    }

    const serviceType = await ServiceType.create({
      name: name.trim(),
      description: description.trim(),
      basePrice: Number(basePrice),
      estimatedDuration: estimatedDuration.trim(),
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Service type created successfully',
      data: serviceType
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service type
// @route   PUT /api/service-types/:id
// @access  Private (Admin)
exports.updateServiceType = async (req, res, next) => {
  try {
    const serviceType = await ServiceType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service type updated successfully',
      data: serviceType
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate service type
// @route   DELETE /api/service-types/:id
// @access  Private (Admin)
exports.deleteServiceType = async (req, res, next) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    // Soft delete to maintain historical booking integrity
    serviceType.isActive = false;
    await serviceType.save();

    res.status(200).json({
      success: true,
      message: 'Service type deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};
