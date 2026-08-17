import { Request, Response } from 'express';
import { Category, Service } from '../models/Category';

// Seeded local development category list matching design guidelines
const SEEDED_CATEGORIES = [
  {
    id: 'cat-electrical',
    name: 'Electrical & Power Repairs',
    slug: 'electrical',
    description: 'Licensed electricians for residential wiring, panel upgrades, lighting, and emergency power fixes.',
    iconName: 'Zap',
    popularServicesCount: 14,
    isActive: true,
  },
  {
    id: 'cat-carpentry',
    name: 'Custom Carpentry & Woodwork',
    slug: 'carpentry',
    description: 'Master carpenters for fitted cabinetry, bespoke hardwood furniture, door repairs, and trim.',
    iconName: 'Hammer',
    popularServicesCount: 18,
    isActive: true,
  },
  {
    id: 'cat-cleaning',
    name: 'Deep Home & Studio Cleaning',
    slug: 'cleaning',
    description: 'Vetted cleaning teams using non-toxic products for deep sanitation, move-ins, and post-renovation.',
    iconName: 'Sparkles',
    popularServicesCount: 22,
    isActive: true,
  },
  {
    id: 'cat-painting',
    name: 'Interior & Exterior Painting',
    slug: 'painting',
    description: 'Professional painters offering surface preparation, waterproof coatings, and texture finishes.',
    iconName: 'Paintbrush',
    popularServicesCount: 12,
    isActive: true,
  },
  {
    id: 'cat-plumbing',
    name: 'Emergency & General Plumbing',
    slug: 'plumbing',
    description: 'Certified plumbers for pipe leaks, fixture installations, drain clearing, and water heater repairs.',
    iconName: 'Droplets',
    popularServicesCount: 16,
    isActive: true,
  },
];

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true });
    if (categories.length === 0) {
      res.status(200).json({ success: true, count: SEEDED_CATEGORIES.length, data: SEEDED_CATEGORIES });
      return;
    }
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    res.status(200).json({ success: true, count: SEEDED_CATEGORIES.length, data: SEEDED_CATEGORIES });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    const fallback = SEEDED_CATEGORIES.find((c) => c.slug === slug);
    res.status(200).json({ success: true, data: category || fallback || SEEDED_CATEGORIES[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
