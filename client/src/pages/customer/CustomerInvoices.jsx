import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  History,
  Download,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';

const CustomerInvoices = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [vehicleHistory, setVehicleHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paySubmitting, setPaySubmitting] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [invRes, vehRes] = await Promise.all([
        api.get('/invoices/my'),
        api.get('/vehicles/my')
      ]);

      if (invRes.data.success) {
        setInvoices(invRes.data.data);
      }
      if (vehRes.data.success) {
        setVehicles(vehRes.data.data);
        if (vehRes.data.data.length > 0) {
          setSelectedVehicleId(vehRes.data.data[0]._id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve billing records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch history when tab is history or vehicle selection changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedVehicleId) return;
      try {
        const res = await api.get(`/delivery/history/${selectedVehicleId}`);
        if (res.data.success) {
          setVehicleHistory(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load history for vehicle:', err);
      }
    };

    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, selectedVehicleId]);

  const handleOpenPay = (inv) => {
    setSelectedInvoice(inv);
    setPayModalOpen(true);
  };

  const handleSimulatePayment = async () => {
    if (!selectedInvoice) return;
    setPaySubmitting(true);
    try {
      const remainingAmount = selectedInvoice.total - (selectedInvoice.amountPaid || 0);
      const res = await api.post('/payments', {
        invoiceId: selectedInvoice._id,
        amount: remainingAmount,
        paymentMethod
      });

      if (res.data.success) {
        setSuccessMsg(`Payment of ₹${remainingAmount.toLocaleString()} recorded successfully via ${paymentMethod}!`);
        setPayModalOpen(false);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchInitialData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed');
    } finally {
      setPaySubmitting(false);
    }
  };

  return (
    <div className="customer-invoices-page max-w-4xl mx-auto">
      <div className="page-header mb-6">
        <h1 className="page-title">Billing & Vehicle Service History</h1>
        <p className="page-subtitle">Track final invoices, settle outstanding charges, and inspect historical garage maintenance logs</p>
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

      {/* Tabs Header */}
      <div className="flex gap-2 border-b border-border pb-3 mb-6">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`btn btn-sm ${activeTab === 'invoices' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Receipt size={16} /> Final Invoices & Payment
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-outline'}`}
        >
          <History size={16} /> Complete Vehicle Service History
        </button>
      </div>

      {/* TAB 1: INVOICES */}
      {activeTab === 'invoices' && (
        <div>
          {loading ? (
            <div className="flex-center py-10">
              <div className="spinner"></div>
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Invoices Issued Yet"
              description="Final invoices are issued after service completion and quality assurance verification."
            />
          ) : (
            <div className="invoices-list">
              {invoices.map((inv) => (
                <div key={inv._id} className="content-card mb-6">
                  <div className="card-header flex-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-primary text-base">{inv.invoiceNumber}</span>
                        <StatusBadge status={inv.paymentStatus} />
                      </div>
                      <span className="text-xs text-muted">
                        Vehicle: {inv.vehicleId?.brand} {inv.vehicleId?.model} ({inv.vehicleId?.registrationNumber}) • Job #{inv.serviceJobId?.jobNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted block">Total Amount</span>
                      <span className="font-mono text-xl font-extrabold text-dark">₹{inv.total?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="flex-between py-2 border-b border-border text-xs">
                      <span>Subtotal (Approved Parts & Certified Labour):</span>
                      <span className="font-mono">₹{inv.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex-between py-2 border-b border-border text-xs">
                      <span>Applicable GST (18%):</span>
                      <span className="font-mono">₹{inv.tax?.toLocaleString()}</span>
                    </div>
                    <div className="flex-between py-2 font-bold text-dark text-sm border-b border-border">
                      <span>Final Net Amount:</span>
                      <span className="font-mono text-primary">₹{inv.total?.toLocaleString()}</span>
                    </div>
                    <div className="flex-between py-2 text-xs font-semibold text-success">
                      <span>Amount Paid:</span>
                      <span className="font-mono">₹{(inv.amountPaid || 0).toLocaleString()}</span>
                    </div>

                    {inv.paymentStatus !== 'PAID' && (
                      <div className="flex justify-end pt-3">
                        <button
                          onClick={() => handleOpenPay(inv)}
                          className="btn btn-primary btn-sm flex items-center gap-1"
                        >
                          <CreditCard size={15} /> Settle Payment (₹{(inv.total - (inv.amountPaid || 0)).toLocaleString()})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVICE HISTORY */}
      {activeTab === 'history' && (
        <div className="history-tab">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded border border-border">
            <label className="text-xs font-bold text-dark uppercase flex-shrink-0">Select Vehicle:</label>
            <select
              className="form-control text-sm max-w-xs"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.brand} {v.model} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          {vehicleHistory.length === 0 ? (
            <EmptyState
              icon={History}
              title="No Completed Service History Yet"
              description="Historical service records will populate automatically once your vehicle completes its full workshop cycle and handover delivery."
            />
          ) : (
            <div className="history-records-timeline">
              {vehicleHistory.map((item, idx) => (
                <div key={idx} className="content-card mb-4 border-l-4 border-l-success">
                  <div className="card-header flex-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-dark">{item.job?.reportedProblem}</span>
                        <span className="badge badge-success">COMPLETED</span>
                      </div>
                      <span className="text-xs text-muted">
                        Delivered on {item.delivery ? new Date(item.delivery.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} by {item.delivery?.deliveredBy?.name || 'Staff'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted block">Invoice Total</span>
                      <span className="font-mono text-lg font-bold text-dark">₹{item.invoice?.total?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="card-body text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong>Parts Replaced:</strong>
                        <ul className="list-disc pl-4 mt-1 text-slate-700">
                          {item.invoice?.parts?.map((p, pIdx) => (
                            <li key={pIdx}>
                              {p.name} × {p.quantity} (₹{p.total?.toLocaleString()})
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Labour Operations:</strong>
                        <ul className="list-disc pl-4 mt-1 text-slate-700">
                          {item.invoice?.labour?.map((l, lIdx) => (
                            <li key={lIdx}>
                              {l.name} (₹{l.total?.toLocaleString()})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Simulated Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Simulated Payment Gateway"
      >
        <p className="text-sm text-muted mb-4">
          For evaluation assessment, test payments can be simulated instantly without real gateway keys:
        </p>

        <div className="p-3 bg-slate-50 border border-border rounded mb-4 text-sm">
          <div className="flex-between mb-1">
            <span className="text-muted">Invoice Ref:</span>
            <strong className="font-mono text-primary">{selectedInvoice?.invoiceNumber}</strong>
          </div>
          <div className="flex-between">
            <span className="text-muted">Payable Balance:</span>
            <strong className="font-mono text-dark">
              ₹{selectedInvoice ? (selectedInvoice.total - (selectedInvoice.amountPaid || 0)).toLocaleString() : 0}
            </strong>
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label text-xs uppercase font-bold text-muted">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {['UPI', 'CARD', 'CASH'].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`btn btn-sm ${paymentMethod === m ? 'btn-primary' : 'btn-outline'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button onClick={() => setPayModalOpen(false)} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            onClick={handleSimulatePayment}
            disabled={paySubmitting}
            className="btn btn-primary btn-sm"
          >
            {paySubmitting ? 'Processing...' : `Authorize ₹${selectedInvoice ? (selectedInvoice.total - (selectedInvoice.amountPaid || 0)).toLocaleString() : 0}`}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerInvoices;
