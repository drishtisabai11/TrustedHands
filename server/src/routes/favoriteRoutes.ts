import { Router } from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateJWT);

router.post('/', addFavorite);
router.delete('/:providerId', removeFavorite);
router.get('/', getFavorites);

export default router;
