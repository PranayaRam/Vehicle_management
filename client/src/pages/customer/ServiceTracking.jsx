import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
  Receipt,
  Truck,
  ArrowRight,
  CalendarPlus
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import WorkflowStepper from '../../components/common/WorkflowStepper';
import EmptyState from '../../components/common/EmptyState';

const ServiceTracking = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/service-jobs/my');
        if (res.data.success) {
          // Sort active jobs first, then recent completed
          setJobs(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load active service jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, []);

  const activeJobs = jobs.filter(j => j.status !== 'COMPLETED' && j.status !== 'CANCELLED');
  const pastJobs = jobs.filter(j => j.status === 'COMPLETED');

  return (
    <div className="service-tracking-page max-w-5xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Live Service Tracking</h1>
          <p className="page-subtitle">Real-time status updates and stage progress for your vehicles undergoing workshop service</p>
        </div>
        <Link to="/customer/book" className="btn btn-primary flex items-center gap-2">
          <CalendarPlus size={16} /> Book Service
        </Link>
      </div>

      {loading ? (
        <div className="flex-center py-12">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger p-4 rounded-xl mb-6 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : activeJobs.length === 0 ? (
        <div className="space-y-6">
          <div className="content-card p-8 text-center">
            <Wrench size={40} className="text-highlight mx-auto mb-3 opacity-90" />
            <h3 className="text-lg font-bold text-dark mb-2">No Active Vehicles in Service</h3>
            <p className="text-muted text-sm max-w-md mx-auto mb-6">
              None of your vehicles are currently checked into the workshop bays. When you book and check in your car, you can track its stage-by-stage progress here.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/customer/book" className="btn btn-primary">
                Book a Service Appointment
              </Link>
              <Link to="/customer/vehicles" className="btn btn-outline">
                View My Vehicles
              </Link>
            </div>
          </div>

          {pastJobs.length > 0 && (
            <div className="content-card p-6">
              <h3 className="card-title mb-4 flex items-center gap-2 text-white">
                <CheckCircle2 size={18} className="text-emerald-400" /> Recently Completed Services
              </h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Vehicle</th>
                      <th>Service Advisor</th>
                      <th>Completion Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastJobs.slice(0, 3).map((job) => (
                      <tr key={job._id}>
                        <td className="font-mono font-bold text-primary">{job.jobNumber}</td>
                        <td>
                          <div className="font-semibold text-white">
                            {job.vehicleId?.brand} {job.vehicleId?.model}
                          </div>
                          <span className="text-xs text-muted font-mono">{job.vehicleId?.registrationNumber}</span>
                        </td>
                        <td>{job.assignedStaffId?.name || 'Service Advisor'}</td>
                        <td className="text-xs text-muted">
                          {new Date(job.updatedAt).toLocaleDateString()}
                        </td>
                        <td>
                          <StatusBadge status={job.status} />
                        </td>
                        <td>
                          <Link to="/customer/invoices" className="btn btn-ghost btn-sm">
                            View Invoice
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {activeJobs.map((job) => (
            <div key={job._id} className="content-card p-6 border-l-4 border-l-primary shadow-lg">
              {/* Job Header */}
              <div className="flex-between flex-wrap gap-4 border-b border-border pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xl font-extrabold text-highlight">{job.jobNumber}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <h3 className="text-lg font-bold text-dark">
                    {job.vehicleId?.brand} {job.vehicleId?.model} {job.vehicleId?.variant}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-border">
                    {job.vehicleId?.registrationNumber}
                  </span>
                </div>

                <div className="text-right text-xs text-muted">
                  <div className="mb-1">
                    Service Advisor: <strong className="text-dark">{job.assignedStaffId?.name || 'Vikram Joshi'}</strong>
                  </div>
                  <div>
                    Intake Date: <span className="font-mono text-slate-600">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="mb-6 py-2">
                <WorkflowStepper currentStatus={job.status} />
              </div>

              {/* Status Context & Action Prompts */}
              <div className="bg-slate-50 border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-dark mb-1">Reported Customer Concern:</h4>
                  <p className="text-xs text-slate-600 italic mb-2">"{job.reportedProblem || 'Standard Periodic Maintenance'}"</p>
                  
                  {job.status === 'ESTIMATE_PENDING' && (
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle size={14} /> Action Required: The service estimate is prepared and awaiting your digital approval before work can proceed.
                    </p>
                  )}
                  {job.status === 'READY_FOR_DELIVERY' && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Vehicle is road-tested and ready for pickup at Bay 1! Please complete settlement to collect keys.
                    </p>
                  )}
                  {job.status === 'IN_SERVICE' && (
                    <p className="text-xs text-blue-400 font-semibold flex items-center gap-1.5">
                      <Wrench size={14} /> Certified technicians are actively servicing and replacing allocated parts on your vehicle.
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex gap-2">
                  {job.status === 'ESTIMATE_PENDING' && (
                    <Link to="/customer/estimates" className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                      <FileCheck2 size={14} /> Review & Approve Estimate
                    </Link>
                  )}
                  {(job.status === 'READY_FOR_DELIVERY' || job.status === 'COMPLETED') && (
                    <Link to="/customer/invoices" className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                      <Receipt size={14} /> View Invoice & Pay
                    </Link>
                  )}
                  <Link to="/customer/bookings" className="btn btn-outline text-xs py-2 px-4">
                    Booking Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceTracking;
