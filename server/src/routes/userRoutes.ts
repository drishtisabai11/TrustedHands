import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateJWT);

router.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, user: req.user });
});

router.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ success: true, message: 'Profile updated successfully.' });
});

export default router;
