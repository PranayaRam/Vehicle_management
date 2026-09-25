const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const ServiceJob = require('../models/ServiceJob');
const Estimate = require('../models/Estimate');
const Invoice = require('../models/Invoice');
const Part = require('../models/Part');

// @desc    Get metrics for Customer Dashboard
// @route   GET /api/dashboard/customer
// @access  Private (Customer)
exports.getCustomerDashboard = async (req, res, next) => {
  try {
    const customerId = req.user._id;

    const [vehicleCount, bookings, activeJobs] = await Promise.all([
      Vehicle.countDocuments({ customerId }),
      Booking.find({ customerId }).sort({ createdAt: -1 }),
      ServiceJob.find({ customerId, status: { $nin: ['COMPLETED', 'CANCELLED'] } })
    ]);

    const activeBookings = bookings.filter(b => ['BOOKED', 'CONFIRMED', 'CHECKED_IN'].includes(b.status));
    const completedServices = await ServiceJob.countDocuments({ customerId, status: 'COMPLETED' });
    const pendingApprovals = await Estimate.countDocuments({ customerId, status: 'PENDING_APPROVAL' });

    res.status(200).json({
      success: true,
      data: {
        totalVehicles: vehicleCount,
        activeBookings: activeBookings.length,
        pendingApprovals,
        completedServices,
        recentBookings: bookings.slice(0, 5),
        activeJobs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get metrics for Staff Dashboard
// @route   GET /api/dashboard/staff
// @access  Private (Staff, Admin)
exports.getStaffDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [
      todaysBookings,
      pendingCheckIns,
      activeJobs,
      awaitingApproval,
      readyForDelivery,
      completedToday
    ] = await Promise.all([
      Booking.countDocuments({ preferredDate: { $gte: startOfDay, $lte: endOfDay } }),
      Booking.countDocuments({ status: { $in: ['BOOKED', 'CONFIRMED'] } }),
      ServiceJob.countDocuments({ status: { $in: ['INSPECTION', 'ESTIMATE_PENDING', 'APPROVED', 'IN_SERVICE', 'QUALITY_CHECK'] } }),
      Estimate.countDocuments({ status: 'PENDING_APPROVAL' }),
      ServiceJob.countDocuments({ status: 'READY_FOR_DELIVERY' }),
      ServiceJob.countDocuments({ status: 'COMPLETED', updatedAt: { $gte: startOfDay, $lte: endOfDay } })
    ]);

    const recentJobs = await ServiceJob.find()
      .populate('customerId', 'name email phone')
      .populate('vehicleId', 'registrationNumber brand model')
      .populate('assignedStaffId', 'name')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: {
        todaysBookings,
        pendingCheckIns,
        activeJobs,
        awaitingApproval,
        readyForDelivery,
        completedToday,
        recentJobs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get metrics and reports for Admin Dashboard
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalStaff,
      totalVehicles,
      activeJobs,
      pendingApprovals,
      completedServices,
      readyForDelivery,
      allInvoices,
      parts
    ] = await Promise.all([
      User.countDocuments({ role: 'CUSTOMER' }),
      User.countDocuments({ role: 'STAFF' }),
      Vehicle.countDocuments(),
      ServiceJob.countDocuments({ status: { $in: ['INSPECTION', 'ESTIMATE_PENDING', 'APPROVED', 'IN_SERVICE', 'QUALITY_CHECK'] } }),
      Estimate.countDocuments({ status: 'PENDING_APPROVAL' }),
      ServiceJob.countDocuments({ status: 'COMPLETED' }),
      ServiceJob.countDocuments({ status: 'READY_FOR_DELIVERY' }),
      Invoice.find(),
      Part.find({ isActive: true })
    ]);

    // Financial totals
    const totalRevenue = allInvoices.reduce((acc, inv) => acc + (inv.amountPaid || 0), 0);
    const pendingReceivables = allInvoices
      .filter(inv => inv.paymentStatus !== 'PAID')
      .reduce((acc, inv) => acc + (inv.total - (inv.amountPaid || 0)), 0);

    // Low stock parts
    const lowStockParts = parts.filter(p => p.stockQuantity <= p.minimumStock);

    // Job Status breakdown
    const statusCounts = await ServiceJob.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          totalStaff,
          totalVehicles,
          activeJobs,
          pendingApprovals,
          completedServices,
          readyForDelivery,
          totalRevenue,
          pendingReceivables,
          lowStockCount: lowStockParts.length
        },
        lowStockParts,
        statusBreakdown: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};
