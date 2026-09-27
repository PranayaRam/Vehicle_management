import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Car,
  DollarSign,
  ShieldCheck,
  Eye,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import InvoiceModal from '../../components/common/InvoiceModal';

const CustomerPayments = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paySubmitting, setPaySubmitting] = useState(false);

  // Invoice Preview State
  const [previewInvoiceOpen, setPreviewInvoiceOpen] = useState(false);
  const [previewInvoiceData, setPreviewInvoiceData] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/invoices/my');
      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve payment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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
        fetchInvoices();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setPaySubmitting(false);
    }
  };

  const pendingInvoices = invoices.filter(inv => inv.paymentStatus !== 'PAID');
  const settledInvoices = invoices.filter(inv => inv.paymentStatus === 'PAID');

  const totalOutstanding = pendingInvoices.reduce(
    (sum, inv) => sum + (inv.total - (inv.amountPaid || 0)),
    0
  );
  const totalSettled = settledInvoices.reduce(
    (sum, inv) => sum + (inv.amountPaid || inv.total),
    0
  );

  return (
    <div className="customer-payments-page max-w-5xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Billing & Payment Center</h1>
          <p className="page-subtitle">View invoices, settle outstanding balances securely, and track your payment receipts</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-amber-500/10 text-[#ffb703]">
            <Clock size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value font-mono">₹{loading ? '...' : totalOutstanding.toLocaleString()}</span>
            <span className="stat-name">Pending Amount Due</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value font-mono">₹{loading ? '...' : totalSettled.toLocaleString()}</span>
            <span className="stat-name">Total Settled Payments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-500/10 text-blue-400">
            <Receipt size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : invoices.length}</span>
            <span className="stat-name">Invoices Generated</span>
          </div>
        </div>
      </div>

      {/* Invoices & Settlements Table */}
      <div className="content-card mb-6">
        <div className="card-header flex-between">
          <h3 className="card-title flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Invoice Ledger & Payment Actions
          </h3>
          <span className="text-xs text-muted">All prices include 18% GST</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-8 text-center">
              <Receipt size={36} className="text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">No billing records or invoices generated for your account yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Vehicle</th>
                    <th>Job ID</th>
                    <th>Invoice Date</th>
                    <th>Total</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const remaining = inv.total - (inv.amountPaid || 0);
                    return (
                      <tr key={inv._id}>
                        <td className="font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                        <td>
                          <div className="font-semibold text-white">
                            {inv.vehicleId?.brand} {inv.vehicleId?.model}
                          </div>
                          <span className="text-xs text-muted font-mono">{inv.vehicleId?.registrationNumber}</span>
                        </td>
                        <td className="font-mono text-xs">{inv.serviceJobId?.jobNumber || 'SJ-General'}</td>
                        <td className="text-xs text-muted">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>
                        <td className="font-mono font-bold">₹{inv.total?.toLocaleString()}</td>
                        <td className="font-mono text-xs text-gray-300">
                          ₹{(inv.amountPaid || 0).toLocaleString()}
                        </td>
                        <td>
                          <StatusBadge status={inv.paymentStatus} />
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {inv.paymentStatus !== 'PAID' ? (
                              <button
                                onClick={() => handleOpenPay(inv)}
                                className="btn btn-primary btn-sm py-1 px-3 text-xs flex items-center gap-1"
                              >
                                <CreditCard size={13} /> Pay ₹{remaining.toLocaleString()}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setPreviewInvoiceData(inv);
                                  setPreviewInvoiceOpen(true);
                                }}
                                className="btn btn-outline btn-sm py-1 px-3 text-xs flex items-center gap-1"
                              >
                                <Eye size={13} /> Receipt
                              </button>
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

      {/* Payment Processing Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title={`Payment Checkout — ${selectedInvoice?.invoiceNumber}`}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="bg-[#0b0e15] border border-border rounded-xl p-4">
              <div className="flex-between mb-2">
                <span className="text-xs text-muted">Vehicle:</span>
                <span className="text-sm font-semibold text-white">
                  {selectedInvoice.vehicleId?.brand} {selectedInvoice.vehicleId?.model} ({selectedInvoice.vehicleId?.registrationNumber})
                </span>
              </div>
              <div className="flex-between mb-2">
                <span className="text-xs text-muted">Invoice Subtotal:</span>
                <span className="text-sm font-mono text-gray-300">₹{selectedInvoice.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex-between mb-2">
                <span className="text-xs text-muted">18% GST:</span>
                <span className="text-sm font-mono text-gray-300">₹{selectedInvoice.tax?.toLocaleString()}</span>
              </div>
              <div className="flex-between border-t border-border pt-2">
                <span className="text-sm font-bold text-white">Remaining Balance:</span>
                <span className="text-lg font-bold font-mono text-primary">
                  ₹{(selectedInvoice.total - (selectedInvoice.amountPaid || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {['UPI', 'CARD', 'CASH'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 px-3 rounded-xl border text-center font-semibold text-xs transition-all ${
                      paymentMethod === method
                        ? 'border-primary bg-amber-500/10 text-primary'
                        : 'border-border bg-black/20 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted bg-[#111622] p-3 rounded-lg border border-border flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
              <span>Payments are processed with 256-bit encryption. A digital receipt will be generated automatically.</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="btn btn-outline"
                disabled={paySubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={paySubmitting}
                className="btn btn-primary flex items-center gap-2"
              >
                <CreditCard size={16} />
                <span>
                  {paySubmitting
                    ? 'Processing...'
                    : `Confirm Payment of ₹${(selectedInvoice.total - (selectedInvoice.amountPaid || 0)).toLocaleString()}`}
                </span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Invoice Receipt Modal */}
      {previewInvoiceOpen && previewInvoiceData && (
        <InvoiceModal
          isOpen={previewInvoiceOpen}
          onClose={() => setPreviewInvoiceOpen(false)}
          invoice={previewInvoiceData}
        />
      )}
    </div>
  );
};

export default CustomerPayments;
