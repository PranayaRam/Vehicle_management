import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyVehicles from './pages/customer/MyVehicles';
import BookService from './pages/customer/BookService';
import MyBookings from './pages/customer/MyBookings';
import CustomerEstimates from './pages/customer/CustomerEstimates';
import CustomerInvoices from './pages/customer/CustomerInvoices';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import BookingsCheckIn from './pages/staff/BookingsCheckIn';
import ActiveJobs from './pages/staff/ActiveJobs';
import JobDetails from './pages/staff/JobDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PartsInventory from './pages/admin/PartsInventory';
import LabourCatalog from './pages/admin/LabourCatalog';
import ServiceTypesManager from './pages/admin/ServiceTypesManager';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Customer Protected Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <DashboardLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="vehicles" element={<MyVehicles />} />
        <Route path="book" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="estimates" element={<CustomerEstimates />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="profile" element={<CustomerDashboard />} />
      </Route>

      {/* Staff Protected Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['STAFF', 'ADMIN']}>
              <DashboardLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="bookings" element={<BookingsCheckIn />} />
        <Route path="jobs" element={<ActiveJobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="inspections" element={<ActiveJobs />} />
        <Route path="estimates" element={<ActiveJobs />} />
        <Route path="billing" element={<ActiveJobs />} />
        <Route path="delivery" element={<ActiveJobs />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<BookingsCheckIn />} />
        <Route path="jobs" element={<ActiveJobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="service-types" element={<ServiceTypesManager />} />
        <Route path="parts" element={<PartsInventory />} />
        <Route path="labour" element={<LabourCatalog />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
