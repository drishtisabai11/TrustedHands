import { Response } from 'express';
import { Review } from '../models/Payment';
import { Booking } from '../models/Booking';
import { Provider } from '../models/Provider';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Booking ID, rating (1-5), and comment are required.' });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Security Check 1: User must be the customer associated with the booking
    if (booking.customer.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Only the customer who booked this service can submit a review.' });
      return;
    }

    // Security Check 2: Booking must be in COMPLETED status
    if (booking.status !== 'COMPLETED' && booking.status !== 'CONFIRMED') {
      res.status(400).json({ 
        success: false, 
        message: 'Reviews can only be submitted after the service has been completed.' 
      });
      return;
    }

    // Security Check 3: Prevent duplicate review submission
    const existingReview = await Review.findOne({ booking: booking._id });
    if (existingReview) {
      res.status(409).json({ success: false, message: 'A review has already been submitted for this booking.' });
      return;
    }

    const newReview = await Review.create({
      booking: booking._id,
      customer: req.user._id,
      provider: booking.provider,
      rating: Number(rating),
      comment,
      workCategory: 'Verified Local Service',
      isVerifiedPurchase: true,
    });

    // Update Provider rating average & review count
    const providerDoc = await Provider.findById(booking.provider);
    if (providerDoc) {
      const totalReviews = providerDoc.reviewCount + 1;
      const newRating = Number(((providerDoc.rating * providerDoc.reviewCount + Number(rating)) / totalReviews).toFixed(1));
      providerDoc.reviewCount = totalReviews;
      providerDoc.rating = newRating;
      await providerDoc.save();
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      review: newReview,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderReviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ provider: providerId }).populate('customer', 'name avatar').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
