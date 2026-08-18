import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import {
  getDashboardSummary,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getCalendar,
  updateAvailability,
  getServices,
  createService,
  updateService,
  deleteService,
  getProfile,
  updateProfile,
  addPortfolioItem,
  deletePortfolioItem,
  getEarnings,
  getReviews,
  respondToReview,
  getNotifications,
  updateSettings,
} from '../controllers/providerDashboardController';

const router = Router();

// All provider dashboard routes require authenticated user with PROVIDER role
router.use(authenticateJWT, requireRole('PROVIDER'));

router.get('/dashboard', getDashboardSummary);
router.get('/bookings', getBookings);
router.get('/bookings/:id', getBookingById);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/calendar', getCalendar);
router.put('/availability', updateAvailability);
router.get('/services', getServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/portfolio', addPortfolioItem);
router.delete('/portfolio/:id', deletePortfolioItem);
router.get('/earnings', getEarnings);
router.get('/reviews', getReviews);
router.post('/reviews/:id/respond', respondToReview);
router.get('/notifications', getNotifications);
router.put('/settings', updateSettings);

export default router;
