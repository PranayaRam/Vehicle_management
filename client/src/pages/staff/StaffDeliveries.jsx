import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Car,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Search,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const StaffDeliveries = () => {
  const [activeTab, setActiveTab] = useState('ready');
  const [readyJobs, setReadyJobs] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [readyRes, delRes] = await Promise.all([
        api.get('/service-jobs?status=READY_FOR_DELIVERY'),
        api.get('/delivery')
      ]);

      if (readyRes.data.success) {
        setReadyJobs(readyRes.data.data);
      }
      if (delRes.data.success) {
        setCompletedDeliveries(delRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve delivery records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="staff-deliveries-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Vehicle Delivery & Handover</h1>
          <p className="page-subtitle">Manage final vehicle releases, payment clearances, customer signatures, and exit records</p>
        </div>
      </div>

      {error && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Workflow Rule 9 Gate Banner */}
      <div className="info-box mb-6">
        <ShieldCheck size={22} className="text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <strong>Mandatory Handover Gate (Rule 9):</strong> Workshop gate pass and vehicle key release are strictly prohibited until the final invoice is marked <strong>PAID in full</strong>.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('ready')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'ready'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-dark'
          }`}
        >
          <Clock size={16} /> Ready for Customer Pickup ({readyJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-dark'
          }`}
        >
          <CheckCircle2 size={16} /> Completed Handover Ledger ({completedDeliveries.length})
        </button>
      </div>

      {activeTab === 'ready' ? (
        /* Ready for Pickup Queue */
        <div className="content-card mb-6">
          <div className="card-body p-0">
            {loading ? (
              <div className="flex-center py-8">
                <div className="spinner"></div>
              </div>
            ) : readyJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Truck size={36} className="text-muted mx-auto mb-2" />
                <h3 className="text-sm font-bold text-dark mb-1">No Vehicles Currently Queued for Pickup</h3>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Vehicles that pass quality checks and road tests will appear here awaiting customer handover.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Number</th>
                      <th>Vehicle</th>
                      <th>Customer</th>
                      <th>Service Advisor</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readyJobs.map((j) => (
                      <tr key={j._id}>
                        <td className="font-mono font-bold text-primary">{j.jobNumber}</td>
                        <td>
                          <div className="font-semibold text-dark">
                            {j.vehicleId?.brand} {j.vehicleId?.model}
                          </div>
                          <span className="text-xs text-muted font-mono">{j.vehicleId?.registrationNumber}</span>
                        </td>
                        <td>
                          <div>{j.customerId?.name}</div>
                          <span className="text-xs text-muted">{j.customerId?.phone}</span>
                        </td>
                        <td>{j.assignedStaffId?.name || 'Assigned Staff'}</td>
                        <td>
                          <StatusBadge status={j.status} />
                        </td>
                        <td>
                          <Link
                            to={`/staff/jobs/${j._id}`}
                            className="btn btn-primary btn-sm py-1 px-3 text-xs flex items-center gap-1.5"
                          >
                            <UserCheck size={13} /> Process Delivery <ArrowRight size={12} />
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
      ) : (
        /* Completed Delivery Log */
        <div className="content-card mb-6">
          <div className="card-body p-0">
            {loading ? (
              <div className="flex-center py-8">
                <div className="spinner"></div>
              </div>
            ) : completedDeliveries.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={36} className="text-muted mx-auto mb-2" />
                <p className="text-muted text-sm">No completed delivery handovers logged yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Vehicle</th>
                      <th>Customer</th>
                      <th>Recipient / Signee</th>
                      <th>Handed Over By</th>
                      <th>Date & Time</th>
                      <th>Handover Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedDeliveries.map((del) => (
                      <tr key={del._id}>
                        <td className="font-mono font-bold text-primary">
                          {del.serviceJobId?.jobNumber || 'SJ-General'}
                        </td>
                        <td>
                          <div className="font-semibold text-dark">
                            {del.vehicleId?.brand} {del.vehicleId?.model}
                          </div>
                          <span className="text-xs text-muted font-mono">{del.vehicleId?.registrationNumber}</span>
                        </td>
                        <td>{del.customerId?.name}</td>
                        <td>
                          <strong className="text-emerald-600">{del.recipientName}</strong>
                        </td>
                        <td>{del.deliveredBy?.name || 'Staff'}</td>
                        <td className="text-xs text-muted">
                          {new Date(del.deliveryDate).toLocaleDateString()}
                        </td>
                        <td className="text-xs text-slate-600 max-w-xs truncate">
                          {del.deliveryNotes || 'Vehicle released after payment sign-off'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDeliveries;
