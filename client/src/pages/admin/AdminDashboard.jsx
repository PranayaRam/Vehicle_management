import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Car,
  Wrench,
  Package,
  Layers,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/admin');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMetrics();
  }, []);

  const overview = data?.overview;
  const lowStockParts = data?.lowStockParts || [];
  const statusBreakdown = data?.statusBreakdown || {};

  return (
    <div className="admin-dashboard-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Executive Control Center</h1>
          <p className="page-subtitle">Overall workshop analytics, inventory control, revenue oversight, and governance</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/parts" className="btn btn-outline btn-sm">
            <Package size={15} /> Parts Inventory
          </Link>
          <Link to="/admin/bookings" className="btn btn-primary btn-sm">
            Monitor Bookings
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-subtle text-primary">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : overview?.totalCustomers ?? 0}</span>
            <span className="stat-name">Registered Customers</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-purple-subtle text-purple">
            <Car size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : overview?.totalVehicles ?? 0}</span>
            <span className="stat-name">Active Fleet Vehicles</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-subtle text-success">
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">₹{loading ? '...' : (overview?.totalRevenue || 0).toLocaleString()}</span>
            <span className="stat-name">Realized Revenue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-amber-subtle text-amber">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">₹{loading ? '...' : (overview?.pendingReceivables || 0).toLocaleString()}</span>
            <span className="stat-name">Pending Invoices</span>
          </div>
        </div>
      </div>

      {/* Low-Stock Parts Warning Panel */}
      {lowStockParts.length > 0 && (
        <div className="content-card mb-6 border-l-4 border-l-danger">
          <div className="card-header flex-between">
            <h3 className="card-title text-danger flex items-center gap-2">
              <AlertTriangle size={18} /> Low Inventory Threshold Alerts ({lowStockParts.length} Parts)
            </h3>
            <Link to="/admin/parts" className="text-xs font-semibold text-primary hover:underline">
              Manage Inventory
            </Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="data-table text-xs">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Part Number</th>
                    <th>Available Stock</th>
                    <th>Threshold Limit</th>
                    <th>Unit Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockParts.map((p) => (
                    <tr key={p._id}>
                      <td className="font-semibold text-dark">{p.name}</td>
                      <td className="font-mono text-muted">{p.partNumber}</td>
                      <td className="font-bold text-danger">{p.stockQuantity} units left</td>
                      <td>Min {p.minimumStock}</td>
                      <td>₹{p.unitPrice?.toLocaleString()}</td>
                      <td>
                        <Link to="/admin/parts" className="btn btn-outline btn-sm py-1 px-2 text-xs">
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Operations Overview & Service Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Live Pipeline Status Distribution</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {[
                { label: 'Under Diagnostic Inspection', key: 'INSPECTION', color: 'bg-amber-500' },
                { label: 'Estimate Awaiting Customer Approval', key: 'ESTIMATE_PENDING', color: 'bg-orange-500' },
                { label: 'Customer Approved (Work Authorized)', key: 'APPROVED', color: 'bg-emerald-500' },
                { label: 'Currently in Workshop Service', key: 'IN_SERVICE', color: 'bg-blue-600' },
                { label: 'In Quality Assurance Road Test', key: 'QUALITY_CHECK', color: 'bg-indigo-600' },
                { label: 'Ready for Customer Delivery', key: 'READY_FOR_DELIVERY', color: 'bg-teal-600' },
                { label: 'Completed & Delivered', key: 'COMPLETED', color: 'bg-slate-500' }
              ].map((st) => (
                <div key={st.key} className="flex-between text-xs py-1.5 border-b border-border">
                  <span className="font-medium text-dark">{st.label}</span>
                  <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-dark">
                    {statusBreakdown[st.key] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Quick Administration Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/service-types" className="action-tile block text-decoration-none">
                <Layers size={22} className="text-primary mb-2" />
                <h4 className="text-dark">Service Types</h4>
                <p className="text-xs text-muted">Manage standard service catalogs, durations, and base costs</p>
              </Link>

              <Link to="/admin/parts" className="action-tile block text-decoration-none">
                <Package size={22} className="text-primary mb-2" />
                <h4 className="text-dark">Parts Warehouse</h4>
                <p className="text-xs text-muted">Stock intake, minimum warnings, and supplier details</p>
              </Link>

              <Link to="/admin/labour" className="action-tile block text-decoration-none">
                <Wrench size={22} className="text-primary mb-2" />
                <h4 className="text-dark">Labour Catalog</h4>
                <p className="text-xs text-muted">Hourly rates, standard operations, and technician tasks</p>
              </Link>

              <Link to="/admin/bookings" className="action-tile block text-decoration-none">
                <Clock size={22} className="text-primary mb-2" />
                <h4 className="text-dark">All Bookings</h4>
                <p className="text-xs text-muted">Monitor appointments, status changes, and service jobs</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
