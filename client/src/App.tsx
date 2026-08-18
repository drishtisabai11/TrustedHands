import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { CategoryPage } from './pages/public/CategoryPage';
import { ProvidersPage } from './pages/public/ProvidersPage';
import { ProviderProfilePage as PublicProviderProfilePage } from './pages/public/ProviderProfilePage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { DesignSystemShowcase } from './pages/DesignSystemShowcase';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { CustomerRegisterPage } from './pages/auth/CustomerRegisterPage';
import { ProviderRegisterPage } from './pages/auth/ProviderRegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Public Booking Pages
import { BookingPage } from './pages/booking/BookingPage';
import { BookingConfirmationPage } from './pages/booking/BookingConfirmationPage';
import { BookingDetailPage as PublicBookingDetailPage } from './pages/booking/BookingDetailPage';

// Customer Dashboard Pages
import CustomerOverviewPage from './pages/customer/CustomerOverviewPage';
import CustomerBookingsPage from './pages/customer/CustomerBookingsPage';
import CustomerBookingDetailPage from './pages/customer/CustomerBookingDetailPage';
import CustomerSavedPage from './pages/customer/CustomerSavedPage';
import CustomerAddressesPage from './pages/customer/CustomerAddressesPage';
import CustomerReviewsPage from './pages/customer/CustomerReviewsPage';
import CustomerNotificationsPage from './pages/customer/CustomerNotificationsPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import CustomerSettingsPage from './pages/customer/CustomerSettingsPage';

// Service Provider Dashboard Pages
import ProviderOverviewPage from './pages/provider/ProviderOverviewPage';
import ProviderBookingsPage from './pages/provider/ProviderBookingsPage';
import ProviderCalendarPage from './pages/provider/ProviderCalendarPage';
import ProviderAvailabilityPage from './pages/provider/ProviderAvailabilityPage';
import ProviderServicesPage from './pages/provider/ProviderServicesPage';
import ProviderEarningsPage from './pages/provider/ProviderEarningsPage';
import ProviderReviewsPage from './pages/provider/ProviderReviewsPage';
import ProviderProfilePage from './pages/provider/ProviderProfilePage';
import ProviderNotificationsPage from './pages/provider/ProviderNotificationsPage';
import ProviderSettingsPage from './pages/provider/ProviderSettingsPage';

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
            <Route path="/providers/:providerId" element={<PublicProviderProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Authentication & Registration Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/signup" element={<CustomerRegisterPage />} />
            <Route path="/signup/customer" element={<CustomerRegisterPage />} />
            <Route path="/signup/provider" element={<ProviderRegisterPage />} />
            <Route path="/auth/register" element={<CustomerRegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* Public Booking Journey Routes */}
            <Route path="/book/:providerId/:serviceId" element={<BookingPage />} />
            <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmationPage />} />
            <Route path="/booking/:bookingId" element={<PublicBookingDetailPage />} />

            {/* ROUTE ALIAS: /customer/dashboard redirects/mounts cleanly to /dashboard */}
            <Route path="/customer/dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/customer/dashboard/*" element={<Navigate to="/dashboard" replace />} />

            {/* PROTECTED CUSTOMER DASHBOARD ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerOverviewPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bookings"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerBookingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bookings/:bookingId"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerBookingDetailPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/saved"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerSavedPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/addresses"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerAddressesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/reviews"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerReviewsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notifications"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerNotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <DashboardLayout role="CUSTOMER">
                    <CustomerSettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* PROTECTED PROVIDER DASHBOARD ROUTES */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderOverviewPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/bookings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderBookingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/calendar"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderCalendarPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/availability"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderAvailabilityPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/services"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderServicesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/earnings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderEarningsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/reviews"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderReviewsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/profile"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/notifications"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderNotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/settings"
              element={
                <ProtectedRoute allowedRoles={['PROVIDER']}>
                  <DashboardLayout role="PROVIDER">
                    <ProviderSettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Showcase & Catch-all */}
            <Route path="/design-system" element={<DesignSystemShowcase />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
