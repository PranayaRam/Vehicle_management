const Labour = require('../models/Labour');

// @desc    Get all labour services
// @route   GET /api/labour
// @access  Private (Staff, Admin)
exports.getLabour = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const labour = await Labour.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: labour.length,
      data: labour
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get labour by ID
// @route   GET /api/labour/:id
// @access  Private
exports.getLabourById = async (req, res, next) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: labour
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create labour service (Admin)
// @route   POST /api/labour
// @access  Private (Admin)
exports.createLabour = async (req, res, next) => {
  try {
    const { name, description, charge, estimatedDuration } = req.body;

    if (!name || charge === undefined || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, charge, and estimated duration'
      });
    }

    const labour = await Labour.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      charge: Number(charge),
      estimatedDuration: estimatedDuration.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Labour service operation added to catalog',
      data: labour
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update labour service (Admin)
// @route   PUT /api/labour/:id
// @access  Private (Admin)
exports.updateLabour = async (req, res, next) => {
  try {
    const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Labour service updated successfully',
      data: labour
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate labour (Admin)
// @route   DELETE /api/labour/:id
// @access  Private (Admin)
exports.deleteLabour = async (req, res, next) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour service not found'
      });
    }

    labour.isActive = false;
    await labour.save();

    res.status(200).json({
      success: true,
      message: 'Labour service deactivated'
    });
  } catch (error) {
    next(error);
  }
};
