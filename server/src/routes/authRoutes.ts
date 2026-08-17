import { Router } from 'express';
import { registerCustomer, registerProvider, login, getCurrentUser } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/register/customer', registerCustomer);
router.post('/register/provider', registerProvider);
router.post('/login', login);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;
