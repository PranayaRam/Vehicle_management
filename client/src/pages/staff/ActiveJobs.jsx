import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let url = '/service-jobs';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve service jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="active-jobs-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Active Service Job Cards</h1>
          <p className="page-subtitle">Track multi-point inspections, estimate preparation, execution, quality check, and handover</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="content-card mb-6 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-muted">Filter Status:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['', 'INSPECTION', 'ESTIMATE_PENDING', 'APPROVED', 'IN_SERVICE', 'QUALITY_CHECK', 'READY_FOR_DELIVERY', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                >
                  {st.replace(/_/g, ' ') || 'All Jobs'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              className="form-control text-sm py-1.5"
              placeholder="Search Job ID e.g. SJ-1001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline btn-sm">
              <Search size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="content-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-10">
              <div className="spinner"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Wrench}
                title="No Service Jobs Found"
                description="There are currently no active vehicle jobs matching your criteria."
              />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>Reported Issue</th>
                    <th>Assigned Staff</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j._id}>
                      <td className="font-mono font-bold text-primary">{j.jobNumber}</td>
                      <td>
                        <div className="font-semibold text-dark">
                          {j.vehicleId?.brand} {j.vehicleId?.model}
                        </div>
                        <span className="plate-badge text-xs">{j.vehicleId?.registrationNumber}</span>
                      </td>
                      <td>
                        <div className="font-semibold text-dark">{j.customerId?.name}</div>
                        <span className="text-xs text-muted">{j.customerId?.phone}</span>
                      </td>
                      <td>
                        <span className="text-xs text-dark block max-w-xs truncate" title={j.reportedProblem}>
                          {j.reportedProblem}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-medium text-dark">{j.assignedStaffId?.name}</span>
                      </td>
                      <td>
                        <StatusBadge status={j.status} />
                      </td>
                      <td>
                        <Link to={`/staff/jobs/${j._id}`} className="btn btn-primary btn-sm flex items-center gap-1">
                          Manage Job <ArrowRight size={13} />
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

export default ActiveJobs;
