import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Car,
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const MyBookings = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');

  // Cancel Booking Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
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
  }, []);

  const handleOpenCancel = (booking) => {
    setBookingToCancel(booking);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelling(true);
    try {
      const res = await api.put(`/bookings/${bookingToCancel._id}/cancel`, {
        reason: cancelReason || 'Cancelled by customer'
      });
      if (res.data.success) {
        setSuccessMsg(`Booking ${bookingToCancel.bookingNumber} has been cancelled.`);
        setCancelModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bookings-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Service Bookings</h1>
          <p className="page-subtitle">Track your appointment intake, check-in status, and garage scheduling</p>
        </div>
        <Link to="/customer/book" className="btn btn-primary">
          <CalendarPlus size={16} /> New Booking
        </Link>
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

      {loading ? (
        <div className="flex-center py-10">
          <div className="spinner"></div>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Service Bookings Yet"
          description="You haven't scheduled any service appointments. Select one of your registered vehicles and schedule a visit."
          actionText="Book Service Appointment"
          onAction={() => (window.location.href = '/customer/book')}
        />
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card content-card mb-4">
              <div className="booking-card-header flex-between">
                <div className="flex items-center gap-3">
                  <span className="booking-num-tag">{b.bookingNumber}</span>
                  <StatusBadge status={b.status} />
                </div>
                <div className="booking-timing text-sm text-muted flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-dark">
                    <Calendar size={15} className="text-primary" /> {formatDate(b.preferredDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={15} className="text-muted" /> {b.preferredTime}
                  </span>
                </div>
              </div>

              <div className="booking-card-body">
                <div className="booking-vehicle-meta">
                  <div className="flex items-center gap-2 mb-1">
                    <Car size={16} className="text-primary" />
                    <h3 className="font-bold text-dark">
                      {b.vehicleId?.brand} {b.vehicleId?.model}
                    </h3>
                    <span className="plate-badge text-xs">{b.vehicleId?.registrationNumber}</span>
                  </div>
                  <p className="text-xs text-muted">
                    {b.serviceTypeId?.name} (Est. Base ₹{b.serviceTypeId?.basePrice?.toLocaleString()})
                  </p>
                </div>

                <div className="booking-problem-box mt-3">
                  <span className="text-xs font-bold text-muted block mb-1">Reported Issue:</span>
                  <p className="text-sm text-dark bg-slate-50 p-2.5 rounded border border-border">
                    "{b.problemDescription}"
                  </p>
                </div>

                {b.cancellationReason && (
                  <div className="text-xs text-danger mt-2 font-medium">
                    Cancellation note: {b.cancellationReason}
                  </div>
                )}
              </div>

              <div className="booking-card-footer flex-between">
                <span className="text-xs text-muted">
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </span>
                <div className="booking-actions flex gap-2">
                  {(b.status === 'BOOKED' || b.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleOpenCancel(b)}
                      className="btn btn-outline btn-sm text-danger hover:bg-danger-subtle"
                    >
                      <XCircle size={15} /> Cancel Booking
                    </button>
                  )}
                  {b.status === 'CHECKED_IN' && (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <Clock size={13} /> Checked-in at bay. Inspection underway.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title={`Cancel Booking: ${bookingToCancel?.bookingNumber}`}
      >
        <div className="cancel-booking-form">
          <p className="text-sm text-muted mb-3">
            Are you sure you want to cancel this booking for your{' '}
            <strong>
              {bookingToCancel?.vehicleId?.brand} {bookingToCancel?.vehicleId?.model} (
              {bookingToCancel?.vehicleId?.registrationNumber})
            </strong>
            ?
          </p>

          <div className="form-group mb-4">
            <label className="form-label">Reason for Cancellation</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="e.g. Schedule conflict, problem resolved, rescheduling for next week..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="btn btn-primary btn-sm bg-danger border-danger"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
