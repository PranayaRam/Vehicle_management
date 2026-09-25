import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      const destination = from || getDashboardPath(result.user.role);
      navigate(destination, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon mx-auto mb-2">
            <Wrench size={24} className="text-white" />
          </div>
          <h2 className="auth-title">Sign In to Apex Motors</h2>
          <p className="auth-subtitle">Access your service bookings, estimates, and repair records</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-control pl-10"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                className="form-control pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block mb-3"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-divider">
          <span>Quick Demo Access</span>
        </div>

        <div className="demo-accounts-grid">
          <button
            type="button"
            className="btn btn-demo"
            onClick={() => handleQuickLogin('customer@apexmotors.com', 'password123')}
          >
            <span className="demo-role">Customer</span>
            <span className="demo-hint">customer@apexmotors.com</span>
          </button>
          <button
            type="button"
            className="btn btn-demo"
            onClick={() => handleQuickLogin('staff@apexmotors.com', 'password123')}
          >
            <span className="demo-role">Staff Advisor</span>
            <span className="demo-hint">staff@apexmotors.com</span>
          </button>
          <button
            type="button"
            className="btn btn-demo"
            onClick={() => handleQuickLogin('admin@apexmotors.com', 'password123')}
          >
            <span className="demo-role">Administrator</span>
            <span className="demo-hint">admin@apexmotors.com</span>
          </button>
        </div>

        <div className="auth-footer mt-4 text-center">
          <p className="text-muted text-sm">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
