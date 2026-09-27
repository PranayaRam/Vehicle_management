import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'badge-admin';
      case 'STAFF':
        return 'badge-staff';
      case 'CUSTOMER':
      default:
        return 'badge-customer';
    }
  };

  const profilePath = `/${user?.role?.toLowerCase() || 'customer'}/profile`;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h3 className="topbar-greeting">Welcome back, {user?.name}</h3>
        <span className="topbar-sub">Vehicle Service Management System</span>
      </div>

      <div className="topbar-right">
        <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
          <ShieldCheck size={14} />
          {user?.role}
        </span>

        <Link
          to={profilePath}
          className="user-profile-badge"
          style={{ textDecoration: 'none', color: 'inherit' }}
          title="Manage Profile & Security"
        >
          <div className="avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </Link>

        <button onClick={handleLogout} className="btn btn-outline btn-sm logout-btn" title="Sign Out">
          <LogOut size={16} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
