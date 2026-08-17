import { Router } from 'express';
import { createBooking, getUserBookings, getBookingById, cancelBooking } from '../controllers/bookingController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateJWT);

router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBookingById);
router.post('/:id/cancel', cancelBooking);

export default router;
