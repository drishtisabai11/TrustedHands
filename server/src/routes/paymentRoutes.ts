import { Router } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateJWT);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

export default router;
