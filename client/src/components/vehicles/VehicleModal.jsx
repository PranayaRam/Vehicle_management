import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const VehicleModal = ({ isOpen, onClose, vehicleToEdit, onSaved }) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    variant: '',
    manufacturingYear: new Date().getFullYear(),
    fuelType: 'Petrol',
    currentMileage: '',
    vin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        registrationNumber: vehicleToEdit.registrationNumber || '',
        brand: vehicleToEdit.brand || '',
        model: vehicleToEdit.model || '',
        variant: vehicleToEdit.variant || '',
        manufacturingYear: vehicleToEdit.manufacturingYear || new Date().getFullYear(),
        fuelType: vehicleToEdit.fuelType || 'Petrol',
        currentMileage: vehicleToEdit.currentMileage ?? '',
        vin: vehicleToEdit.vin || ''
      });
    } else {
      setFormData({
        registrationNumber: '',
        brand: '',
        model: '',
        variant: '',
        manufacturingYear: new Date().getFullYear(),
        fuelType: 'Petrol',
        currentMileage: '',
        vin: ''
      });
    }
    setError('');
  }, [vehicleToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.registrationNumber || !formData.brand || !formData.model || formData.currentMileage === '') {
      return setError('Please fill in all required fields.');
    }

    if (Number(formData.currentMileage) < 0) {
      return setError('Mileage cannot be negative.');
    }

    setLoading(true);
    try {
      if (vehicleToEdit) {
        const res = await api.put(`/vehicles/${vehicleToEdit._id}`, formData);
        if (res.data.success) {
          onSaved(res.data.data);
          onClose();
        }
      } else {
        const res = await api.post('/vehicles', formData);
        if (res.data.success) {
          onSaved(res.data.data);
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicleToEdit ? 'Edit Vehicle Details' : 'Register New Vehicle'}
      maxWidth="600px"
    >
      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group mb-3">
            <label className="form-label">Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              required
              disabled={!!vehicleToEdit} // Cannot alter unique registration once registered
              className="form-control font-mono uppercase"
              placeholder="e.g. MH12AB1234"
              value={formData.registrationNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Fuel Type *</label>
            <select
              name="fuelType"
              required
              className="form-control"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group mb-3">
            <label className="form-label">Brand / Make *</label>
            <input
              type="text"
              name="brand"
              required
              className="form-control"
              placeholder="e.g. Hyundai, Toyota, Honda"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Model *</label>
            <input
              type="text"
              name="model"
              required
              className="form-control"
              placeholder="e.g. Creta, Fortuner, City"
              value={formData.model}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group mb-3">
            <label className="form-label">Variant</label>
            <input
              type="text"
              name="variant"
              className="form-control"
              placeholder="e.g. 1.5 SX (O) Turbo"
              value={formData.variant}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Manufacturing Year *</label>
            <input
              type="number"
              name="manufacturingYear"
              required
              min="1980"
              max={new Date().getFullYear() + 1}
              className="form-control"
              value={formData.manufacturingYear}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group mb-4">
            <label className="form-label">Current Odometer (km) *</label>
            <input
              type="number"
              name="currentMileage"
              required
              min="0"
              className="form-control"
              placeholder="e.g. 38500"
              value={formData.currentMileage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">VIN / Chassis Number (Optional)</label>
            <input
              type="text"
              name="vin"
              className="form-control uppercase"
              placeholder="17-character VIN"
              value={formData.vin}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-sm"
          >
            {loading ? 'Saving...' : vehicleToEdit ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleModal;
