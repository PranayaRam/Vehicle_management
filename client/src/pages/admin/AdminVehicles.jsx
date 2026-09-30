import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Search,
  CheckCircle2,
  AlertCircle,
  History,
  Calendar,
  Fuel,
  Gauge,
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelFilter, setFuelFilter] = useState('ALL');

  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vehicles');
        if (res.data.success) {
          setVehicles(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve vehicle fleet registry');
      } finally {
        setLoading(false);
      }
    };

    fetchAllVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesFuel = fuelFilter === 'ALL' || v.fuelType === fuelFilter;
    const query = searchTerm.toLowerCase();
    const cust = v.customerId;
    const matchesSearch =
      v.registrationNumber?.toLowerCase().includes(query) ||
      v.brand?.toLowerCase().includes(query) ||
      v.model?.toLowerCase().includes(query) ||
      cust?.name?.toLowerCase().includes(query) ||
      cust?.phone?.toLowerCase().includes(query);

    return matchesFuel && matchesSearch;
  });

  return (
    <div className="admin-vehicles-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Garage Vehicle Registry</h1>
          <p className="page-subtitle">Master database of all registered customer vehicles, specifications, and service records</p>
        </div>
      </div>

      {error && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-purple-500/10 text-purple-400">
            <Car size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : vehicles.length}</span>
            <span className="stat-name">Total Fleet Registered</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-500/10 text-blue-400">
            <Fuel size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {loading ? '...' : vehicles.filter(v => v.fuelType === 'Diesel' || v.fuelType === 'Petrol').length}
            </span>
            <span className="stat-name">Combustion (ICE) Fleet</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-500/10 text-emerald-400">
            <Gauge size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">
              {loading ? '...' : vehicles.filter(v => v.fuelType === 'Electric' || v.fuelType === 'Hybrid').length}
            </span>
            <span className="stat-name">EV / Hybrid Fleet</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-between flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {['ALL', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((f) => (
            <button
              key={f}
              onClick={() => setFuelFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                fuelFilter === f
                  ? 'bg-primary text-black font-bold'
                  : 'bg-[#111622] text-gray-400 border border-border hover:border-gray-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            placeholder="Search plate, brand, owner phone..."
            className="form-input pl-9 py-1.5 text-xs w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="content-card mb-6">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="p-8 text-center">
              <Car size={36} className="text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">No vehicles match your search filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Registration Plate</th>
                    <th>Make & Model</th>
                    <th>Year / Fuel</th>
                    <th>Odometer</th>
                    <th>Registered Customer</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((v) => {
                    const cust = v.customerId;
                    return (
                      <tr key={v._id}>
                        <td>
                          <span className="plate-badge font-mono font-bold text-xs">
                            {v.registrationNumber}
                          </span>
                        </td>
                        <td>
                          <div className="font-semibold text-dark">
                            {v.brand} {v.model}
                          </div>
                          <span className="text-xs text-muted">{v.variant || 'Standard'}</span>
                        </td>
                        <td className="text-xs">
                          <div>{v.manufacturingYear}</div>
                          <span className="badge text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-border">
                            {v.fuelType}
                          </span>
                        </td>
                        <td className="font-mono text-xs text-slate-700">
                          {v.currentMileage?.toLocaleString()} km
                        </td>
                        <td>
                          <div className="font-semibold text-dark">{cust?.name || 'Customer'}</div>
                          <span className="text-xs text-muted font-mono">{cust?.phone}</span>
                        </td>
                        <td className="text-xs text-muted">
                          {new Date(v.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVehicles;
