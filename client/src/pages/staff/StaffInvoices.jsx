import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  CreditCard,
  Eye,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import InvoiceModal from '../../components/common/InvoiceModal';
import Modal from '../../components/common/Modal';

const StaffInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Quick Payment Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('CASH');
  const [payRef, setPayRef] = useState('');
  const [paySubmitting, setPaySubmitting] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/invoices');
      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve workshop invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenPay = (inv) => {
    setPaymentInvoice(inv);
    const remaining = inv.total - (inv.amountPaid || 0);
    setPayAmount(remaining.toString());
    setPayRef(`PAY-${Date.now().toString().slice(-6)}`);
    setPayModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentInvoice) return;
    setPaySubmitting(true);
    try {
      const res = await api.post('/payments', {
        invoiceId: paymentInvoice._id,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        transactionReference: payRef
      });

      if (res.data.success) {
        setSuccessMsg(`Payment of ₹${Number(payAmount).toLocaleString()} recorded successfully.`);
        setPayModalOpen(false);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchInvoices();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setPaySubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;
    const query = searchTerm.toLowerCase();
    const veh = inv.vehicleId;
    const cust = inv.customerId;
    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.serviceJobId?.jobNumber?.toLowerCase().includes(query) ||
      veh?.registrationNumber?.toLowerCase().includes(query) ||
      veh?.brand?.toLowerCase().includes(query) ||
      cust?.name?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalReceivables = totalBilled - totalCollected;

  return (
    <div className="staff-invoices-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Workshop Invoices & Billing</h1>
          <p className="page-subtitle">Track final invoices, customer payment collections, and settlement records</p>
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

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-500/10 text-blue-400">
            <Receipt size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value font-mono">₹{loading ? '...' : totalBilled.toLocaleString()}</span>
            <span className="stat-name">Total Invoiced Amount</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value font-mono">₹{loading ? '...' : totalCollected.toLocaleString()}</span>
            <span className="stat-name">Total Realized Revenue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-amber-500/10 text-highlight">
            <Clock size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value font-mono">₹{loading ? '...' : totalReceivables.toLocaleString()}</span>
            <span className="stat-name">Pending Receivables</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex-between flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: 'ALL', label: `All (${invoices.length})` },
            { id: 'UNPAID', label: 'Unpaid' },
            { id: 'PARTIAL', label: 'Partially Paid' },
            { id: 'PAID', label: 'Fully Paid' }
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
            placeholder="Search invoice #, vehicle, client..."
            className="form-input pl-9 py-1.5 text-xs w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="content-card mb-6">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-8 text-center">
              <Receipt size={36} className="text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">No invoices found matching the current filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Remaining Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => {
                    const remaining = inv.total - (inv.amountPaid || 0);
                    const veh = inv.vehicleId;
                    const cust = inv.customerId;
                    return (
                      <tr key={inv._id}>
                        <td className="font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                        <td>
                          <div className="font-semibold text-white">
                            {veh?.brand} {veh?.model}
                          </div>
                          <span className="text-xs text-muted font-mono">{veh?.registrationNumber}</span>
                        </td>
                        <td>
                          <div>{cust?.name}</div>
                          <span className="text-xs text-muted">{cust?.phone}</span>
                        </td>
                        <td className="font-mono font-bold">₹{inv.total?.toLocaleString()}</td>
                        <td className="font-mono text-xs text-gray-300">
                          ₹{(inv.amountPaid || 0).toLocaleString()}
                        </td>
                        <td className="font-mono text-xs font-semibold text-amber-400">
                          ₹{remaining.toLocaleString()}
                        </td>
                        <td>
                          <StatusBadge status={inv.paymentStatus} />
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setInvoiceModalOpen(true);
                              }}
                              className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                            >
                              <Eye size={13} /> View
                            </button>

                            {inv.paymentStatus !== 'PAID' && (
                              <button
                                onClick={() => handleOpenPay(inv)}
                                className="btn btn-primary btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                              >
                                <CreditCard size={13} /> Settle
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

      {/* Invoice Modal */}
      {invoiceModalOpen && selectedInvoice && (
        <InvoiceModal
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          invoice={selectedInvoice}
        />
      )}

      {/* Staff Record Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title={`Record Payment for ${paymentInvoice?.invoiceNumber}`}
      >
        {paymentInvoice && (
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="bg-slate-50 border border-border rounded-xl p-3 text-xs space-y-1">
              <div className="flex-between">
                <span className="text-muted">Invoice Total:</span>
                <span className="font-mono font-semibold text-dark">₹{paymentInvoice.total?.toLocaleString()}</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Already Paid:</span>
                <span className="font-mono text-slate-700">₹{(paymentInvoice.amountPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex-between border-t border-border pt-1 font-bold">
                <span className="text-white">Balance Due:</span>
                <span className="font-mono text-primary">₹{(paymentInvoice.total - (paymentInvoice.amountPaid || 0)).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Amount to Record (₹)</label>
              <input
                type="number"
                required
                min="1"
                max={paymentInvoice.total - (paymentInvoice.amountPaid || 0)}
                className="form-input w-full font-mono font-bold"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Payment Method</label>
              <select
                className="form-input w-full"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
              >
                <option value="CASH">CASH (Counter Handover)</option>
                <option value="CARD">CARD (POS Terminal)</option>
                <option value="UPI">UPI (QR / Direct Transfer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Reference / Note</label>
              <input
                type="text"
                className="form-input w-full font-mono text-xs"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
              />
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
                type="submit"
                disabled={paySubmitting}
                className="btn btn-primary flex items-center gap-2"
              >
                <CreditCard size={15} />
                <span>{paySubmitting ? 'Recording...' : `Record Payment of ₹${Number(payAmount || 0).toLocaleString()}`}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StaffInvoices;
