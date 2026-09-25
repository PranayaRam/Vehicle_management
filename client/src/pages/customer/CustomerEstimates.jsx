import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  FileX2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Wrench,
  DollarSign
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const CustomerEstimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Rejection Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      // Fetch customer's service jobs first, then fetch estimate for each job
      const jobsRes = await api.get('/service-jobs/my');
      if (jobsRes.data.success) {
        const estPromises = jobsRes.data.data.map(async (job) => {
          try {
            const eRes = await api.get(`/estimates/job/${job._id}`);
            return eRes.data.success ? { ...eRes.data.data, job } : null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(estPromises);
        setEstimates(results.filter(Boolean));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve estimates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const handleApprove = async (estId) => {
    if (!window.confirm('Do you authorize Apex Motors technicians to proceed with the listed parts and labour services?')) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.put(`/estimates/${estId}/approve`, {
        remarks: 'Approved by customer via customer portal'
      });
      if (res.data.success) {
        setSuccessMsg('Estimate approved! Workshop technicians have been authorized to begin servicing.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchEstimates();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve estimate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReject = (est) => {
    setSelectedEstimate(est);
    setRejectRemarks('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedEstimate) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/estimates/${selectedEstimate._id}/reject`, {
        remarks: rejectRemarks || 'Declined by customer'
      });
      if (res.data.success) {
        setSuccessMsg('Estimate marked as rejected. Service advisor has been notified.');
        setRejectModalOpen(false);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchEstimates();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject estimate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="customer-estimates-page max-w-4xl mx-auto">
      <div className="page-header mb-6">
        <h1 className="page-title">Digital Cost Estimates & Approvals</h1>
        <p className="page-subtitle">Review transparent itemized quotes before repair work begins. No work is conducted without your approval.</p>
      </div>

      {successMsg && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex-center py-10">
          <div className="spinner"></div>
        </div>
      ) : estimates.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Estimates Pending"
          description="You do not have any pending quotes. Once our technicians inspect your vehicle at the workshop, an itemized quote will be submitted here for your approval."
        />
      ) : (
        <div className="estimates-list">
          {estimates.map((est) => (
            <div key={est._id} className="content-card mb-6 border-l-4 border-l-primary">
              <div className="card-header flex-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-extrabold text-primary text-base">{est.estimateNumber}</span>
                    <StatusBadge status={est.status} />
                  </div>
                  <span className="text-xs text-muted">
                    Job #{est.job?.jobNumber} • {est.job?.vehicleId?.brand} {est.job?.vehicleId?.model} ({est.job?.vehicleId?.registrationNumber})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted block">Total Estimated Cost</span>
                  <span className="font-mono text-xl font-extrabold text-dark">₹{est.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="card-body">
                {/* Parts Table */}
                <h4 className="font-bold text-xs uppercase text-muted mb-2">Required OEM Spare Parts</h4>
                <div className="table-responsive mb-4">
                  <table className="data-table text-xs">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {est.parts.map((p, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-dark">{p.name}</td>
                          <td>{p.quantity}</td>
                          <td>₹{p.unitPrice?.toLocaleString()}</td>
                          <td className="text-right font-mono">₹{p.total?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Labour Table */}
                <h4 className="font-bold text-xs uppercase text-muted mb-2">Technician Labour Operations</h4>
                <div className="table-responsive mb-4">
                  <table className="data-table text-xs">
                    <thead>
                      <tr>
                        <th>Operation Description</th>
                        <th>Units</th>
                        <th>Unit Rate</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {est.labour.map((l, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-dark">{l.name}</td>
                          <td>{l.quantity}</td>
                          <td>₹{l.unitCharge?.toLocaleString()}</td>
                          <td className="text-right font-mono">₹{l.total?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="p-3 bg-slate-50 border border-border rounded text-xs mb-4 max-w-sm ml-auto">
                  <div className="flex-between py-1">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{est.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex-between py-1">
                    <span>GST (18%):</span>
                    <span className="font-mono">₹{est.tax?.toLocaleString()}</span>
                  </div>
                  <div className="flex-between py-1 font-bold text-sm text-dark border-t border-border mt-1 pt-1">
                    <span>Grand Total:</span>
                    <span className="font-mono text-primary">₹{est.total?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Decision Actions */}
                {est.status === 'PENDING_APPROVAL' && (
                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button
                      onClick={() => handleOpenReject(est)}
                      disabled={submitting}
                      className="btn btn-outline btn-sm text-danger hover:bg-danger-subtle"
                    >
                      <FileX2 size={16} /> Decline Estimate
                    </button>
                    <button
                      onClick={() => handleApprove(est._id)}
                      disabled={submitting}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={16} /> Authorize & Approve Service
                    </button>
                  </div>
                )}

                {est.status === 'APPROVED' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>You approved this estimate on {new Date(est.approvedAt).toLocaleString()}.</span>
                  </div>
                )}

                {est.status === 'REJECTED' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center gap-2">
                    <FileX2 size={16} className="text-danger" />
                    <span>Estimate declined. Remarks: "{est.customerRemarks}"</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline Estimate Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Estimate"
      >
        <p className="text-sm text-muted mb-3">
          Please provide a reason so our service advisor can contact you with revised options or explanations:
        </p>
        <textarea
          rows={3}
          className="form-control mb-4"
          placeholder="e.g. Budget constraint, defer brake pad replacement to next month, want discussion..."
          value={rejectRemarks}
          onChange={(e) => setRejectRemarks(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setRejectModalOpen(false)} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            onClick={handleConfirmReject}
            disabled={submitting}
            className="btn btn-primary btn-sm bg-danger border-danger"
          >
            Confirm Decline
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerEstimates;
