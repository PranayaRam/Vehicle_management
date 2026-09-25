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
  UserCheck,
  Package,
  Layers,
  BarChart3,
  Users,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
          { to: '/admin/bookings', label: 'All Bookings', icon: ClipboardList },
          { to: '/admin/jobs', label: 'All Service Jobs', icon: Wrench },
          { to: '/admin/customers', label: 'Customers', icon: Users },
          { to: '/admin/staff', label: 'Staff Roster', icon: UserCheck },
          { to: '/admin/vehicles', label: 'Vehicle Registry', icon: Car },
          { to: '/admin/service-types', label: 'Service Types', icon: Layers },
          { to: '/admin/parts', label: 'Parts Inventory', icon: Package },
          { to: '/admin/labour', label: 'Labour Catalog', icon: Clock },
          { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 }
        ];
      case 'STAFF':
        return [
          { to: '/staff/dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
          { to: '/staff/bookings', label: 'Bookings & Check-In', icon: ClipboardList },
          { to: '/staff/jobs', label: 'Active Service Jobs', icon: Wrench },
          { to: '/staff/inspections', label: 'Vehicle Inspection', icon: ShieldAlert },
          { to: '/staff/estimates', label: 'Estimates & Approval', icon: FileCheck2 },
          { to: '/staff/billing', label: 'Billing & Payments', icon: Receipt },
          { to: '/staff/delivery', label: 'Vehicle Delivery', icon: Truck }
        ];
      case 'CUSTOMER':
      default:
        return [
          { to: '/customer/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/customer/vehicles', label: 'My Vehicles', icon: Car },
          { to: '/customer/book', label: 'Book a Service', icon: CalendarPlus },
          { to: '/customer/bookings', label: 'Service Bookings', icon: ClipboardList },
          { to: '/customer/estimates', label: 'Estimates & Approval', icon: FileCheck2 },
          { to: '/customer/invoices', label: 'Invoices & History', icon: Receipt },
          { to: '/customer/profile', label: 'My Profile', icon: UserCheck }
        ];
    }
  };

  const links = getLinks();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Wrench size={20} className="text-white" />
        </div>
        <div>
          <h2 className="brand-title">APEX MOTORS</h2>
          <span className="role-tag">{user?.role} PORTAL</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="link-icon" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
