import { Response } from 'express';
import { Favorite } from '../models/OtherModels';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { providerId } = req.body;
    if (!providerId) {
      res.status(400).json({ success: false, message: 'Provider ID is required.' });
      return;
    }

    const favorite = await Favorite.findOneAndUpdate(
      { customer: req.user._id, provider: providerId },
      { customer: req.user._id, provider: providerId },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Provider saved to favorites.', favorite });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { providerId } = req.params;
    await Favorite.findOneAndDelete({ customer: req.user._id, provider: providerId });

    res.status(200).json({ success: true, message: 'Provider removed from favorites.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const favorites = await Favorite.find({ customer: req.user._id }).populate('provider');
    res.status(200).json({ success: true, count: favorites.length, data: favorites });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
