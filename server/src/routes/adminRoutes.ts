import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import {
  getOverviewData,
  getAnalytics,
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getProviders,
  getPendingProviders,
  getProviderById,
  updateProviderVerification,
  getServices,
  createService,
  updateService,
  getCategories,
  createCategory,
  updateCategory,
  getBookings,
  getBookingById,
  updateBookingAdmin,
  getPayments,
  initiateRefund,
  getReviews,
  moderateReview,
  getCMSContent,
  updateCMSContent,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getSettings,
  updateSettings,
  getAuditLogs,
  globalSearch,
  exportData,
} from '../controllers/adminController';

const router = Router();

// Protect all admin routes server-side
router.use(authenticateJWT, requireRole('ADMIN'));

// Overview & Analytics
router.get('/overview', getOverviewData);
router.get('/analytics', getAnalytics);

// Global Search & Export
router.get('/search', globalSearch);
router.get('/export/:type', exportData);

// Customers
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.patch('/customers/:id/status', updateCustomerStatus);

// Providers
router.get('/providers', getProviders);
router.get('/providers/pending', getPendingProviders);
router.get('/providers/:id', getProviderById);
router.patch('/providers/:id/verification', updateProviderVerification);
router.patch('/providers/:id/status', updateProviderVerification);

// Services & Categories
router.get('/services', getServices);
router.post('/services', createService);
router.patch('/services/:id', updateService);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);

// Bookings
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);
router.patch('/bookings/:id', updateBookingAdmin);

// Payments & Refunds
router.get('/payments', getPayments);
router.post('/payments/refund', initiateRefund);

// Reviews Moderation
router.get('/reviews', getReviews);
router.patch('/reviews/:id/moderation', moderateReview);

// CMS & Content
router.get('/cms', getCMSContent);
router.patch('/cms', updateCMSContent);
router.get('/faqs', getFAQs);
router.post('/faqs', createFAQ);
router.patch('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

// Platform Settings & Audit Logs
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);
router.get('/audit-logs', getAuditLogs);

export default router;
