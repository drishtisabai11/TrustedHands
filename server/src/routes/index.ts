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

import { getHealthStatus } from '../controllers/healthController';

const router = Router();

// Health check endpoint
router.get('/health', getHealthStatus);

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

export default router;
