import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Wrench, User, LogOut, LayoutDashboard, Calendar, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Wrench size={22} className="text-white" />
          </div>
          <div className="brand-text">
            <span className="brand-title">APEX MOTORS</span>
            <span className="brand-sub">Service & Repair Hub</span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Services
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="nav-user-menu">
              <Link to={getDashboardPath(user?.role)} className="btn btn-outline btn-sm">
                <LayoutDashboard size={16} />
                <span>Dashboard ({user?.role})</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Book a Service
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
