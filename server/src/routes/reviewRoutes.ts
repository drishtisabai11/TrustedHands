import { Router } from 'express';
import { createReview, getProviderReviews } from '../controllers/reviewController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/provider/:providerId', getProviderReviews);
router.post('/', authenticateJWT, createReview);

export default router;
