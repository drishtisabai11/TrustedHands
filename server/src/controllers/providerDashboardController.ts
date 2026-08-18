import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Provider } from '../models/Provider';
import { Booking } from '../models/Booking';
import { Service } from '../models/Category';
import { Review } from '../models/Payment';
import { Notification, Transaction } from '../models/OtherModels';
import { notificationService } from '../services/notificationService';

// Helper to find provider profile for authenticated user
const findProviderForUser = async (userId: string) => {
  return await Provider.findOne({ user: userId });
};

export const getDashboardSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const providerId = provider._id;

    // Today's date YYYY-MM-DD format
    const todayStr = new Date().toISOString().split('T')[0];

    // Today's bookings schedule
    const todayBookings = await Booking.find({
      provider: providerId,
      scheduledDate: todayStr,
      status: { $ne: 'CANCELLED' },
    })
      .populate('customer', 'name email phone avatar')
      .populate('service')
      .sort({ scheduledTimeSlot: 1 });

    // Pending acceptance count
    const pendingAcceptanceCount = await Booking.countDocuments({
      provider: providerId,
      status: 'CONFIRMED',
    });

    // Upcoming total
    const upcomingCount = await Booking.countDocuments({
      provider: providerId,
      status: { $in: ['CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED'] },
    });

    // Completed total
    const completedCount = await Booking.countDocuments({
      provider: providerId,
      status: 'COMPLETED',
    });

    // Earnings calculation
    const completedBookings = await Booking.find({
      provider: providerId,
      status: 'COMPLETED',
    });
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.providerEarnings || 0), 0);

    // Current month earnings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthEarnings = completedBookings
      .filter((b) => {
        const dateVal = b.completedAt || b.updatedAt || new Date();
        const d = new Date(dateVal);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + (b.providerEarnings || 0), 0);

    // Profile Completion Percentage Calculation
    let completionScore = 0;
    if (provider.businessName) completionScore += 15;
    if (provider.headline) completionScore += 15;
    if (provider.bio) completionScore += 15;
    if (provider.servicesOffered && provider.servicesOffered.length > 0) completionScore += 20;
    if (provider.portfolio && provider.portfolio.length > 0) completionScore += 15;
    if (provider.verificationStatus === 'VERIFIED') completionScore += 20;

    res.status(200).json({
      success: true,
      data: {
        provider: {
          id: provider._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          businessName: provider.businessName,
          headline: provider.headline,
          rating: provider.rating,
          reviewCount: provider.reviewCount,
          verificationStatus: provider.verificationStatus,
          isIdentityVerified: provider.isIdentityVerified,
          isBackgroundChecked: provider.isBackgroundChecked,
          isOnline: provider.availability?.isOnline ?? true,
        },
        profileCompletionPercentage: completionScore,
        todayBookings,
        stats: {
          pendingAcceptance: pendingAcceptanceCount,
          upcomingJobs: upcomingCount,
          completedJobs: completedCount,
          totalEarnings,
          thisMonthEarnings,
          rating: provider.rating,
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

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { status } = req.query;
    const query: any = { provider: provider._id };

    if (status && typeof status === 'string') {
      if (status === 'PENDING') {
        query.status = 'CONFIRMED'; // Pending provider acceptance
      } else if (status === 'UPCOMING') {
        query.status = { $in: ['PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY'] };
      } else if (status === 'IN_PROGRESS') {
        query.status = 'SERVICE_STARTED';
      } else {
        query.status = status.toUpperCase();
      }
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone avatar')
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

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { id } = req.params;
    let booking = await Booking.findById(id).populate('customer', 'name email phone avatar').populate('service');
    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: id }).populate('customer', 'name email phone avatar').populate('service');
    }

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.provider.toString() !== provider._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this booking.' });
      return;
    }

    res.status(200).json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CONTROLLED BOOKING STATE MACHINE
export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { id } = req.params;
    const { action, cancellationReason } = req.body; // action: 'ACCEPT' | 'DECLINE' | 'ON_THE_WAY' | 'START_SERVICE' | 'COMPLETE' | 'CANCEL'

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.provider.toString() !== provider._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this booking.' });
      return;
    }

    const currentStatus = booking.status;
    let nextStatus = currentStatus;

    // Controlled State Machine Rules
    if (action === 'ACCEPT') {
      if (currentStatus !== 'CONFIRMED' && currentStatus !== 'PENDING') {
        res.status(400).json({ success: false, message: `Cannot accept a booking with status '${currentStatus}'.` });
        return;
      }
      nextStatus = 'PROVIDER_ACCEPTED';
    } else if (action === 'DECLINE' || action === 'CANCEL') {
      if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
        res.status(400).json({ success: false, message: `Cannot cancel a booking that is already '${currentStatus}'.` });
        return;
      }
      nextStatus = 'CANCELLED';
      booking.cancelledAt = new Date();
      booking.cancellationReason = cancellationReason || 'Cancelled by provider';
      if (booking.paymentStatus === 'PAID') {
        booking.paymentStatus = 'REFUNDED';
      }
    } else if (action === 'ON_THE_WAY') {
      if (currentStatus !== 'PROVIDER_ACCEPTED' && currentStatus !== 'CONFIRMED') {
        res.status(400).json({ success: false, message: `Cannot mark 'ON_THE_WAY' from state '${currentStatus}'.` });
        return;
      }
      nextStatus = 'PROVIDER_ON_THE_WAY';
    } else if (action === 'START_SERVICE') {
      if (currentStatus !== 'PROVIDER_ON_THE_WAY' && currentStatus !== 'PROVIDER_ACCEPTED') {
        res.status(400).json({ success: false, message: `Cannot start service from state '${currentStatus}'.` });
        return;
      }
      nextStatus = 'SERVICE_STARTED';
    } else if (action === 'COMPLETE') {
      if (currentStatus !== 'SERVICE_STARTED' && currentStatus !== 'PROVIDER_ON_THE_WAY' && currentStatus !== 'PROVIDER_ACCEPTED') {
        res.status(400).json({ success: false, message: `Cannot complete service from state '${currentStatus}'.` });
        return;
      }
      nextStatus = 'COMPLETED';
      booking.completedAt = new Date();
      booking.paymentStatus = 'PAID';

      // Create transaction record for provider payout calculation
      await Transaction.create({
        user: req.user._id,
        type: 'PAYOUT',
        amount: booking.providerEarnings,
        status: 'COMPLETED',
        referenceId: booking.bookingNumber,
        description: `Earnings payout for booking #${booking.bookingNumber}`,
      });
    } else {
      res.status(400).json({ success: false, message: `Invalid action '${action}'.` });
      return;
    }

    booking.status = nextStatus;
    await booking.save();

    // Send notification to customer
    await notificationService.createNotification(
      booking.customer.toString(),
      `Booking Status Updated: ${nextStatus.replace(/_/g, ' ')}`,
      `Your booking #${booking.bookingNumber} is now ${nextStatus.replace(/_/g, ' ')}.`,
      'BOOKING_UPDATE',
      `/booking/${booking._id}`
    );

    res.status(200).json({
      success: true,
      message: `Booking state updated to ${nextStatus}`,
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCalendar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const bookings = await Booking.find({
      provider: provider._id,
      status: { $ne: 'CANCELLED' },
    })
      .populate('customer', 'name phone')
      .populate('service', 'title');

    res.status(200).json({
      success: true,
      availability: provider.availability,
      bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAvailability = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { isOnline, weeklySchedule, blackoutDates } = req.body;

    if (!provider.availability) {
      provider.availability = {
        isOnline: true,
        weeklySchedule: [],
        blackoutDates: [],
      };
    }

    if (typeof isOnline === 'boolean') provider.availability.isOnline = isOnline;
    if (weeklySchedule) provider.availability.weeklySchedule = weeklySchedule;
    if (blackoutDates) provider.availability.blackoutDates = blackoutDates;

    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Availability schedule updated.',
      availability: provider.availability,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const services = await Service.find({ _id: { $in: provider.servicesOffered } }).populate('category');
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { categoryId, title, description, basePrice, priceType, estimatedDurationMinutes, includedTasks } = req.body;
    if (!categoryId || !title || !description || !basePrice) {
      res.status(400).json({ success: false, message: 'Category, title, description, and price are required.' });
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newService = await Service.create({
      category: categoryId,
      title,
      slug,
      description,
      basePrice,
      priceType: priceType || 'FIXED',
      estimatedDurationMinutes: estimatedDurationMinutes || 60,
      includedTasks: includedTasks || [],
      isActive: true,
    });

    provider.servicesOffered.push(newService._id as any);
    await provider.save();

    res.status(201).json({ success: true, message: 'Service added successfully.', service: newService });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    Object.assign(service, req.body);
    await service.save();

    res.status(200).json({ success: true, message: 'Service updated.', service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { id } = req.params;
    provider.servicesOffered = provider.servicesOffered.filter((sId) => sId.toString() !== id);
    await provider.save();

    res.status(200).json({ success: true, message: 'Service deactivated for provider.' });
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

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: req.user,
      provider,
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

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { businessName, headline, bio, hourlyRate, yearsOfExperience, serviceAreaRadiusKm, city, state, languages, skills } = req.body;

    if (businessName) provider.businessName = businessName;
    if (headline) provider.headline = headline;
    if (bio) provider.bio = bio;
    if (hourlyRate) provider.hourlyRate = hourlyRate;
    if (yearsOfExperience) provider.yearsOfExperience = yearsOfExperience;
    if (serviceAreaRadiusKm) provider.serviceAreaRadiusKm = serviceAreaRadiusKm;
    if (city) provider.city = city;
    if (state) provider.state = state;
    if (languages) provider.languages = languages;
    if (skills) provider.skills = skills;

    await provider.save();

    res.status(200).json({ success: true, message: 'Provider profile updated.', provider });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPortfolioItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { title, description, imageUrl, category } = req.body;
    if (!title || !description || !imageUrl) {
      res.status(400).json({ success: false, message: 'Title, description, and image URL are required.' });
      return;
    }

    if (!provider.portfolio) provider.portfolio = [];

    const newItem = {
      id: `port-${Date.now()}`,
      title,
      description,
      imageUrl,
      category: category || 'General',
      createdAt: new Date(),
    };

    provider.portfolio.push(newItem);
    await provider.save();

    res.status(201).json({ success: true, message: 'Portfolio item added.', portfolio: provider.portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolioItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { id } = req.params;
    if (provider.portfolio) {
      provider.portfolio = provider.portfolio.filter((item) => item.id !== id);
      await provider.save();
    }

    res.status(200).json({ success: true, message: 'Portfolio item deleted.', portfolio: provider.portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEarnings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const completedBookings = await Booking.find({
      provider: provider._id,
      status: 'COMPLETED',
    })
      .populate('customer', 'name')
      .populate('service', 'title')
      .sort({ completedAt: -1 });

    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.providerEarnings || 0), 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthEarnings = completedBookings
      .filter((b) => {
        const dateVal = b.completedAt || b.updatedAt || new Date();
        const d = new Date(dateVal);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + (b.providerEarnings || 0), 0);

    const lastMonthEarnings = completedBookings
      .filter((b) => {
        const dateVal = b.completedAt || b.updatedAt || new Date();
        const d = new Date(dateVal);
        const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      })
      .reduce((sum, b) => sum + (b.providerEarnings || 0), 0);

    // Pending payouts for active jobs in progress or newly completed
    const pendingBookings = await Booking.find({
      provider: provider._id,
      status: { $in: ['CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED'] },
    });
    const pendingAmount = pendingBookings.reduce((sum, b) => sum + (b.providerEarnings || 0), 0);

    // Transactions list
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        thisMonthEarnings,
        lastMonthEarnings,
        pendingAmount,
        availablePayout: totalEarnings,
        completedJobsCount: completedBookings.length,
        ledger: completedBookings.map((b) => ({
          bookingId: b.bookingNumber,
          date: b.completedAt || b.updatedAt,
          service: (b.service as any)?.title || 'Service',
          customer: (b.customer as any)?.name || 'Client',
          grossAmount: b.totalAmount,
          platformFee: b.platformFee,
          netEarnings: b.providerEarnings,
          status: 'COMPLETED',
        })),
        transactions,
      },
    });
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

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const reviews = await Review.find({ provider: provider._id })
      .populate('customer', 'name avatar')
      .populate('booking')
      .sort({ createdAt: -1 });

    // Rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.rating);
      if (distribution[rounded] !== undefined) {
        distribution[rounded]++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        averageRating: provider.rating,
        totalReviews: provider.reviewCount,
        distribution,
        reviews,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const respondToReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const provider = await findProviderForUser(req.user._id.toString());
    if (!provider) {
      res.status(404).json({ success: false, message: 'Provider profile not found.' });
      return;
    }

    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      res.status(400).json({ success: false, message: 'Response comment is required.' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }

    if (review.provider.toString() !== provider._id.toString()) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this review.' });
      return;
    }

    review.providerResponse = {
      comment,
      createdAt: new Date(),
    };
    await review.save();

    res.status(200).json({ success: true, message: 'Review response added successfully.', review });
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

export const updateSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Provider settings updated.', settings: req.body });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
