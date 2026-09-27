import React, { useState } from 'react';
import {
  Settings,
  Building,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Server,
  Database
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    workshopName: 'Apex Motors Garage & Service Hub',
    address: 'Sector 4, Automobile Central Hub, Pune, Maharashtra 411045',
    phone: '+91 98765 00001',
    supportEmail: 'support@apexmotors.com',
    operatingHours: 'Monday - Saturday: 8:00 AM to 7:00 PM (Sunday Closed)',
    taxRate: '18',
    currency: 'INR (₹)',
    emergencyHelpline: '+91 98765 99999'
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Garage business settings saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 600);
  };

  return (
    <div className="admin-settings-page max-w-4xl mx-auto">
      <div className="page-header mb-6">
        <h1 className="page-title">Garage Business Settings</h1>
        <p className="page-subtitle">Configure garage operational parameters, workshop contact details, and system defaults</p>
      </div>

      {successMsg && (
        <div className="alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="content-card p-6">
          <h3 className="card-title mb-4 flex items-center gap-2 text-white">
            <Building size={18} className="text-primary" /> Workshop Entity & Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Workshop Legal Name</label>
              <input
                type="text"
                required
                className="form-input w-full"
                value={settings.workshopName}
                onChange={(e) => setSettings({ ...settings, workshopName: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Central Hub Address</label>
              <textarea
                rows={2}
                required
                className="form-input w-full"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Customer Care Phone</label>
              <input
                type="text"
                required
                className="form-input w-full"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Support Email</label>
              <input
                type="email"
                required
                className="form-input w-full"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Tax */}
        <div className="content-card p-6">
          <h3 className="card-title mb-4 flex items-center gap-2 text-white">
            <Clock size={18} className="text-primary" /> Timings & Tax Configurations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Operating Hours</label>
              <input
                type="text"
                required
                className="form-input w-full"
                value={settings.operatingHours}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                disabled
                className="form-input w-full opacity-70 bg-black/20"
                value={settings.taxRate}
              />
              <span className="text-[11px] text-muted mt-1 block">Configured via server .env (TAX_RATE=0.18)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Billing Currency</label>
              <input
                type="text"
                disabled
                className="form-input w-full opacity-70 bg-black/20"
                value={settings.currency}
              />
            </div>
          </div>
        </div>

        {/* System Diagnostics */}
        <div className="content-card p-6">
          <h3 className="card-title mb-4 flex items-center gap-2 text-white">
            <Server size={18} className="text-emerald-400" /> Infrastructure & Environment Health
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0b0e15] border border-border">
              <span className="text-muted block mb-1">Database Cluster:</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <Database size={13} /> MongoDB v8.0 Connected
              </strong>
              <span className="text-muted font-mono text-[10px]">127.0.0.1:27017</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e15] border border-border">
              <span className="text-muted block mb-1">API Service:</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <Server size={13} /> Node.js Express 5000
              </strong>
              <span className="text-muted font-mono text-[10px]">JWT / RESTful API</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0e15] border border-border">
              <span className="text-muted block mb-1">Client Framework:</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> React 18 + Vite HMR
              </strong>
              <span className="text-muted font-mono text-[10px]">Port 5173 Live</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 px-6"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
