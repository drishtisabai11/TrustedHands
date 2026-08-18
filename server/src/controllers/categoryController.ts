import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { OFFICIAL_CATEGORIES } from '../constants/categories';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true });
    if (categories.length === 0) {
      res.status(200).json({ success: true, count: OFFICIAL_CATEGORIES.length, data: OFFICIAL_CATEGORIES });
      return;
    }
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error: any) {
    res.status(200).json({ success: true, count: OFFICIAL_CATEGORIES.length, data: OFFICIAL_CATEGORIES });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    const fallback = OFFICIAL_CATEGORIES.find((c) => c.slug === slug);
    res.status(200).json({ success: true, data: category || fallback || OFFICIAL_CATEGORIES[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
