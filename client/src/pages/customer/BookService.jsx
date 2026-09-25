import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  CalendarPlus,
  Car,
  Wrench,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import VehicleModal from '../../components/vehicles/VehicleModal';

const BookService = () => {
  const [searchParams] = useSearchParams();
  const preselectedVehicleId = searchParams.get('vehicleId');

  const [vehicles, setVehicles] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState(preselectedVehicleId || '');
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [problemDescription, setProblemDescription] = useState('');

  // Quick Add Vehicle Modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  // Minimum date today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehRes, stRes] = await Promise.all([
          api.get('/vehicles/my'),
          api.get('/service-types')
        ]);

        if (vehRes.data.success) {
          setVehicles(vehRes.data.data);
          if (preselectedVehicleId) {
            setSelectedVehicleId(preselectedVehicleId);
          } else if (vehRes.data.data.length > 0) {
            setSelectedVehicleId(vehRes.data.data[0]._id);
          }
        }

        if (stRes.data.success) {
          setServiceTypes(stRes.data.data);
          if (stRes.data.data.length > 0) {
            setSelectedServiceTypeId(stRes.data.data[0]._id);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize booking form');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preselectedVehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedVehicleId) {
      return setError('Please select a vehicle or add one first.');
    }

    if (!selectedServiceTypeId) {
      return setError('Please choose a service package.');
    }

    if (!preferredDate) {
      return setError('Please choose a preferred service date.');
    }

    if (!problemDescription.trim()) {
      return setError('Please describe the problem or service request.');
    }

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        vehicleId: selectedVehicleId,
        serviceTypeId: selectedServiceTypeId,
        preferredDate,
        preferredTime,
        problemDescription
      });

      if (res.data.success) {
        navigate('/customer/bookings', {
          state: {
            successMessage: `Booking ${res.data.data.bookingNumber} created successfully! Our service advisor will confirm shortly.`
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVehicleCreated = (newVehicle) => {
    setVehicles([newVehicle, ...vehicles]);
    setSelectedVehicleId(newVehicle._id);
  };

  if (loading) {
    return (
      <div className="flex-center py-10">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="booking-page max-w-4xl mx-auto">
      <div className="page-header mb-6">
        <h1 className="page-title">Book a Service Appointment</h1>
        <p className="page-subtitle">Schedule your vehicle for periodic maintenance, diagnostics, or repairs</p>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="content-card p-6 text-center">
          <Car size={42} className="text-muted mx-auto mb-3" />
          <h3 className="mb-2">No Registered Vehicle Found</h3>
          <p className="text-muted text-sm mb-4">
            You must add a vehicle to your profile before scheduling an appointment.
          </p>
          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className="btn btn-primary"
          >
            <PlusCircle size={16} /> Register Vehicle Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Step 1: Select Vehicle */}
          <div className="content-card mb-6">
            <div className="card-header flex-between">
              <h3 className="card-title">1. Select Your Vehicle</h3>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(true)}
                className="btn btn-ghost btn-sm text-primary"
              >
                + Add Another Vehicle
              </button>
            </div>
            <div className="card-body">
              <div className="vehicle-selection-grid">
                {vehicles.map((v) => (
                  <div
                    key={v._id}
                    onClick={() => setSelectedVehicleId(v._id)}
                    className={`selectable-card ${selectedVehicleId === v._id ? 'selected' : ''}`}
                  >
                    <div className="flex-between mb-2">
                      <span className="plate-badge">{v.registrationNumber}</span>
                      <span className="fuel-pill text-xs">{v.fuelType}</span>
                    </div>
                    <h4 className="font-bold text-dark">
                      {v.brand} {v.model}
                    </h4>
                    <p className="text-xs text-muted">
                      {v.variant || 'Standard'} • {v.currentMileage?.toLocaleString()} km
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Choose Service Type */}
          <div className="content-card mb-6">
            <div className="card-header">
              <h3 className="card-title">2. Choose Service Package</h3>
            </div>
            <div className="card-body">
              <div className="service-type-grid">
                {serviceTypes.map((st) => (
                  <div
                    key={st._id}
                    onClick={() => setSelectedServiceTypeId(st._id)}
                    className={`selectable-service-card ${selectedServiceTypeId === st._id ? 'selected' : ''}`}
                  >
                    <div className="flex-between mb-2">
                      <h4 className="font-bold text-dark">{st.name}</h4>
                      <span className="font-extrabold text-primary">₹{st.basePrice.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted mb-3">{st.description}</p>
                    <div className="text-xs font-semibold text-muted flex items-center gap-1">
                      <Clock size={12} /> Est. {st.estimatedDuration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Date & Slot */}
          <div className="content-card mb-6">
            <div className="card-header">
              <h3 className="card-title">3. Schedule Date & Time</h3>
            </div>
            <div className="card-body">
              <div className="form-row mb-4">
                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    className="form-control"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time Slot *</label>
                  <select
                    className="form-control"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Problem Description */}
          <div className="content-card mb-6">
            <div className="card-header">
              <h3 className="card-title">4. Describe Vehicle Issues / Symptoms *</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <textarea
                  rows={4}
                  required
                  className="form-control"
                  placeholder="e.g. Brake noise during low speed, AC cooling not sufficient, strange knocking sound from engine..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                />
                <span className="text-xs text-muted mt-1">
                  Our service advisors will cross-reference this during intake and the multi-point inspection.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/customer/dashboard" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
            >
              {submitting ? 'Submitting Booking...' : 'Confirm Service Booking'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      )}

      {/* Quick Add Vehicle Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSaved={handleVehicleCreated}
      />
    </div>
  );
};

export default BookService;
