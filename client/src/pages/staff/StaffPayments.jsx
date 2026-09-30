import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

const StaffPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/payments');
        if (res.data.success) {
          setPayments(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve payment records');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;
    const query = searchTerm.toLowerCase();
    const inv = p.invoiceId;
    const cust = inv?.customerId;
    const veh = inv?.vehicleId;

    const matchesSearch =
      p.transactionReference?.toLowerCase().includes(query) ||
      inv?.invoiceNumber?.toLowerCase().includes(query) ||
      cust?.name?.toLowerCase().includes(query) ||
      veh?.registrationNumber?.toLowerCase().includes(query);

    return matchesMethod && matchesSearch;
  });

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="staff-payments-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Workshop Payments Ledger</h1>
          <p className="page-subtitle">Real-time audit log of all customer payment transactions, collections, and channel settlements</p>
        </div>
      </div>

      {error && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value font-mono">₹{loading ? '...' : totalCollected.toLocaleString()}</span>
            <span className="stat-name">Total Settled Receipts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-500/10 text-blue-400">
            <CreditCard size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{loading ? '...' : payments.length}</span>
            <span className="stat-name">Total Transactions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap bg-amber-500/10 text-highlight">
            <ShieldCheck size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-value">100%</span>
            <span className="stat-name">Reconciled Channels</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex-between flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {['ALL', 'UPI', 'CARD', 'CASH'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                methodFilter === m
                  ? 'bg-primary text-black font-bold'
                  : 'bg-[#111622] text-gray-400 border border-border hover:border-gray-500'
              }`}
            >
              {m === 'ALL' ? `All Methods (${payments.length})` : m}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-muted" />
          <input
            type="text"
            placeholder="Search ref #, invoice, customer..."
            className="form-input pl-9 py-1.5 text-xs w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="content-card mb-6">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard size={36} className="text-muted mx-auto mb-2" />
              <p className="text-muted text-sm">No payment records found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Txn Reference</th>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Payment Channel</th>
                    <th>Amount Received</th>
                    <th>Logged By</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => {
                    const inv = p.invoiceId;
                    const cust = inv?.customerId;
                    const veh = inv?.vehicleId;
                    return (
                      <tr key={p._id}>
                        <td className="font-mono font-bold text-primary">{p.transactionReference}</td>
                        <td className="font-mono text-xs">{inv?.invoiceNumber || 'INV-Direct'}</td>
                        <td>
                          <div className="font-semibold text-white">{cust?.name || 'Customer'}</div>
                          <span className="text-xs text-muted">{cust?.phone}</span>
                        </td>
                        <td>
                          <div>{veh?.brand} {veh?.model}</div>
                          <span className="text-xs text-muted font-mono">{veh?.registrationNumber}</span>
                        </td>
                        <td>
                          <span className="badge font-mono text-xs px-2 py-0.5 rounded bg-black/40 text-gray-200 border border-border">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="font-mono font-bold text-sm text-emerald-400">
                          ₹{p.amount?.toLocaleString()}
                        </td>
                        <td className="text-xs text-gray-300">
                          {p.recordedBy?.name || 'Reception Staff'}
                        </td>
                        <td className="text-xs text-muted">
                          {new Date(p.paymentDate).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
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

export default StaffPayments;
