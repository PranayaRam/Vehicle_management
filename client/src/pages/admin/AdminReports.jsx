import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Receipt,
  Car,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import api from '../../services/api';

const AdminReports = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/admin');
        if (res.data.success) {
          setMetrics(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve analytics reports');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const overview = metrics?.overview || {};
  const statusBreakdown = metrics?.statusBreakdown || {};
  const lowStockParts = metrics?.lowStockParts || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-reports-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Operational Reports & Business Analytics</h1>
          <p className="page-subtitle">Executive performance audit, revenue realization, and service cycle throughput</p>
        </div>
        <button onClick={handlePrint} className="btn btn-outline flex items-center gap-2">
          <Printer size={16} /> Print Report
        </button>
      </div>

      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Performance Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="stat-icon-wrap bg-emerald-500/10 text-emerald-400">
                <TrendingUp size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-value font-mono">₹{(overview.totalRevenue || 0).toLocaleString()}</span>
                <span className="stat-name">Collected Revenue</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap bg-amber-500/10 text-[#ffb703]">
                <Clock size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-value font-mono">₹{(overview.pendingReceivables || 0).toLocaleString()}</span>
                <span className="stat-name">Outstanding Balance</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap bg-blue-500/10 text-blue-400">
                <CheckCircle2 size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{overview.completedServices || 0}</span>
                <span className="stat-name">Completed Services</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap bg-purple-500/10 text-purple-400">
                <Car size={22} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{overview.totalVehicles || 0}</span>
                <span className="stat-name">Serviced Fleet Size</span>
              </div>
            </div>
          </div>

          {/* Workflow Stage Throughput */}
          <div className="content-card p-6">
            <div className="card-header border-b border-border pb-3 mb-4 flex-between">
              <h3 className="card-title flex items-center gap-2 text-white">
                <BarChart3 size={18} className="text-primary" /> Active Workshop Stage Volume Distribution
              </h3>
              <span className="text-xs text-muted">Real-time database audit</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Diagnostic', key: 'INSPECTION', color: 'border-amber-500/40 bg-amber-500/5' },
                { label: 'Estimate Pending', key: 'ESTIMATE_PENDING', color: 'border-orange-500/40 bg-orange-500/5' },
                { label: 'Authorized', key: 'APPROVED', color: 'border-emerald-500/40 bg-emerald-500/5' },
                { label: 'In Service Bay', key: 'IN_SERVICE', color: 'border-blue-500/40 bg-blue-500/5' },
                { label: 'Quality Check', key: 'QUALITY_CHECK', color: 'border-indigo-500/40 bg-indigo-500/5' },
                { label: 'Ready Delivery', key: 'READY_FOR_DELIVERY', color: 'border-teal-500/40 bg-teal-500/5' },
                { label: 'Delivered', key: 'COMPLETED', color: 'border-slate-500/40 bg-slate-500/5' }
              ].map((stage) => {
                const count = statusBreakdown[stage.key] || 0;
                return (
                  <div key={stage.key} className={`p-3 rounded-xl border text-center ${stage.color}`}>
                    <span className="text-2xl font-extrabold font-mono text-white block mb-1">
                      {count}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-300 block line-clamp-1">
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Parts Audit Table */}
          <div className="content-card">
            <div className="card-header flex-between">
              <h3 className="card-title flex items-center gap-2 text-white">
                <AlertTriangle size={18} className="text-amber-400" /> Critical Inventory Alerts
              </h3>
              <span className="text-xs text-muted">Stock below or at minimum safety buffer</span>
            </div>
            <div className="card-body p-0">
              {lowStockParts.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted">
                  All warehouse inventory items are currently above their safety thresholds.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table text-xs">
                    <thead>
                      <tr>
                        <th>Part Description</th>
                        <th>Part Number</th>
                        <th>Current Quantity</th>
                        <th>Safety Threshold</th>
                        <th>Unit Price</th>
                        <th>Reorder Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockParts.map((p) => (
                        <tr key={p._id}>
                          <td className="font-semibold text-white">{p.name}</td>
                          <td className="font-mono text-muted">{p.partNumber}</td>
                          <td className="font-mono font-bold text-amber-400">{p.stockQuantity} in stock</td>
                          <td className="text-muted">Min: {p.minimumStock}</td>
                          <td className="font-mono">₹{p.unitPrice?.toLocaleString()}</td>
                          <td>
                            <span className="badge badge-warning text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-[#ffb703] border border-amber-500/20">
                              REORDER REQUIRED
                            </span>
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
      )}
    </div>
  );
};

export default AdminReports;
