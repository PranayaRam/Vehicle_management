import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Edit2, Clock, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const LabourCatalog = () => {
  const [labour, setLabour] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    charge: '',
    estimatedDuration: '1 Hour'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchLabour = async () => {
    try {
      setLoading(true);
      let url = '/labour';
      if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setLabour(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load labour catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabour();
  }, []);

  const handleOpenAdd = () => {
    setEditingLabour(null);
    setFormData({
      name: '',
      description: '',
      charge: '',
      estimatedDuration: '1 Hour'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (l) => {
    setEditingLabour(l);
    setFormData({
      name: l.name,
      description: l.description,
      charge: l.charge,
      estimatedDuration: l.estimatedDuration
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingLabour) {
        const res = await api.put(`/labour/${editingLabour._id}`, formData);
        if (res.data.success) {
          setSuccessMsg('Labour operation updated successfully.');
          setIsModalOpen(false);
          fetchLabour();
        }
      } else {
        const res = await api.post('/labour', formData);
        if (res.data.success) {
          setSuccessMsg('New labour operation added to workshop catalog.');
          setIsModalOpen(false);
          fetchLabour();
        }
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save labour item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="labour-catalog-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Labour & Repair Operations Catalog</h1>
          <p className="page-subtitle">Standardized workshop technician tasks, book times, and fixed billing rates</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add Labour Operation
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
          ) : labour.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Wrench}
                title="No Labour Operations Found"
                description="Click 'Add Labour Operation' to configure standard workshop repair services."
              />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Operation Name</th>
                    <th>Description</th>
                    <th>Standard Duration</th>
                    <th>Standard Charge</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {labour.map((l) => (
                    <tr key={l._id}>
                      <td className="font-semibold text-dark">{l.name}</td>
                      <td className="text-xs text-muted max-w-xs">{l.description}</td>
                      <td>
                        <span className="text-xs font-medium flex items-center gap-1 text-slate-600">
                          <Clock size={13} /> {l.estimatedDuration}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-dark">₹{l.charge?.toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => handleOpenEdit(l)}
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
        title={editingLabour ? `Edit Labour: ${editingLabour.name}` : 'New Labour Operation'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label text-xs">Operation Name *</label>
            <input
              type="text"
              required
              className="form-control text-sm"
              placeholder="e.g. Brake Pad Replacement & Caliper Service"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-xs">Description & Scope of Work</label>
            <textarea
              rows={2}
              className="form-control text-sm"
              placeholder="Scope of mechanical operation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row mb-4">
            <div className="form-group">
              <label className="form-label text-xs">Standard Charge (₹) *</label>
              <input
                type="number"
                required
                min="0"
                className="form-control text-sm"
                value={formData.charge}
                onChange={(e) => setFormData({ ...formData, charge: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Standard Duration *</label>
              <input
                type="text"
                required
                className="form-control text-sm"
                placeholder="e.g. 1.5 Hours"
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
              {submitting ? 'Saving...' : editingLabour ? 'Update Operation' : 'Add Operation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LabourCatalog;
