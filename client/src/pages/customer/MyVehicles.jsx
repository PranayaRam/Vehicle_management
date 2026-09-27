import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Car, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import VehicleCard from '../../components/vehicles/VehicleCard';
import VehicleModal from '../../components/vehicles/VehicleModal';
import EmptyState from '../../components/common/EmptyState';

const MyVehicles = () => {
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vehicles/my');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    if (location.pathname.endsWith('/add')) {
      setEditingVehicle(null);
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleVehicleSaved = (savedVehicle) => {
    setSuccessMsg(editingVehicle ? 'Vehicle details updated successfully.' : 'Vehicle added to your profile.');
    setTimeout(() => setSuccessMsg(''), 4000);
    fetchVehicles();
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your profile?')) {
      return;
    }
    try {
      const res = await api.delete(`/vehicles/${vehicleId}`);
      if (res.data.success) {
        setSuccessMsg('Vehicle removed successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchVehicles();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove vehicle');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="vehicles-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">My Registered Vehicles</h1>
          <p className="page-subtitle">Manage your personal vehicles, view mileage logs, and initiate service bookings</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add Vehicle
        </button>
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
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No Vehicles Registered Yet"
          description="Register your car or SUV with its registration number and current odometer reading to begin booking services."
          actionText="Add Your First Vehicle"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((v) => (
            <VehicleCard
              key={v._id}
              vehicle={v}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteVehicle}
            />
          ))}
        </div>
      )}

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleToEdit={editingVehicle}
        onSaved={handleVehicleSaved}
      />
    </div>
  );
};

export default MyVehicles;
