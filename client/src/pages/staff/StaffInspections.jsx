import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Car,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  ClipboardList,
  Search,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import InspectionReportModal from '../../components/common/InspectionReportModal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const StaffInspections = () => {
  const [inspections, setInspections] = useState([]);
  const [pendingInspectionJobs, setPendingInspectionJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Inspection Modal
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inspRes, jobsRes] = await Promise.all([
          api.get('/inspections'),
          api.get('/service-jobs?status=INSPECTION')
        ]);

        if (inspRes.data.success) {
          setInspections(inspRes.data.data);
        }
        if (jobsRes.data.success) {
          setPendingInspectionJobs(jobsRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve vehicle inspection records');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredInspections = inspections.filter((insp) => {
    const veh = insp.serviceJobId?.vehicleId;
    const cust = insp.serviceJobId?.customerId;
    const query = searchTerm.toLowerCase();
    return (
      insp.serviceJobId?.jobNumber?.toLowerCase().includes(query) ||
      veh?.registrationNumber?.toLowerCase().includes(query) ||
      veh?.brand?.toLowerCase().includes(query) ||
      veh?.model?.toLowerCase().includes(query) ||
      cust?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="staff-inspections-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Diagnostic & Multi-Point Inspections</h1>
          <p className="page-subtitle">Standardized 40-point safety and mechanical inspections across workshop intake bays</p>
        </div>
        <Link to="/staff/jobs" className="btn btn-primary flex items-center gap-2">
          <Wrench size={16} /> All Service Jobs
        </Link>
      </div>

      {error && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Pending Intake Queue Alert */}
      {pendingInspectionJobs.length > 0 && (
        <div className="content-card mb-6 border-l-4 border-l-amber-500 p-5 bg-amber-500/5">
          <div className="flex-between flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-bold text-dark flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-500" />
                <span>{pendingInspectionJobs.length} Vehicle(s) Awaiting Diagnostic Inspection</span>
              </h3>
              <p className="text-xs text-muted mt-1">
                These vehicles have been checked in by reception and are queued in workshop bays for diagnostic checks.
              </p>
            </div>
            <div className="flex gap-2">
              {pendingInspectionJobs.slice(0, 2).map((j) => (
                <Link
                  key={j._id}
                  to={`/staff/jobs/${j._id}`}
                  className="btn btn-outline btn-sm text-xs py-1 px-3 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                >
                  Inspect {j.vehicleId?.registrationNumber} <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inspections Table Card */}
      <div className="content-card mb-6">
        <div className="card-header flex-between flex-wrap gap-3">
          <h3 className="card-title">Completed Inspection Reports ({inspections.length})</h3>
          <div className="relative w-72">
            <Search size={15} className="absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              placeholder="Search by Job, Vehicle, Plate..."
              className="form-input pl-9 py-1.5 text-xs w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : filteredInspections.length === 0 ? (
            <div className="p-8 text-center">
              <ShieldAlert size={36} className="text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">No inspection records match your search query.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job Number</th>
                    <th>Vehicle</th>
                    <th>Owner</th>
                    <th>Inspected By</th>
                    <th>Inspection Date</th>
                    <th>Findings / Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInspections.map((insp) => {
                    const job = insp.serviceJobId;
                    const veh = job?.vehicleId;
                    const cust = job?.customerId;
                    return (
                      <tr key={insp._id}>
                        <td className="font-mono font-bold text-primary">
                          <Link to={`/staff/jobs/${job?._id}`} className="hover:underline">
                            {job?.jobNumber}
                          </Link>
                        </td>
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
                        <td>{insp.inspectedBy?.name || 'Technician'}</td>
                        <td className="text-xs text-muted">
                          {new Date(insp.inspectionDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span className="text-xs text-gray-300 line-clamp-1 max-w-xs">
                            {insp.overallNotes || `${insp.inspectionItems?.length || 0} checklist items recorded`}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedInspection(insp);
                                setInspectionModalOpen(true);
                              }}
                              className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                            >
                              <Eye size={13} /> View Checklist
                            </button>
                            {job?._id && (
                              <Link
                                to={`/staff/jobs/${job._id}`}
                                className="btn btn-ghost btn-sm py-1 px-2 text-xs text-primary"
                                title="Open Job Card"
                              >
                                <ArrowRight size={14} />
                              </Link>
                            )}
                          </div>
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

      {/* Inspection Modal */}
      {inspectionModalOpen && selectedInspection && (
        <InspectionReportModal
          isOpen={inspectionModalOpen}
          onClose={() => setInspectionModalOpen(false)}
          inspection={selectedInspection}
        />
      )}
    </div>
  );
};

export default StaffInspections;
