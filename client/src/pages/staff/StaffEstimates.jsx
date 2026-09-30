import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileX2,
  Search,
  DollarSign,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const StaffEstimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/estimates');
      if (res.data.success) {
        setEstimates(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve workshop estimates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const filteredEstimates = estimates.filter((est) => {
    const matchesStatus = statusFilter === 'ALL' || est.status === statusFilter;
    const query = searchTerm.toLowerCase();
    const veh = est.serviceJobId?.vehicleId;
    const cust = est.customerId;
    const matchesSearch =
      est.estimateNumber?.toLowerCase().includes(query) ||
      est.serviceJobId?.jobNumber?.toLowerCase().includes(query) ||
      veh?.registrationNumber?.toLowerCase().includes(query) ||
      veh?.brand?.toLowerCase().includes(query) ||
      cust?.name?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = estimates.filter(e => e.status === 'PENDING_APPROVAL').length;
  const approvedCount = estimates.filter(e => e.status === 'APPROVED').length;

  return (
    <div className="staff-estimates-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Service Estimates & Approvals</h1>
          <p className="page-subtitle">Track prepared parts and labour quotations, customer sign-offs, and authorizations</p>
        </div>
        <Link to="/staff/jobs" className="btn btn-primary flex items-center gap-2">
          <FileCheck2 size={16} /> Prepare New Estimate
        </Link>
      </div>

      {/* Workflow Gate Banner */}
      <div className="info-box mb-6">
        <ShieldAlert size={22} className="text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <strong>Customer Authorization Rule:</strong> Physical workshop servicing and inventory part consumption are strictly blocked until an estimate is digitally approved by the vehicle owner.
        </div>
      </div>

      {error && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex-between flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: 'ALL', label: `All (${estimates.length})` },
            { id: 'PENDING_APPROVAL', label: `Awaiting Approval (${pendingCount})` },
            { id: 'APPROVED', label: `Approved (${approvedCount})` },
            { id: 'REJECTED', label: 'Declined' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-primary text-black font-bold'
                  : 'bg-[#111622] text-gray-400 border border-border hover:border-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            placeholder="Search estimates, vehicles..."
            className="form-input pl-9 py-1.5 text-xs w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Estimates Table */}
      <div className="content-card mb-6">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : filteredEstimates.length === 0 ? (
            <div className="p-8 text-center">
              <FileCheck2 size={36} className="text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">No estimates found matching the current filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Estimate #</th>
                    <th>Job ID</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>Parts / Labour</th>
                    <th>GST (18%)</th>
                    <th>Grand Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstimates.map((est) => {
                    const job = est.serviceJobId;
                    const veh = job?.vehicleId;
                    const cust = est.customerId;
                    return (
                      <tr key={est._id}>
                        <td className="font-mono font-bold text-primary">{est.estimateNumber}</td>
                        <td className="font-mono text-xs">{job?.jobNumber || 'SJ-General'}</td>
                        <td>
                          <div className="font-semibold text-dark">
                            {veh?.brand} {veh?.model}
                          </div>
                          <span className="text-xs text-muted font-mono">{veh?.registrationNumber}</span>
                        </td>
                        <td>
                          <div>{cust?.name}</div>
                          <span className="text-xs text-muted">{cust?.phone}</span>
                        </td>
                        <td className="text-xs">
                          <div>Subtotal: ₹{est.subtotal?.toLocaleString()}</div>
                          <span className="text-muted">
                            {est.parts?.length || 0} parts, {est.labour?.length || 0} tasks
                          </span>
                        </td>
                        <td className="font-mono text-xs text-slate-600">₹{est.tax?.toLocaleString()}</td>
                        <td className="font-mono font-bold text-sm text-dark">₹{est.total?.toLocaleString()}</td>
                        <td>
                          <StatusBadge status={est.status} />
                        </td>
                        <td>
                          {job?._id && (
                            <Link
                              to={`/staff/jobs/${job._id}`}
                              className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1"
                            >
                              Manage Job <ArrowRight size={12} />
                            </Link>
                          )}
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

export default StaffEstimates;
