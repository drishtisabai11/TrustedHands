import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Booking } from '../models/Booking';
import { Favorite, Address, Notification } from '../models/OtherModels';
import { Review } from '../models/Payment';
import { User } from '../models/User';
import { Customer } from '../models/Customer';

export const getDashboardSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const userId = req.user._id;

    // Upcoming active booking (CONFIRMED, PROVIDER_ACCEPTED, PROVIDER_ON_THE_WAY, SERVICE_STARTED)
    const upcomingBooking = await Booking.findOne({
      customer: userId,
      status: { $in: ['CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'PENDING'] },
    })
      .populate('provider')
      .populate('service')
      .sort({ createdAt: -1 });

    const totalBookingsCount = await Booking.countDocuments({ customer: userId });
    const upcomingCount = await Booking.countDocuments({
      customer: userId,
      status: { $in: ['CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'PENDING'] },
    });
    const completedCount = await Booking.countDocuments({ customer: userId, status: 'COMPLETED' });
    const savedCount = await Favorite.countDocuments({ customer: userId });
    const unreadNotificationsCount = await Notification.countDocuments({ user: userId, isRead: false });

    // Completed bookings eligible for review
    const completedBookings = await Booking.find({ customer: userId, status: 'COMPLETED' }).select('_id');
    const completedIds = completedBookings.map((b) => b._id);
    const existingReviews = await Review.find({ customer: userId }).select('booking');
    const reviewedBookingIds = new Set(existingReviews.map((r) => r.booking.toString()));
    const pendingReviewCount = completedIds.filter((id) => !reviewedBookingIds.has(id.toString())).length;

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
        },
        upcomingBooking,
        stats: {
          totalBookings: totalBookingsCount,
          upcomingBookings: upcomingCount,
          completedBookings: completedCount,
          savedProviders: savedCount,
          pendingReviews: pendingReviewCount,
          unreadNotifications: unreadNotificationsCount,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { status } = req.query;
    const query: any = { customer: req.user._id };

    if (status && typeof status === 'string') {
      if (status === 'UPCOMING') {
        query.status = { $in: ['PENDING', 'CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'IN_PROGRESS'] };
      } else {
        query.status = status.toUpperCase();
      }
    }

    const bookings = await Booking.find(query)
      .populate('provider')
      .populate('service')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    let booking = await Booking.findById(id).populate('provider').populate('service');
    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: id }).populate('provider').populate('service');
    }

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this booking.' });
      return;
    }

    res.status(200).json({ success: true, booking });
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

    const favorites = await Favorite.find({ customer: req.user._id }).populate({
      path: 'provider',
      populate: { path: 'user', select: 'name email phone avatar' },
    });

    res.status(200).json({ success: true, count: favorites.length, data: favorites });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { providerId } = req.body;
    if (!providerId) {
      res.status(400).json({ success: false, message: 'providerId is required.' });
      return;
    }

    const existing = await Favorite.findOne({ customer: req.user._id, provider: providerId });
    if (existing) {
      res.status(200).json({ success: true, message: 'Provider already saved in favorites.', favorite: existing });
      return;
    }

    const favorite = await Favorite.create({ customer: req.user._id, provider: providerId });
    res.status(201).json({ success: true, message: 'Provider saved to favorites.', favorite });
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
    await Favorite.deleteOne({ customer: req.user._id, provider: providerId });
    res.status(200).json({ success: true, message: 'Provider removed from favorites.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAddresses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { title, street, apartment, city, state, postalCode, country, isDefault } = req.body;
    if (!title || !street || !city || !state || !postalCode) {
      res.status(400).json({ success: false, message: 'Title, street, city, state, and postal code are required.' });
      return;
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const count = await Address.countDocuments({ user: req.user._id });
    const address = await Address.create({
      user: req.user._id,
      title,
      street,
      apartment,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: isDefault || count === 0,
    });

    res.status(201).json({ success: true, message: 'Address created successfully.', address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      res.status(404).json({ success: false, message: 'Address not found.' });
      return;
    }

    if (address.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this address.' });
      return;
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, req.body);
    await address.save();

    res.status(200).json({ success: true, message: 'Address updated successfully.', address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      res.status(404).json({ success: false, message: 'Address not found.' });
      return;
    }

    if (address.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this address.' });
      return;
    }

    await Address.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: 'Address deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setDefaultAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address || address.user.toString() !== req.user._id.toString()) {
      res.status(404).json({ success: false, message: 'Address not found.' });
      return;
    }

    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    res.status(200).json({ success: true, message: 'Default address set.', address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const reviews = await Review.find({ customer: req.user._id }).populate('provider').populate('booking');

    // Eligible bookings for review
    const completedBookings = await Booking.find({ customer: req.user._id, status: 'COMPLETED' })
      .populate('provider')
      .populate('service');

    const reviewedBookingIds = new Set(reviews.map((r) => r.booking._id.toString()));
    const eligibleBookings = completedBookings.filter((b) => !reviewedBookingIds.has(b._id.toString()));

    res.status(200).json({
      success: true,
      data: {
        submittedReviews: reviews,
        eligibleBookings,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { bookingId, rating, comment, workCategory } = req.body;
    if (!bookingId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'bookingId, rating, and comment are required.' });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.customer.toString() !== req.user._id.toString()) {
      res.status(404).json({ success: false, message: 'Booking not found or access denied.' });
      return;
    }

    if (booking.status !== 'COMPLETED') {
      res.status(400).json({ success: false, message: 'Can only submit reviews for completed bookings.' });
      return;
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      res.status(400).json({ success: false, message: 'A review has already been submitted for this booking.' });
      return;
    }

    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      provider: booking.provider,
      rating,
      comment,
      workCategory: workCategory || 'General Service',
      isVerifiedPurchase: true,
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully.', review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    await Notification.updateOne({ _id: id, user: req.user._id }, { isRead: true });
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const customerDoc = await Customer.findOne({ user: req.user._id });
    res.status(200).json({
      success: true,
      user: req.user,
      customerDetails: customerDoc,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { name, phone, avatar, preferredPaymentMethod } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    await user.save();

    if (preferredPaymentMethod) {
      await Customer.findOneAndUpdate(
        { user: req.user._id },
        { preferredPaymentMethod },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Settings updated successfully.', settings: req.body });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
