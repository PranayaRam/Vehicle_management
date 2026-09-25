import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  User
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STAFF',
    address: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/auth/users?role=${roleFilter}&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await api.put(`/auth/users/${user._id}/status`);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/auth/staff', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setModalOpen(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'STAFF',
          address: ''
        });
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff account');
    } finally {
      setSubmitting(false);
    }
  };

  const staffCount = users.filter((u) => u.role === 'STAFF').length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="user-management-page max-w-6xl mx-auto">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">User & Staff Roster</h1>
          <p className="page-subtitle">Oversee workshop advisors, technicians, administrators, and registered customers</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus size={16} /> Onboard Staff Member
        </button>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-50 text-primary">
            <Users size={22} />
          </div>
          <div>
            <span className="kpi-label">Total Accounts</span>
            <span className="kpi-value">{users.length}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-amber-50 text-warning">
            <UserCheck size={22} />
          </div>
          <div>
            <span className="kpi-label">Workshop Staff</span>
            <span className="kpi-value">{staffCount}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-emerald-50 text-success">
            <User size={22} />
          </div>
          <div>
            <span className="kpi-label">Registered Customers</span>
            <span className="kpi-value">{customerCount}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-purple-50 text-purple-600">
            <Shield size={22} />
          </div>
          <div>
            <span className="kpi-label">Administrators</span>
            <span className="kpi-value">{adminCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="content-card mb-6">
        <div className="card-body p-4 flex-between flex-wrap gap-4">
          {/* Role Filter Tabs */}
          <div className="flex gap-2">
            {['ALL', 'STAFF', 'CUSTOMER', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline'}`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
            <div className="input-group flex-1">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm flex items-center gap-1">
              <Search size={15} /> Search
            </button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="content-card">
        {loading ? (
          <div className="flex-center py-12">
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description="No user accounts match the current filter or search criteria."
          />
        ) : (
          <div className="table-responsive">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-muted font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Workstation / Location</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-border hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex-center font-bold text-xs uppercase">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <strong className="text-dark font-semibold text-sm block">{u.name}</strong>
                          <span className="text-[11px] text-muted font-mono">{u._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-dark">
                          <Mail size={12} className="text-muted" /> {u.email}
                        </span>
                        <span className="flex items-center gap-1 text-muted">
                          <Phone size={12} className="text-muted" /> {u.phone || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={u.role} />
                    </td>
                    <td className="py-3 px-4 text-muted">
                      {u.address ? (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {u.address}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`btn btn-xs ${u.isActive ? 'btn-outline text-danger hover:bg-red-50' : 'btn-outline text-success hover:bg-green-50'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Staff Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Onboard New Staff Member"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div>
            <label className="input-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Deshmukh (Lead Tech)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="tech@apexmotors.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Contact Phone *</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Initial Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">System Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
              >
                <option value="STAFF">Service Advisor / Technician (STAFF)</option>
                <option value="ADMIN">Workshop Manager / Executive (ADMIN)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Service Bay / Station Assignment</label>
            <input
              type="text"
              placeholder="e.g. Mechanical Bay 4, Baner Facility"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <UserPlus size={15} />
              {submitting ? 'Creating...' : 'Register Staff Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
