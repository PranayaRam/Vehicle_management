import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Gauge, Fuel, Calendar, Edit2, Trash2, CalendarPlus } from 'lucide-react';

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  return (
    <div className="vehicle-card">
      <div className="vehicle-card-top">
        <div className="license-plate">
          <span className="plate-ind">IND</span>
          <span className="plate-num">{vehicle.registrationNumber}</span>
        </div>
        <span className="fuel-pill">{vehicle.fuelType}</span>
      </div>

      <div className="vehicle-card-info">
        <h3 className="vehicle-title">
          {vehicle.brand} {vehicle.model}
        </h3>
        {vehicle.variant && <p className="vehicle-variant text-muted text-sm">{vehicle.variant}</p>}
      </div>

      <div className="vehicle-specs-grid">
        <div className="spec-item">
          <Calendar size={15} className="text-muted" />
          <span>{vehicle.manufacturingYear}</span>
        </div>
        <div className="spec-item">
          <Gauge size={15} className="text-muted" />
          <span>{vehicle.currentMileage?.toLocaleString()} km</span>
        </div>
        {vehicle.vin && (
          <div className="spec-item col-span-2">
            <span className="text-xs text-muted">VIN: {vehicle.vin}</span>
          </div>
        )}
      </div>

      <div className="vehicle-card-actions">
        <Link
          to={`/customer/book?vehicleId=${vehicle._id}`}
          className="btn btn-primary btn-sm flex-1"
        >
          <CalendarPlus size={15} /> Book Service
        </Link>
        <button
          onClick={() => onEdit(vehicle)}
          className="btn btn-outline btn-sm action-icon-btn"
          title="Edit Details"
        >
          <Edit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(vehicle._id)}
          className="btn btn-outline btn-sm action-icon-btn text-danger hover:bg-danger-subtle"
          title="Remove Vehicle"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
