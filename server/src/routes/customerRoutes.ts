import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import {
  getDashboardSummary,
  getBookings,
  getBookingById,
  getFavorites,
  addFavorite,
  removeFavorite,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getReviews,
  createReview,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getProfile,
  updateProfile,
  updateSettings,
} from '../controllers/customerController';

const router = Router();

// All customer routes require authenticated user with CUSTOMER role
router.use(authenticateJWT, requireRole('CUSTOMER'));

router.get('/dashboard', getDashboardSummary);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:providerId', removeFavorite);
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);
router.get('/reviews', getReviews);
router.post('/reviews', createReview);
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/settings', updateSettings);

export default router;
