import { Router } from 'express';
import { getProviders, getProviderById } from '../controllers/providerController';

const router = Router();

router.get('/', getProviders);
router.get('/:id', getProviderById);

export default router;
