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
import NotFound from './pages/public/NotFound';

// Common Pages
import UserProfile from './pages/common/UserProfile';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyVehicles from './pages/customer/MyVehicles';
import BookService from './pages/customer/BookService';
import MyBookings from './pages/customer/MyBookings';
import ServiceTracking from './pages/customer/ServiceTracking';
import CustomerEstimates from './pages/customer/CustomerEstimates';
import CustomerInvoices from './pages/customer/CustomerInvoices';
import CustomerPayments from './pages/customer/CustomerPayments';
import ServiceHistory from './pages/customer/ServiceHistory';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import BookingsCheckIn from './pages/staff/BookingsCheckIn';
import ActiveJobs from './pages/staff/ActiveJobs';
import JobDetails from './pages/staff/JobDetails';
import StaffInspections from './pages/staff/StaffInspections';
import StaffEstimates from './pages/staff/StaffEstimates';
import StaffInvoices from './pages/staff/StaffInvoices';
import StaffPayments from './pages/staff/StaffPayments';
import StaffDeliveries from './pages/staff/StaffDeliveries';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PartsInventory from './pages/admin/PartsInventory';
import LabourCatalog from './pages/admin/LabourCatalog';
import ServiceTypesManager from './pages/admin/ServiceTypesManager';
import UserManagement from './pages/admin/UserManagement';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

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
        <Route path="/404" element={<NotFound />} />
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
        <Route path="vehicles/add" element={<MyVehicles />} />
        <Route path="book" element={<BookService />} />
        <Route path="book-service" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:id" element={<MyBookings />} />
        <Route path="service-tracking" element={<ServiceTracking />} />
        <Route path="tracking" element={<ServiceTracking />} />
        <Route path="estimates" element={<CustomerEstimates />} />
        <Route path="estimates/:id" element={<CustomerEstimates />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="invoices/:id" element={<CustomerInvoices />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="service-history" element={<ServiceHistory />} />
        <Route path="history" element={<ServiceHistory />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="change-password" element={<UserProfile />} />
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
        <Route path="bookings/:id" element={<BookingsCheckIn />} />
        <Route path="check-in" element={<BookingsCheckIn />} />
        <Route path="jobs" element={<ActiveJobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="service-jobs" element={<ActiveJobs />} />
        <Route path="service-jobs/:id" element={<JobDetails />} />
        <Route path="inspections" element={<StaffInspections />} />
        <Route path="inspections/:id" element={<StaffInspections />} />
        <Route path="estimates" element={<StaffEstimates />} />
        <Route path="estimates/:id" element={<StaffEstimates />} />
        <Route path="parts" element={<PartsInventory />} />
        <Route path="labour" element={<LabourCatalog />} />
        <Route path="progress" element={<ActiveJobs />} />
        <Route path="service-progress" element={<ActiveJobs />} />
        <Route path="invoices" element={<StaffInvoices />} />
        <Route path="billing" element={<StaffInvoices />} />
        <Route path="payments" element={<StaffPayments />} />
        <Route path="delivery" element={<StaffDeliveries />} />
        <Route path="deliveries" element={<StaffDeliveries />} />
        <Route path="customers" element={<UserManagement initialRole="CUSTOMER" staffView={true} />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="change-password" element={<UserProfile />} />
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
        <Route path="bookings/:id" element={<BookingsCheckIn />} />
        <Route path="jobs" element={<ActiveJobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="service-jobs" element={<ActiveJobs />} />
        <Route path="service-jobs/:id" element={<JobDetails />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="inspections" element={<StaffInspections />} />
        <Route path="inspections/:id" element={<StaffInspections />} />
        <Route path="estimates" element={<StaffEstimates />} />
        <Route path="estimates/:id" element={<StaffEstimates />} />
        <Route path="invoices" element={<StaffInvoices />} />
        <Route path="billing" element={<StaffInvoices />} />
        <Route path="payments" element={<StaffPayments />} />
        <Route path="deliveries" element={<StaffDeliveries />} />
        <Route path="delivery" element={<StaffDeliveries />} />
        <Route path="service-types" element={<ServiceTypesManager />} />
        <Route path="parts" element={<PartsInventory />} />
        <Route path="labour" element={<LabourCatalog />} />
        <Route path="users" element={<UserManagement initialRole="ALL" />} />
        <Route path="customers" element={<UserManagement initialRole="CUSTOMER" />} />
        <Route path="staff" element={<UserManagement initialRole="STAFF" />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="change-password" element={<UserProfile />} />
      </Route>

      {/* Catch-all route to NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
