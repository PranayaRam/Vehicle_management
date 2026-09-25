import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  AlertTriangle,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const PartsInventory = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Part Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    category: 'General',
    stockQuantity: '',
    minimumStock: 5,
    unitPrice: '',
    supplier: 'Authorized OEM Supplier'
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Brakes',
    'Fluids & Lubricants',
    'Filters',
    'Engine Components',
    'Electricals',
    'Suspension',
    'Tyres',
    'Body & Exterior',
    'General'
  ];

  const fetchParts = async () => {
    try {
      setLoading(true);
      let url = '/parts';
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data.success) {
        setParts(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load parts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [categoryFilter]);

  const handleOpenAdd = () => {
    setEditingPart(null);
    setFormData({
      name: '',
      partNumber: '',
      category: 'General',
      stockQuantity: '',
      minimumStock: 5,
      unitPrice: '',
      supplier: 'Authorized OEM Supplier'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPart(p);
    setFormData({
      name: p.name,
      partNumber: p.partNumber,
      category: p.category,
      stockQuantity: p.stockQuantity,
      minimumStock: p.minimumStock,
      unitPrice: p.unitPrice,
      supplier: p.supplier || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingPart) {
        const res = await api.put(`/parts/${editingPart._id}`, formData);
        if (res.data.success) {
          setSuccessMsg('Part details updated successfully.');
          setIsModalOpen(false);
          fetchParts();
        }
      } else {
        const res = await api.post('/parts', formData);
        if (res.data.success) {
          setSuccessMsg('New part added to warehouse inventory.');
          setIsModalOpen(false);
          fetchParts();
        }
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save part');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="parts-inventory-page">
      <div className="page-header flex-between mb-6">
        <div>
          <h1 className="page-title">Spare Parts & Warehouse Inventory</h1>
          <p className="page-subtitle">Manage OEM replacement components, unit prices, supplier tracking, and low-stock limits</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Spare Part
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

      {/* Filter / Search Bar */}
      <div className="content-card mb-6 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted uppercase">Category:</span>
          <select
            className="form-control text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="form-control text-sm py-1.5"
            placeholder="Search part name or #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchParts()}
          />
          <button onClick={fetchParts} className="btn btn-outline btn-sm">
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* Parts Table */}
      <div className="content-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="flex-center py-10">
              <div className="spinner"></div>
            </div>
          ) : parts.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Package}
                title="No Parts Found"
                description="No parts match your inventory query. Click 'Add New Spare Part' to expand stock."
              />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Part Number</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Unit Price</th>
                    <th>Supplier</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => (
                    <tr key={p._id}>
                      <td className="font-mono font-bold text-primary">{p.partNumber}</td>
                      <td>
                        <div className="font-semibold text-dark">{p.name}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral text-xs">{p.category}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${p.isLowStock ? 'text-danger' : 'text-dark'}`}>
                            {p.stockQuantity} units
                          </span>
                          {p.isLowStock && (
                            <span className="badge badge-rejected text-xs flex items-center gap-1">
                              <AlertTriangle size={12} /> Low Stock (Min: {p.minimumStock})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="font-mono font-bold">₹{p.unitPrice?.toLocaleString()}</td>
                      <td className="text-xs text-muted">{p.supplier}</td>
                      <td>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1"
                        >
                          <Edit2 size={13} /> Edit / Restock
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

      {/* Add / Edit Part Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPart ? `Update Part: ${editingPart.partNumber}` : 'Add New Spare Part'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label text-xs">Part Name *</label>
            <input
              type="text"
              required
              className="form-control text-sm"
              placeholder="e.g. Ceramic Front Brake Pads"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row mb-3">
            <div className="form-group">
              <label className="form-label text-xs">Part Number (SKU) *</label>
              <input
                type="text"
                required
                disabled={!!editingPart}
                className="form-control text-sm font-mono uppercase"
                placeholder="e.g. BP-HYU-01"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Category *</label>
              <select
                className="form-control text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row mb-3">
            <div className="form-group">
              <label className="form-label text-xs">Current Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                className="form-control text-sm"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Minimum Warning Threshold</label>
              <input
                type="number"
                min="0"
                className="form-control text-sm"
                value={formData.minimumStock}
                onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row mb-4">
            <div className="form-group">
              <label className="form-label text-xs">Unit Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                className="form-control text-sm"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Supplier Name</label>
              <input
                type="text"
                className="form-control text-sm"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
              {submitting ? 'Saving...' : editingPart ? 'Update Part' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PartsInventory;
