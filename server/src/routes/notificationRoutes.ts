import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateJWT);

router.get('/', (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: 'notif-1',
        title: 'Welcome to Trusted Hands',
        message: 'Your account is active. Explore vetted local service professionals.',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

export default router;
