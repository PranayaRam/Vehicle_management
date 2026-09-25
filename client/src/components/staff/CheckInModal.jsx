import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { AlertCircle, CheckCircle2, Gauge, Fuel } from 'lucide-react';

const CheckInModal = ({ isOpen, onClose, booking, onCheckInComplete }) => {
  const [formData, setFormData] = useState({
    currentMileage: booking?.vehicleId?.currentMileage || '',
    fuelLevel: '40%',
    exteriorCondition: 'Good condition, minor road dust',
    existingDamage: 'No visible exterior dents or paint scratches',
    customerComplaint: booking?.problemDescription || '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fuelOptions = ['10%', '25%', '40%', '50%', '75%', '100%'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.currentMileage === '') {
      return setError('Please record current odometer mileage.');
    }

    if (Number(formData.currentMileage) < (booking?.vehicleId?.currentMileage || 0)) {
      return setError(`Intake mileage cannot be lower than existing recorded mileage (${booking?.vehicleId?.currentMileage} km).`);
    }

    setSubmitting(true);
    try {
      const res = await api.post('/check-in', {
        bookingId: booking._id,
        currentMileage: Number(formData.currentMileage),
        fuelLevel: formData.fuelLevel,
        exteriorCondition: formData.exteriorCondition,
        existingDamage: formData.existingDamage,
        customerComplaint: formData.customerComplaint,
        notes: formData.notes
      });

      if (res.data.success) {
        onCheckInComplete(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process vehicle check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehicle Intake Check-In: ${booking?.vehicleId?.registrationNumber}`}
      maxWidth="650px"
    >
      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-slate-50 p-3 rounded mb-4 border border-border flex-between text-sm">
        <div>
          <strong className="text-dark">
            {booking?.vehicleId?.brand} {booking?.vehicleId?.model}
          </strong>{' '}
          ({booking?.vehicleId?.registrationNumber})
        </div>
        <div className="text-muted">Customer: {booking?.customerId?.name}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group mb-3">
            <label className="form-label">Intake Odometer Reading (km) *</label>
            <div className="input-with-icon">
              <Gauge size={18} className="input-icon" />
              <input
                type="number"
                name="currentMileage"
                required
                min={booking?.vehicleId?.currentMileage || 0}
                className="form-control pl-10"
                placeholder="e.g. 38500"
                value={formData.currentMileage}
                onChange={handleChange}
              />
            </div>
            <span className="text-xs text-muted">
              Last recorded: {booking?.vehicleId?.currentMileage?.toLocaleString()} km
            </span>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Fuel Level at Intake *</label>
            <div className="input-with-icon">
              <Fuel size={18} className="input-icon" />
              <select
                name="fuelLevel"
                required
                className="form-control pl-10"
                value={formData.fuelLevel}
                onChange={handleChange}
              >
                {fuelOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} Tank
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Exterior Body Condition</label>
          <input
            type="text"
            name="exteriorCondition"
            className="form-control"
            placeholder="e.g. Clean, dusty, bumper alignment satisfactory"
            value={formData.exteriorCondition}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Pre-existing Scratches / Dents / Damages *</label>
          <textarea
            rows={2}
            name="existingDamage"
            required
            className="form-control"
            placeholder="e.g. Minor paint scratch on rear bumper right side; windshield intact"
            value={formData.existingDamage}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Verified Customer Complaint / Request *</label>
          <textarea
            rows={2}
            name="customerComplaint"
            required
            className="form-control"
            placeholder="Customer reported issues..."
            value={formData.customerComplaint}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Service Advisor Internal Intake Notes</label>
          <input
            type="text"
            name="notes"
            className="form-control"
            placeholder="e.g. Assigned to Bay 2 for initial 40-point inspection"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-sm"
          >
            {submitting ? 'Checking In...' : 'Confirm Check-In & Create Job Card'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CheckInModal;
