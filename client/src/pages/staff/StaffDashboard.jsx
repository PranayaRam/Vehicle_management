import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  FileCheck2,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/staff');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load staff metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffStats();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Service Advisor & Staff Console</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Manage daily vehicle check-ins, job cards, estimates, and delivery</p>
        </div>
        <div className="page-actions flex gap-2">
          <Link to="/staff/bookings" className="btn btn-outline">
            <ClipboardCheck size={16} /> Process Check-In
          </Link>
          <Link to="/staff/jobs" className="btn btn-primary">
            <Wrench size={16} /> View Active Jobs
          </Link>
        </div>
      </div>

      {/* Staff Operational Metrics */}
      <div className="stats-grid mb-6">
        <Link to="/staff/bookings" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon-wrap bg-blue-subtle text-primary">
            <Calendar size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : stats?.todaysBookings ?? 0}</span>
            <span className="stat-name">Today's Bookings</span>
          </div>
        </Link>

        <Link to="/staff/bookings" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon-wrap bg-amber-subtle text-amber">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : stats?.pendingCheckIns ?? 0}</span>
            <span className="stat-name">Pending Check-Ins</span>
          </div>
        </Link>

        <Link to="/staff/jobs" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon-wrap bg-purple-subtle text-purple">
            <Wrench size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : stats?.activeJobs ?? 0}</span>
            <span className="stat-name">Active Service Jobs</span>
          </div>
        </Link>

        <Link to="/staff/delivery" className="stat-card" style={{ textDecoration: 'none' }}>
          <div className="stat-icon-wrap bg-emerald-subtle text-success">
            <Truck size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : stats?.readyForDelivery ?? 0}</span>
            <span className="stat-name">Ready for Delivery</span>
          </div>
        </Link>
      </div>

      {/* Workflow Gate Banner */}
      <div className="info-box mb-6">
        <ShieldAlert size={22} className="text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <strong>Crucial Garage Business Rule:</strong> Mechanics and technicians cannot begin physical repairs or consume spare parts until the customer provides digital approval for the generated estimate.
        </div>
      </div>

      {/* Recent Jobs Queue Table */}
      <div className="content-card mb-6">
        <div className="card-header flex-between">
          <h3 className="card-title">Active Service Job Cards</h3>
          <Link to="/staff/jobs" className="text-sm font-semibold text-primary hover:underline">
            View All Jobs
          </Link>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : !stats?.recentJobs || stats.recentJobs.length === 0 ? (
            <p className="p-6 text-center text-muted text-sm">
              No service jobs currently active. Check in an arriving vehicle to start.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>Assigned Staff</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentJobs.map((j) => (
                    <tr key={j._id}>
                      <td className="font-mono font-bold text-primary">{j.jobNumber}</td>
                      <td>
                        <div className="font-semibold text-dark">
                          {j.vehicleId?.brand} {j.vehicleId?.model}
                        </div>
                        <span className="plate-badge text-xs">{j.vehicleId?.registrationNumber}</span>
                      </td>
                      <td>
                        <div>{j.customerId?.name}</div>
                        <span className="text-xs text-muted">{j.customerId?.phone}</span>
                      </td>
                      <td>{j.assignedStaffId?.name}</td>
                      <td>
                        <StatusBadge status={j.status} />
                      </td>
                      <td className="text-xs text-muted">
                        {new Date(j.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/staff/jobs/${j._id}`} className="btn btn-outline btn-sm">
                          Manage <ArrowRight size={13} />
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

export default StaffDashboard;
