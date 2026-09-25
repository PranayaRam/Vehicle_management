import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const ServiceTypesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    estimatedDuration: '3 - 4 Hours',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/service-types?includeInactive=true');
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      estimatedDuration: '3 - 4 Hours',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingService(s);
    setFormData({
      name: s.name,
      description: s.description,
      basePrice: s.basePrice,
      estimatedDuration: s.estimatedDuration,
      isActive: s.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingService) {
        const res = await api.put(`/service-types/${editingService._id}`, formData);
        if (res.data.success) {
          setSuccessMsg('Service package updated successfully.');
          setIsModalOpen(false);
          fetchServices();
        }
      } else {
        const res = await api.post('/service-types', formData);
        if (res.data.success) {
          setSuccessMsg('New service package added to workshop catalog.');
          setIsModalOpen(false);
          fetchServices();
        }
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service type');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="service-types-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Service Packages & Catalog</h1>
          <p className="page-subtitle">Configure customer-facing standard service packages, durations, and base prices</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add Service Package
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

      <div className="content-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-10">
              <div className="spinner"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Layers}
                title="No Service Packages Found"
                description="Click 'Add Service Package' to configure offerings like General Service, Oil Change, etc."
              />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Package Name</th>
                    <th>Scope Description</th>
                    <th>Est. Time</th>
                    <th>Base Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s._id}>
                      <td className="font-semibold text-dark">{s.name}</td>
                      <td className="text-xs text-muted max-w-sm">{s.description}</td>
                      <td>
                        <span className="text-xs font-medium flex items-center gap-1 text-slate-600">
                          <Clock size={13} /> {s.estimatedDuration}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-primary">₹{s.basePrice?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${s.isActive ? 'badge-approved' : 'badge-neutral'}`}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? `Edit Service Package: ${editingService.name}` : 'New Service Package'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label text-xs">Package Name *</label>
            <input
              type="text"
              required
              className="form-control text-sm"
              placeholder="e.g. Periodic General Service"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-xs">Scope Description *</label>
            <textarea
              rows={3}
              required
              className="form-control text-sm"
              placeholder="Detailed inclusions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row mb-4">
            <div className="form-group">
              <label className="form-label text-xs">Base Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                className="form-control text-sm"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Estimated Turnaround Duration *</label>
              <input
                type="text"
                required
                className="form-control text-sm"
                placeholder="e.g. 3 - 4 Hours"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
              {submitting ? 'Saving...' : editingService ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceTypesManager;
