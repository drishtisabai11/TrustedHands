import { Router, Request, Response } from 'express';

const router = Router();

const SEEDED_SERVICES = [
  {
    id: 'srv-1',
    title: 'Complete Home Electrical Safety Audit',
    slug: 'electrical-safety-audit',
    description: 'Thorough inspection of circuit breakers, earthing, wall sockets, and high-load appliances.',
    basePrice: 1200,
    priceType: 'FIXED',
    estimatedDurationMinutes: 120,
    includedTasks: ['Visual panel check', 'Earthing voltage test', 'Socket load test', 'Safety certificate'],
  },
  {
    id: 'srv-2',
    title: 'Custom Fitted Cabinetry Restoration',
    slug: 'custom-cabinetry',
    description: 'Repairing or crafting bespoke wooden cabinets, soft-close hinges, and surface refinishing.',
    basePrice: 850,
    priceType: 'HOURLY',
    estimatedDurationMinutes: 180,
    includedTasks: ['Wood surface prep', 'Hinge realignment', 'Polishing/staining', 'Hardware fitting'],
  },
];

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, count: SEEDED_SERVICES.length, data: SEEDED_SERVICES });
});

export default router;
