import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserProfile = () => {
  const { user, login } = useAuth();
  const location = useLocation();

  const isPasswordRoute = location.pathname.includes('change-password');
  const [activeTab, setActiveTab] = useState(isPasswordRoute ? 'security' : 'profile');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname.includes('change-password')) {
      setActiveTab('security');
    }
  }, [location.pathname]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setProfileMsg({ type: 'success', text: 'Profile details updated successfully.' });
        if (res.data.user) {
          const currentToken = localStorage.getItem('token');
          if (currentToken) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        }
      }
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile details'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page max-w-4xl mx-auto">
      <div className="page-header mb-6">
        <h1 className="page-title">Account & Profile Settings</h1>
        <p className="page-subtitle">Manage your personal details, contact information, and account security</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-white'
          }`}
        >
          <User size={16} /> Personal Details
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-white'
          }`}
        >
          <KeyRound size={16} /> Security & Password
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Summary Card */}
          <div className="content-card text-center p-6 flex flex-col items-center">
            <div className="avatar-circle w-20 h-20 text-2xl font-bold mb-4 bg-primary text-white mx-auto flex items-center justify-center rounded-full shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-lg font-bold text-dark mb-1">{user?.name}</h3>
            <p className="text-xs text-muted mb-4 font-mono">{user?.email}</p>
            <span className="badge badge-primary uppercase tracking-wide text-xs px-3 py-1 font-semibold rounded-full bg-amber-500/10 text-highlight border border-amber-500/20">
              <ShieldCheck size={12} className="inline mr-1" />
              {user?.role} ACCOUNT
            </span>

            <div className="w-full border-t border-border mt-6 pt-4 text-left text-xs space-y-2 text-muted">
              <div>
                <span className="block text-gray-500">Account ID:</span>
                <span className="font-mono text-gray-300">{user?.id || user?._id || 'Verified'}</span>
              </div>
              <div>
                <span className="block text-gray-500">Portal Access:</span>
                <span className="text-emerald-400 font-semibold">Active & Authorized</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="content-card md:col-span-2 p-6">
            <h3 className="card-title mb-4 flex items-center gap-2 text-white">
              <User size={18} className="text-primary" /> Edit Profile Information
            </h3>

            {profileMsg.text && (
              <div
                className={`alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {profileMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-muted" />
                  <input
                    type="text"
                    required
                    className="form-input pl-10 w-full"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-muted" />
                  <input
                    type="email"
                    disabled
                    className="form-input pl-10 w-full opacity-60 cursor-not-allowed bg-black/20"
                    value={user?.email || ''}
                  />
                </div>
                <span className="text-[11px] text-muted mt-1 block">
                  Registered email address cannot be modified directly.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-muted" />
                  <input
                    type="text"
                    required
                    className="form-input pl-10 w-full"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Street Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-muted" />
                  <textarea
                    rows={3}
                    className="form-input pl-10 w-full"
                    placeholder="Enter workshop hub or residence address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>{profileLoading ? 'Saving...' : 'Update Details'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Change Password Tab */
        <div className="content-card max-w-xl mx-auto p-6">
          <h3 className="card-title mb-2 flex items-center gap-2 text-white">
            <Lock size={18} className="text-primary" /> Change Account Password
          </h3>
          <p className="text-xs text-muted mb-6">
            Ensure your account is using a secure, uncompromised password of at least 6 characters.
          </p>

          {passwordMsg.text && (
            <div
              className={`alert mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {passwordMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                className="form-input w-full"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                required
                className="form-input w-full"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                className="form-input w-full"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="btn btn-primary flex items-center gap-2"
              >
                <KeyRound size={16} />
                <span>{passwordLoading ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
