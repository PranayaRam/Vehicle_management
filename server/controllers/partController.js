const Part = require('../models/Part');

// @desc    Get all parts
// @route   GET /api/parts
// @access  Private (Staff, Admin)
exports.getParts = async (req, res, next) => {
  try {
    const { category, search, lowStockOnly } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } }
      ];
    }

    let parts = await Part.find(query).sort({ name: 1 });

    if (lowStockOnly === 'true') {
      parts = parts.filter(p => p.stockQuantity <= p.minimumStock);
    }

    // Add lowStock flag to each item
    const formatted = parts.map(p => ({
      ...p.toObject(),
      isLowStock: p.stockQuantity <= p.minimumStock
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get part by ID
// @route   GET /api/parts/:id
// @access  Private
exports.getPartById = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...part.toObject(),
        isLowStock: part.stockQuantity <= part.minimumStock
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new spare part (Admin)
// @route   POST /api/parts
// @access  Private (Admin)
exports.createPart = async (req, res, next) => {
  try {
    const { name, partNumber, category, stockQuantity, minimumStock, unitPrice, supplier } = req.body;

    if (!name || !partNumber || stockQuantity === undefined || unitPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, partNumber, stockQuantity, and unitPrice'
      });
    }

    const existing = await Part.findOne({ partNumber: partNumber.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A part with part number ${partNumber.toUpperCase()} already exists`
      });
    }

    const part = await Part.create({
      name: name.trim(),
      partNumber: partNumber.toUpperCase().trim(),
      category: category || 'General',
      stockQuantity: Number(stockQuantity),
      minimumStock: minimumStock !== undefined ? Number(minimumStock) : 5,
      unitPrice: Number(unitPrice),
      supplier: supplier ? supplier.trim() : 'Authorized OEM Supplier'
    });

    res.status(201).json({
      success: true,
      message: 'Part created successfully in inventory',
      data: part
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update part / restock (Admin)
// @route   PUT /api/parts/:id
// @access  Private (Admin)
exports.updatePart = async (req, res, next) => {
  try {
    const part = await Part.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Part updated successfully',
      data: part
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate part (Admin)
// @route   DELETE /api/parts/:id
// @access  Private (Admin)
exports.deletePart = async (req, res, next) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    part.isActive = false;
    await part.save();

    res.status(200).json({
      success: true,
      message: 'Part deactivated from inventory'
    });
  } catch (error) {
    next(error);
  }
};
