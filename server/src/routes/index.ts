import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import providerRoutes from './providerRoutes';
import categoryRoutes from './categoryRoutes';
import serviceRoutes from './serviceRoutes';
import bookingRoutes from './bookingRoutes';
import paymentRoutes from './paymentRoutes';
import reviewRoutes from './reviewRoutes';
import favoriteRoutes from './favoriteRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';
import customerRoutes from './customerRoutes';
import providerDashboardRoutes from './providerDashboardRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Trusted Hands REST API Engine',
    timestamp: new Date().toISOString(),
  });
});

// Mounted v1 API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/providers', providerRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/provider', providerDashboardRoutes);

export default router;
