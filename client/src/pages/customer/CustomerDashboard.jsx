import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  CalendarPlus,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [vehRes, bookRes] = await Promise.all([
          api.get('/vehicles/my'),
          api.get('/bookings/my')
        ]);

        if (vehRes.data.success) {
          setVehicles(vehRes.data.data);
        }
        if (bookRes.data.success) {
          setBookings(bookRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load customer dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeBookings = bookings.filter((b) => ['BOOKED', 'CONFIRMED', 'CHECKED_IN'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const upcomingService = activeBookings.length > 0 ? activeBookings[0] : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Customer Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Manage your vehicles and service schedules</p>
        </div>
        <div className="page-actions flex gap-2">
          <Link to="/customer/vehicles" className="btn btn-outline">
            <Car size={16} /> My Vehicles
          </Link>
          <Link to="/customer/book" className="btn btn-primary">
            <CalendarPlus size={16} /> Book Service
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-subtle text-primary">
            <Car size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : vehicles.length}</span>
            <span className="stat-name">My Vehicles</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-amber-subtle text-amber">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : activeBookings.length}</span>
            <span className="stat-name">Active Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-purple-subtle text-purple">
            <ClipboardList size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : bookings.length}</span>
            <span className="stat-name">Total Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-subtle text-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : completedBookings.length}</span>
            <span className="stat-name">Completed Services</span>
          </div>
        </div>
      </div>

      {/* Highlight: Upcoming Service Card */}
      {upcomingService ? (
        <div className="content-card mb-6 border-l-4 border-l-primary">
          <div className="card-header flex-between">
            <h3 className="card-title flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Upcoming Service Appointment
            </h3>
            <StatusBadge status={upcomingService.status} />
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-xs text-muted block mb-1">Vehicle</span>
                <strong className="text-dark">
                  {upcomingService.vehicleId?.brand} {upcomingService.vehicleId?.model}
                </strong>
                <p className="text-xs text-muted font-mono">{upcomingService.vehicleId?.registrationNumber}</p>
              </div>
              <div>
                <span className="text-xs text-muted block mb-1">Service Package</span>
                <strong className="text-primary">{upcomingService.serviceTypeId?.name}</strong>
                <p className="text-xs text-muted">Est. ₹{upcomingService.serviceTypeId?.basePrice?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-muted block mb-1">Scheduled Date & Time</span>
                <strong className="text-dark">{formatDate(upcomingService.preferredDate)}</strong>
                <p className="text-xs text-muted">{upcomingService.preferredTime}</p>
              </div>
              <div className="flex items-center justify-end">
                <Link to="/customer/bookings" className="btn btn-outline btn-sm">
                  View Booking Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="content-card mb-6 p-6 text-center">
          <Car size={36} className="text-primary mx-auto mb-2" />
          <h3 className="mb-2">No Vehicles Added Yet</h3>
          <p className="text-muted text-sm mb-4">
            Add your car or SUV to your profile to unlock one-click service bookings and maintenance history.
          </p>
          <Link to="/customer/vehicles" className="btn btn-primary btn-sm">
            <Plus size={16} /> Register Vehicle Now
          </Link>
        </div>
      ) : null}

      {/* Recent Booking Activity */}
      <div className="content-card mb-6">
        <div className="card-header flex-between">
          <h3 className="card-title">Recent Service Bookings</h3>
          <Link to="/customer/bookings" className="text-sm font-semibold text-primary hover:underline">
            View All ({bookings.length})
          </Link>
        </div>
        <div className="card-body p-0">
          {bookings.length === 0 ? (
            <p className="p-6 text-muted text-sm text-center">
              No recent bookings found. Schedule your vehicle for its regular maintenance.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Vehicle</th>
                    <th>Service Package</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b._id}>
                      <td className="font-mono font-bold text-primary">{b.bookingNumber}</td>
                      <td>
                        <div className="font-semibold text-dark">
                          {b.vehicleId?.brand} {b.vehicleId?.model}
                        </div>
                        <span className="text-xs text-muted font-mono">{b.vehicleId?.registrationNumber}</span>
                      </td>
                      <td>{b.serviceTypeId?.name}</td>
                      <td>
                        <div>{formatDate(b.preferredDate)}</div>
                        <span className="text-xs text-muted">{b.preferredTime}</span>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        <Link to="/customer/bookings" className="btn btn-ghost btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
