import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, User, Mail, Phone, Lock, MapPin, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    if (formData.phone.length < 10) {
      return setError('Please enter a valid 10-digit phone number');
    }

    setSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/customer/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="brand-icon mx-auto mb-2">
            <Wrench size={24} className="text-white" />
          </div>
          <h2 className="auth-title">Create Customer Account</h2>
          <p className="auth-subtitle">Register your profile to book service appointments and manage vehicles</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group mb-3">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                required
                className="form-control pl-10"
                placeholder="e.g. Swaroop Kulkarni"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group mb-3">
              <label className="form-label">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  required
                  className="form-control pl-10"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Phone Number *</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  required
                  className="form-control pl-10"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group mb-3">
              <label className="form-label">Password *</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  name="password"
                  required
                  className="form-control pl-10"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Confirm Password *</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="form-control pl-10"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Residential Address (Optional)</label>
            <div className="input-with-icon">
              <MapPin size={18} className="input-icon" />
              <input
                type="text"
                name="address"
                className="form-control pl-10"
                placeholder="Flat / Street / Area, City"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block mb-3"
          >
            {submitting ? 'Creating Profile...' : 'Complete Registration'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-footer text-center">
          <p className="text-muted text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-semibold">
              Sign In to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
