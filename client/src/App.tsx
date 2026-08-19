import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { CategoryPage } from './pages/public/CategoryPage';
import { ProvidersPage } from './pages/public/ProvidersPage';
import { ProviderProfilePage } from './pages/public/ProviderProfilePage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { DesignSystemShowcase } from './pages/DesignSystemShowcase';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerRegisterPage } from './pages/auth/CustomerRegisterPage';
import { ProviderRegisterPage } from './pages/auth/ProviderRegisterPage';
import { SignupSelectionPage } from './pages/auth/SignupSelectionPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Customer Dashboard Pages
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CustomerOverviewPage } from './pages/customer/CustomerOverviewPage';
import { CustomerBookingsPage } from './pages/customer/CustomerBookingsPage';
import { CustomerBookingDetailPage } from './pages/customer/CustomerBookingDetailPage';
import { CustomerSavedPage } from './pages/customer/CustomerSavedPage';
import { CustomerAddressesPage } from './pages/customer/CustomerAddressesPage';
import { CustomerReviewsPage } from './pages/customer/CustomerReviewsPage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';

// Provider Dashboard Pages
import { ProviderOverviewPage } from './pages/provider/ProviderOverviewPage';
import { ProviderBookingsPage } from './pages/provider/ProviderBookingsPage';
import { ProviderCalendarPage } from './pages/provider/ProviderCalendarPage';
import { ProviderAvailabilityPage } from './pages/provider/ProviderAvailabilityPage';
import { ProviderServicesPage } from './pages/provider/ProviderServicesPage';
import { ProviderEarningsPage } from './pages/provider/ProviderEarningsPage';
import { ProviderReviewsPage } from './pages/provider/ProviderReviewsPage';
import { ProviderNotificationsPage } from './pages/provider/ProviderNotificationsPage';
import { ProviderProfilePage as ProviderDashboardProfilePage } from './pages/provider/ProviderProfilePage';
import { ProviderSettingsPage } from './pages/provider/ProviderSettingsPage';

// Booking Pages
import { BookingPage } from './pages/booking/BookingPage';
import { BookingConfirmationPage } from './pages/booking/BookingConfirmationPage';
import { BookingDetailPage } from './pages/booking/BookingDetailPage';

// Admin Architecture
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCustomerDetailPage } from './pages/admin/AdminCustomerDetailPage';
import { AdminProvidersPage } from './pages/admin/AdminProvidersPage';
import { AdminProviderPendingPage } from './pages/admin/AdminProviderPendingPage';
import { AdminProviderDetailPage } from './pages/admin/AdminProviderDetailPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from './pages/admin/AdminBookingDetailPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { HomepageCMSPage } from './pages/admin/cms/HomepageCMSPage';
import { FaqCMSPage } from './pages/admin/cms/FaqCMSPage';
import { AboutCMSPage } from './pages/admin/cms/AboutCMSPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Marketplace Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:categorySlug" element={<CategoryPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/providers/:providerId" element={<ProviderProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Authentication & Signup Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signup" element={<SignupSelectionPage />} />
            <Route path="/signup/customer" element={<CustomerRegisterPage />} />
            <Route path="/signup/provider" element={<ProviderRegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* Customer Workspace Routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <DashboardLayout role="CUSTOMER">
                    <Routes>
                      <Route path="" element={<CustomerOverviewPage />} />
                      <Route path="overview" element={<CustomerOverviewPage />} />
                      <Route path="bookings" element={<CustomerBookingsPage />} />
                      <Route path="bookings/:id" element={<CustomerBookingDetailPage />} />
                      <Route path="saved" element={<CustomerSavedPage />} />
                      <Route path="addresses" element={<CustomerAddressesPage />} />
                      <Route path="reviews" element={<CustomerReviewsPage />} />
                      <Route path="notifications" element={<CustomerNotificationsPage />} />
                      <Route path="profile" element={<CustomerProfilePage />} />
                      <Route path="settings" element={<CustomerSettingsPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/customer/*" element={<Navigate to="/dashboard" replace />} />

            {/* Service Provider Workspace Routes */}
            <Route
              path="/provider/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <Routes>
                      <Route path="" element={<ProviderOverviewPage />} />
                      <Route path="overview" element={<ProviderOverviewPage />} />
                      <Route path="bookings" element={<ProviderBookingsPage />} />
                      <Route path="calendar" element={<ProviderCalendarPage />} />
                      <Route path="availability" element={<ProviderAvailabilityPage />} />
                      <Route path="services" element={<ProviderServicesPage />} />
                      <Route path="earnings" element={<ProviderEarningsPage />} />
                      <Route path="reviews" element={<ProviderReviewsPage />} />
                      <Route path="notifications" element={<ProviderNotificationsPage />} />
                      <Route path="profile" element={<ProviderDashboardProfilePage />} />
                      <Route path="settings" element={<ProviderSettingsPage />} />
                      <Route path="*" element={<Navigate to="/provider/dashboard" replace />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/bookings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderBookingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/calendar"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderCalendarPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/availability"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderAvailabilityPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/services"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderServicesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/earnings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderEarningsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/reviews"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderReviewsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/notifications"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderNotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/profile"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderDashboardProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/settings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderSettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Customer Booking Journey Routes */}
            <Route path="/book/:providerId/:serviceId" element={<BookingPage />} />
            <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmationPage />} />
            <Route path="/booking/:bookingId" element={<BookingDetailPage />} />

            {/* Admin Operational Control Center Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="" element={<AdminOverviewPage />} />
                      <Route path="overview" element={<AdminOverviewPage />} />
                      <Route path="analytics" element={<AdminAnalyticsPage />} />
                      <Route path="customers" element={<AdminCustomersPage />} />
                      <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
                      <Route path="providers" element={<AdminProvidersPage />} />
                      <Route path="providers/pending" element={<AdminProviderPendingPage />} />
                      <Route path="providers/:id" element={<AdminProviderDetailPage />} />
                      <Route path="services" element={<AdminServicesPage />} />
                      <Route path="services/categories" element={<AdminCategoriesPage />} />
                      <Route path="bookings" element={<AdminBookingsPage />} />
                      <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
                      <Route path="payments" element={<AdminPaymentsPage />} />
                      <Route path="reviews" element={<AdminReviewsPage />} />
                      <Route path="notifications" element={<AdminNotificationsPage />} />
                      <Route path="content" element={<HomepageCMSPage />} />
                      <Route path="content/homepage" element={<HomepageCMSPage />} />
                      <Route path="content/faq" element={<FaqCMSPage />} />
                      <Route path="content/about" element={<AboutCMSPage />} />
                      <Route path="reports" element={<AdminReportsPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                      <Route path="audit-logs" element={<AdminAuditLogsPage />} />
                      <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            {/* Design System Showcase & Catch-all */}
            <Route path="/design-system" element={<DesignSystemShowcase />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
