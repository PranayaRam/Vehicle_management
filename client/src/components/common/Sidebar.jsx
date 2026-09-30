import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Wrench,
  LayoutDashboard,
  Car,
  CalendarPlus,
  ClipboardList,
  FileCheck2,
  Receipt,
  CreditCard,
  UserCheck,
  Package,
  Layers,
  BarChart3,
  Users,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Truck,
  History,
  Settings,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
          { to: '/admin/bookings', label: 'All Bookings', icon: ClipboardList },
          { to: '/admin/jobs', label: 'All Service Jobs', icon: Wrench },
          { to: '/admin/vehicles', label: 'Fleet Vehicles', icon: Car },
          { to: '/admin/inspections', label: 'Inspections Hub', icon: ShieldAlert },
          { to: '/admin/estimates', label: 'Estimates Overview', icon: FileCheck2 },
          { to: '/admin/invoices', label: 'Invoices & Billing', icon: Receipt },
          { to: '/admin/payments', label: 'Payments Ledger', icon: CreditCard },
          { to: '/admin/deliveries', label: 'Deliveries Handover', icon: Truck },
          { to: '/admin/users', label: 'All Accounts Roster', icon: Users },
          { to: '/admin/customers', label: 'Customer Directory', icon: UserCheck },
          { to: '/admin/service-types', label: 'Service Types', icon: Layers },
          { to: '/admin/parts', label: 'Parts Inventory', icon: Package },
          { to: '/admin/labour', label: 'Labour Catalog', icon: Clock },
          { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
          { to: '/admin/settings', label: 'Garage Settings', icon: Settings },
          { to: '/admin/profile', label: 'My Profile', icon: User }
        ];
      case 'STAFF':
        return [
          { to: '/staff/dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
          { to: '/staff/bookings', label: 'Bookings & Check-In', icon: ClipboardList },
          { to: '/staff/jobs', label: 'Active Service Jobs', icon: Wrench },
          { to: '/staff/inspections', label: 'Vehicle Inspections', icon: ShieldAlert },
          { to: '/staff/estimates', label: 'Estimates & Approval', icon: FileCheck2 },
          { to: '/staff/parts', label: 'Parts Inventory', icon: Package },
          { to: '/staff/labour', label: 'Labour Catalog', icon: Clock },
          { to: '/staff/invoices', label: 'Billing & Invoices', icon: Receipt },
          { to: '/staff/payments', label: 'Payments Ledger', icon: CreditCard },
          { to: '/staff/delivery', label: 'Vehicle Delivery', icon: Truck },
          { to: '/staff/customers', label: 'Customer Directory', icon: Users },
          { to: '/staff/profile', label: 'My Profile', icon: User }
        ];
      case 'CUSTOMER':
      default:
        return [
          { to: '/customer/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/customer/vehicles', label: 'My Vehicles', icon: Car },
          { to: '/customer/book', label: 'Book a Service', icon: CalendarPlus },
          { to: '/customer/bookings', label: 'Service Bookings', icon: ClipboardList },
          { to: '/customer/service-tracking', label: 'Live Service Tracking', icon: Wrench },
          { to: '/customer/estimates', label: 'Estimates & Approval', icon: FileCheck2 },
          { to: '/customer/invoices', label: 'Invoices & Billing', icon: Receipt },
          { to: '/customer/payments', label: 'Payment Center', icon: CreditCard },
          { to: '/customer/service-history', label: 'Vehicle History', icon: History },
          { to: '/customer/profile', label: 'My Profile', icon: User }
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Wrench size={20} className="text-white" />
          </div>
          <div className="brand-text-wrap">
            <h2 className="brand-title">APEX MOTORS</h2>
            <span className="role-tag">{user?.role} PORTAL</span>
          </div>

          {/* Close button visible only on mobile/tablet drawer */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="link-icon" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
