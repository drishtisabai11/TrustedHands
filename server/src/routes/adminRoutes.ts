import { Router, Response } from 'express';
import { authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateJWT, requireRole('ADMIN'));

router.get('/pending-verifications', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Admin access authorized.',
    data: [],
  });
});

export default router;
