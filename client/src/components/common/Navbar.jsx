import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Wrench, User, LogOut, LayoutDashboard, Calendar, Car, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
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

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-nav-toggle btn btn-ghost btn-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && (
        <div className="mobile-nav-menu">
          <NavLink
            to="/"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </NavLink>

          <div className="mobile-nav-divider" />

          {isAuthenticated ? (
            <div className="mobile-nav-auth">
              <Link
                to={getDashboardPath(user?.role)}
                className="btn btn-outline btn-sm btn-block"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard ({user?.role})</span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="btn btn-ghost btn-sm btn-block"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="mobile-nav-auth">
              <Link
                to="/login"
                className="btn btn-outline btn-sm btn-block"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm btn-block"
                onClick={() => setMobileOpen(false)}
              >
                Book a Service
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
