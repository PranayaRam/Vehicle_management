import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  UserCheck,
  Wrench,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import CheckInModal from '../../components/staff/CheckInModal';

const BookingsCheckIn = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // CheckIn Modal State
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let url = '/bookings';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'CONFIRMED' });
      if (res.data.success) {
        setSuccessMsg('Booking confirmed. Customer notified.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchBookings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleOpenCheckIn = (booking) => {
    setSelectedBookingForCheckIn(booking);
    setIsCheckInOpen(true);
  };

  const handleCheckInComplete = (result) => {
    setSuccessMsg(
      `Vehicle checked in successfully! Service Job ${result.serviceJob.jobNumber} created.`
    );
    fetchBookings();
    setTimeout(() => {
      navigate(`/staff/jobs/${result.serviceJob._id}`);
    }, 1500);
  };

  return (
    <div className="staff-bookings-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Service Bookings & Intake Check-In</h1>
          <p className="page-subtitle">Confirm customer appointments, record intake odometer/fuel, and initialize job cards</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="content-card mb-6 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-muted">Status:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['', 'BOOKED', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                >
                  {st || 'All Bookings'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              className="form-control text-sm py-1.5"
              placeholder="Search booking e.g. BK-1001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline btn-sm">
              <Search size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="content-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-10">
              <div className="spinner"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Calendar}
                title="No Bookings Found"
                description="There are currently no vehicle appointments matching your filter criteria."
              />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Service Package</th>
                    <th>Appointment</th>
                    <th>Status</th>
                    <th>Intake Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="font-mono font-bold text-primary">{b.bookingNumber}</td>
                      <td>
                        <div className="font-semibold text-dark">{b.customerId?.name}</div>
                        <span className="text-xs text-muted">{b.customerId?.phone}</span>
                      </td>
                      <td>
                        <div className="font-semibold text-dark">
                          {b.vehicleId?.brand} {b.vehicleId?.model}
                        </div>
                        <span className="plate-badge text-xs">{b.vehicleId?.registrationNumber}</span>
                      </td>
                      <td>
                        <div>{b.serviceTypeId?.name}</div>
                        <span className="text-xs text-muted">Est. ₹{b.serviceTypeId?.basePrice?.toLocaleString()}</span>
                      </td>
                      <td>
                        <div className="font-medium text-dark">
                          {new Date(b.preferredDate).toLocaleDateString()}
                        </div>
                        <span className="text-xs text-muted">{b.preferredTime}</span>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        <div className="flex gap-1.5">
                          {b.status === 'BOOKED' && (
                            <>
                              <button
                                onClick={() => handleConfirmBooking(b._id)}
                                className="btn btn-outline btn-sm text-primary"
                                title="Confirm Appointment"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleOpenCheckIn(b)}
                                className="btn btn-primary btn-sm"
                              >
                                Check In
                              </button>
                            </>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleOpenCheckIn(b)}
                              className="btn btn-primary btn-sm"
                            >
                              Check In Vehicle
                            </button>
                          )}
                          {b.status === 'CHECKED_IN' && (
                            <span className="text-xs font-semibold text-success flex items-center gap-1">
                              <CheckCircle2 size={14} /> Intake Completed
                            </span>
                          )}
                          {b.status === 'CANCELLED' && (
                            <span className="text-xs text-muted italic">Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CheckIn Modal */}
      {selectedBookingForCheckIn && (
        <CheckInModal
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
          booking={selectedBookingForCheckIn}
          onCheckInComplete={handleCheckInComplete}
        />
      )}
    </div>
  );
};

export default BookingsCheckIn;
