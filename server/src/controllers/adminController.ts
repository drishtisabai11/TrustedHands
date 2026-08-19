import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Provider } from '../models/Provider';
import { Category, Service } from '../models/Category';
import { Booking } from '../models/Booking';
import { Payment, Review } from '../models/Payment';
import { AuditLog } from '../models/AuditLog';
import { CMSSection } from '../models/CMSContent';
import { PlatformSetting } from '../models/PlatformSettings';
import { ProviderDocument, FAQ } from '../models/OtherModels';

// Helper to log audit actions
const logAudit = async (
  req: AuthenticatedRequest,
  action: string,
  entityType: 'PROVIDER' | 'CUSTOMER' | 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'SERVICE' | 'CATEGORY' | 'CMS' | 'SETTINGS' | 'SYSTEM',
  entityId: string | undefined,
  description: string,
  metadata?: any
) => {
  try {
    if (!req.user) return;
    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action,
      entityType,
      entityId: entityId ? String(entityId) : undefined,
      description,
      metadata,
      ipAddress: req.ip,
    });
  } catch (err) {
    console.error('Failed to log audit:', err);
  }
};

// Helper for date filter calculation
const getDateFilter = (period?: string, startDate?: string, endDate?: string) => {
  const now = new Date();
  let start = new Date(0);
  let end = new Date();

  if (period === 'today') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === '7d') {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === '30d') {
    start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (period === '90d') {
    start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else if (period === 'ytd') {
    start = new Date(now.getFullYear(), 0, 1);
  } else if (period === 'custom' && startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

// 1. ADMIN OVERVIEW & ATTENTION ITEMS
export const getOverviewData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    // Attention Items (Actionable)
    const pendingProvidersCount = await Provider.countDocuments({
      verificationStatus: { $in: ['SUBMITTED', 'PENDING', 'UNDER_REVIEW'] },
    });

    const bookingsInterventionCount = await Booking.countDocuments({
      status: { $in: ['DISPUTED', 'PENDING'] },
    });

    const paymentIssuesCount = await Payment.countDocuments({
      status: 'FAILED',
    });

    const flaggedReviewsCount = await Review.countDocuments({
      moderationStatus: 'FLAGGED',
    });

    // Real Metrics
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER', status: 'ACTIVE' });
    const activeProviders = await Provider.countDocuments({
      verificationStatus: { $in: ['VERIFIED', 'APPROVED'] },
    });

    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: monthStart },
    });

    const completedBookingsCount = await Booking.countDocuments({ status: 'COMPLETED' });

    // Financial calculations
    const financialAgg = await Booking.aggregate([
      { $match: { status: 'COMPLETED' } },
      {
        $group: {
          _id: null,
          grossValue: { $sum: '$totalAmount' },
          revenue: { $sum: '$platformFee' },
        },
      },
    ]);

    const grossBookingValue = financialAgg.length > 0 ? financialAgg[0].grossValue : 0;
    const platformRevenue = financialAgg.length > 0 ? financialAgg[0].revenue : 0;

    // Average Provider Rating
    const ratingAgg = await Provider.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const averageRating = ratingAgg.length > 0 ? Number(ratingAgg[0].avgRating.toFixed(1)) : 4.8;

    res.json({
      success: true,
      data: {
        attention: {
          pendingProviderApprovals: pendingProvidersCount,
          bookingsRequiringIntervention: bookingsInterventionCount,
          paymentIssues: paymentIssuesCount,
          flaggedReviews: flaggedReviewsCount,
        },
        snapshot: {
          totalCustomers,
          activeProviders,
          bookingsToday,
          bookingsThisMonth,
          completedBookings: completedBookingsCount,
          grossBookingValue,
          platformRevenue,
          averageRating,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ADMIN ANALYTICS
export const getAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { period, startDate, endDate } = req.query as { period?: string; startDate?: string; endDate?: string };
    const { start, end } = getDateFilter(period, startDate, endDate);

    const matchDate = { createdAt: { $gte: start, $lte: end } };

    const totalBookings = await Booking.countDocuments(matchDate);
    const completedBookings = await Booking.countDocuments({ ...matchDate, status: 'COMPLETED' });
    const cancelledBookings = await Booking.countDocuments({ ...matchDate, status: 'CANCELLED' });

    const revAgg = await Booking.aggregate([
      { $match: { ...matchDate, status: 'COMPLETED' } },
      {
        $group: {
          _id: null,
          gross: { $sum: '$totalAmount' },
          revenue: { $sum: '$platformFee' },
        },
      },
    ]);

    const grossValue = revAgg.length > 0 ? revAgg[0].gross : 0;
    const platformRevenue = revAgg.length > 0 ? revAgg[0].revenue : 0;
    const cancellationRate = totalBookings > 0 ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1)) : 0;
    const avgBookingValue = completedBookings > 0 ? Math.round(grossValue / completedBookings) : 0;

    // Service category breakdown
    const categoryStats = await Booking.aggregate([
      { $match: matchDate },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDoc',
        },
      },
      { $unwind: { path: '$serviceDoc', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'serviceDoc.category',
          foreignField: '_id',
          as: 'catDoc',
        },
      },
      { $unwind: { path: '$catDoc', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$catDoc.name',
          bookings: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
          },
          revenue: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, '$totalAmount', 0] },
          },
        },
      },
      { $sort: { bookings: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        period: period || '30d',
        metrics: {
          totalBookings,
          completedBookings,
          cancelledBookings,
          cancellationRate,
          grossValue,
          platformRevenue,
          avgBookingValue,
        },
        categoryPerformance: categoryStats.map((c) => ({
          category: c._id || 'General',
          bookings: c.bookings,
          completed: c.completed,
          cancelled: c.cancelled,
          revenue: c.revenue,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. CUSTOMER MANAGEMENT
export const getCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q, status, page = '1', limit = '10' } = req.query as { q?: string; status?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query: any = { role: 'CUSTOMER' };
    if (status) query.status = status;
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user || user.role !== 'CUSTOMER') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const bookings = await Booking.find({ customer: user._id })
      .populate('service', 'title')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
    const totalSpending = bookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const reviews = await Review.find({ customer: user._id });

    res.json({
      success: true,
      data: {
        user,
        stats: {
          totalBookings,
          completedBookings,
          cancelledBookings,
          totalSpending,
        },
        bookings,
        reviews,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomerStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'CUSTOMER') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await logAudit(
      req,
      status === 'SUSPENDED' ? 'CUSTOMER_SUSPENDED' : 'CUSTOMER_STATUS_UPDATED',
      'CUSTOMER',
      user._id.toString(),
      `Changed customer ${user.email} status from ${oldStatus} to ${status}. Reason: ${reason || 'N/A'}`,
      { oldStatus, newStatus: status, reason }
    );

    res.json({ success: true, message: `Customer status updated to ${status}`, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. PROVIDER MANAGEMENT
export const getProviders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q, status, page = '1', limit = '10' } = req.query as { q?: string; status?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query: any = {};
    if (status) query.verificationStatus = status;

    let providers = await Provider.find(query)
      .populate('user', '-passwordHash')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    if (q) {
      const qLower = q.toLowerCase();
      providers = providers.filter((p: any) => {
        const u = p.user;
        return (
          u?.name?.toLowerCase().includes(qLower) ||
          u?.email?.toLowerCase().includes(qLower) ||
          p.headline?.toLowerCase().includes(qLower) ||
          p.city?.toLowerCase().includes(qLower)
        );
      });
    }

    const total = providers.length;
    const paginated = providers.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingProviders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pendingProviders = await Provider.find({
      verificationStatus: { $in: ['SUBMITTED', 'PENDING', 'UNDER_REVIEW'] },
    })
      .populate('user', '-passwordHash')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    // Fetch submitted docs for each pending provider
    const results = await Promise.all(
      pendingProviders.map(async (p) => {
        const docs = await ProviderDocument.find({ provider: p._id });
        return {
          ...p.toObject(),
          documents: docs,
        };
      })
    );

    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('user', '-passwordHash')
      .populate('categories')
      .populate('servicesOffered');

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const documents = await ProviderDocument.find({ provider: provider._id });
    const bookings = await Booking.find({ provider: provider._id })
      .populate('service', 'title')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    const totalEarnings = bookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.providerEarnings, 0);

    const completedJobs = bookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelledJobs = bookings.filter((b) => b.status === 'CANCELLED').length;
    const totalJobs = bookings.length;
    const cancellationRate = totalJobs > 0 ? Number(((cancelledJobs / totalJobs) * 100).toFixed(1)) : 0;

    const reviews = await Review.find({ provider: provider._id }).populate('customer', 'name');

    res.json({
      success: true,
      data: {
        provider,
        documents,
        stats: {
          totalJobs,
          completedJobs,
          cancelledJobs,
          cancellationRate,
          totalEarnings,
        },
        bookings,
        reviews,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProviderVerification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { verificationStatus, reason } = req.body;
    const provider = await Provider.findById(req.params.id).populate('user');

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'VERIFIED', 'REJECTED', 'SUSPENDED'];
    if (!validStatuses.includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status transition' });
    }

    const oldStatus = provider.verificationStatus;
    provider.verificationStatus = verificationStatus;
    if (verificationStatus === 'APPROVED' || verificationStatus === 'VERIFIED') {
      provider.isIdentityVerified = true;
      provider.isBackgroundChecked = true;
      // also update user status
      await User.findByIdAndUpdate(provider.user, { status: 'ACTIVE' });
    } else if (verificationStatus === 'REJECTED' || verificationStatus === 'SUSPENDED') {
      provider.isIdentityVerified = false;
      if (verificationStatus === 'SUSPENDED') {
        await User.findByIdAndUpdate(provider.user, { status: 'SUSPENDED' });
      }
    }

    await provider.save();

    await logAudit(
      req,
      `PROVIDER_${verificationStatus}`,
      'PROVIDER',
      provider._id.toString(),
      `Changed provider ${provider.businessName || (provider.user as any)?.name} status from ${oldStatus} to ${verificationStatus}. Reason: ${reason || 'N/A'}`,
      { oldStatus, newStatus: verificationStatus, reason }
    );

    res.json({ success: true, message: `Provider status set to ${verificationStatus}`, data: provider });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. SERVICE & CATEGORY MANAGEMENT
export const getServices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const services = await Service.find().populate('category', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, title, slug, description, basePrice, priceType, estimatedDurationMinutes, includedTasks, excludedTasks } = req.body;
    const service = await Service.create({
      category,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      basePrice,
      priceType: priceType || 'FIXED',
      estimatedDurationMinutes: estimatedDurationMinutes || 60,
      includedTasks: includedTasks || [],
      excludedTasks: excludedTasks || [],
      isActive: true,
    });

    await logAudit(req, 'SERVICE_CREATED', 'SERVICE', service._id.toString(), `Created service ${service.title}`);
    res.status(201).json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    await logAudit(req, 'SERVICE_UPDATED', 'SERVICE', service._id.toString(), `Updated service ${service.title}`);
    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, slug, description, iconName, imageUrl } = req.body;
    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      iconName: iconName || 'Wrench',
      imageUrl,
      isActive: true,
    });

    await logAudit(req, 'CATEGORY_CREATED', 'CATEGORY', category._id.toString(), `Created category ${category.name}`);
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isActive } = req.body;
    const categoryId = req.params.id;

    // Safety check if deactivating category with active services
    if (isActive === false) {
      const activeServicesCount = await Service.countDocuments({ category: categoryId, isActive: true });
      if (activeServicesCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot deactivate category with ${activeServicesCount} active service(s). Please deactivate services first.`,
        });
      }
    }

    const category = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await logAudit(req, 'CATEGORY_UPDATED', 'CATEGORY', category._id.toString(), `Updated category ${category.name}`);
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. BOOKING MANAGEMENT
export const getBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q, status, page = '1', limit = '10' } = req.query as { q?: string; status?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query: any = {};
    if (status) query.status = status;
    if (q) {
      query.$or = [{ bookingNumber: { $regex: q, $options: 'i' } }];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name email' } })
      .populate('service', 'title basePrice')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name email phone' } })
      .populate('service');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const payment = await Payment.findOne({ booking: booking._id });

    res.json({
      success: true,
      data: {
        booking,
        payment,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, cancellationReason, adminNote } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const oldStatus = booking.status;
    booking.status = status;
    if (status === 'CANCELLED') {
      booking.cancelledAt = new Date();
      booking.cancellationReason = cancellationReason || 'Cancelled by Admin';
    } else if (status === 'COMPLETED') {
      booking.completedAt = new Date();
    }

    await booking.save();

    await logAudit(
      req,
      `BOOKING_${status}`,
      'BOOKING',
      booking._id.toString(),
      `Admin updated booking #${booking.bookingNumber} status from ${oldStatus} to ${status}. Note: ${adminNote || 'N/A'}`,
      { oldStatus, newStatus: status, adminNote }
    );

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. PAYMENT MANAGEMENT & REFUNDS
export const getPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '10' } = req.query as { status?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query: any = {};
    if (status) query.status = status;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('customer', 'name email')
      .populate({ path: 'booking', select: 'bookingNumber totalAmount status' })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const initiateRefund = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentId, reason } = req.body;
    const payment = await Payment.findById(paymentId).populate('booking');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

    if (payment.status === 'REFUNDED') {
      return res.status(400).json({ success: false, message: 'Payment is already refunded' });
    }

    // Process refund state update
    payment.status = 'REFUNDED';
    await payment.save();

    if (payment.booking) {
      await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'REFUNDED', status: 'CANCELLED', cancelledAt: new Date(), cancellationReason: `Refunded by Admin: ${reason || 'N/A'}` });
    }

    await logAudit(
      req,
      'REFUND_INITIATED',
      'PAYMENT',
      payment._id.toString(),
      `Initiated refund of ₹${payment.amount} for payment ${payment._id}. Reason: ${reason || 'N/A'}`,
      { amount: payment.amount, reason }
    );

    res.json({ success: true, message: `Refund of ₹${payment.amount} processed successfully`, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. REVIEW MODERATION
export const getReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { rating, status, page = '1', limit = '10' } = req.query as { rating?: string; status?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query: any = {};
    if (rating) query.rating = parseInt(rating, 10);
    if (status) query.moderationStatus = status;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('customer', 'name email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const moderateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { moderationStatus, reason } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const oldStatus = review.moderationStatus || 'VISIBLE';
    review.moderationStatus = moderationStatus;
    review.flaggedReason = reason;
    review.moderatedBy = req.user?._id as any;
    review.moderatedAt = new Date();

    await review.save();

    await logAudit(
      req,
      `REVIEW_${moderationStatus}`,
      'REVIEW',
      review._id.toString(),
      `Moderated review ${review._id} status from ${oldStatus} to ${moderationStatus}. Reason: ${reason || 'N/A'}`,
      { oldStatus, newStatus: moderationStatus, reason }
    );

    res.json({ success: true, message: `Review moderation status updated to ${moderationStatus}`, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. CMS MANAGEMENT
export const getCMSContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sections = await CMSSection.find();
    res.json({ success: true, data: sections });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCMSContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionKey, title, subtitle, bodyContent, mediaUrl, metadata } = req.body;

    const section = await CMSSection.findOneAndUpdate(
      { sectionKey },
      {
        sectionKey,
        title,
        subtitle,
        bodyContent,
        mediaUrl,
        metadata,
        updatedBy: req.user?._id,
      },
      { upsert: true, new: true }
    );

    await logAudit(req, 'CMS_UPDATED', 'CMS', section._id.toString(), `Updated CMS section [${sectionKey}]`);
    res.json({ success: true, data: section });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFAQs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json({ success: true, data: faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { question, answer, category, order } = req.body;
    const faq = await FAQ.create({ question, answer, category: category || 'GENERAL', order: order || 0 });
    await logAudit(req, 'FAQ_CREATED', 'CMS', faq._id.toString(), `Created FAQ: ${faq.question}`);
    res.status(201).json({ success: true, data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    await logAudit(req, 'FAQ_UPDATED', 'CMS', faq._id.toString(), `Updated FAQ: ${faq.question}`);
    res.json({ success: true, data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    await logAudit(req, 'FAQ_DELETED', 'CMS', req.params.id, `Deleted FAQ: ${faq.question}`);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. PLATFORM SETTINGS
export const getSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await PlatformSetting.find();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { settings } = req.body; // Array of { key, value, type, group, description }
    if (!Array.isArray(settings)) {
      return res.status(400).json({ success: false, message: 'Expected array of settings' });
    }

    const updatedResults = [];
    for (const item of settings) {
      const updated = await PlatformSetting.findOneAndUpdate(
        { key: item.key },
        {
          key: item.key,
          value: item.value,
          type: item.type || 'STRING',
          group: item.group || 'GENERAL',
          description: item.description || item.key,
          updatedBy: req.user?._id,
        },
        { upsert: true, new: true }
      );
      updatedResults.push(updated);
    }

    await logAudit(req, 'SETTINGS_UPDATED', 'SETTINGS', undefined, `Updated ${updatedResults.length} platform setting(s)`);
    res.json({ success: true, data: updatedResults });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 11. AUDIT LOGS
export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, entityType, page = '1', limit = '20' } = req.query as { action?: string; entityType?: string; page?: string; limit?: string };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query: any = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 12. GLOBAL ADMIN SEARCH
export const globalSearch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q } = req.query as { q?: string };
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: { customers: [], providers: [], bookings: [], services: [] } });
    }

    const regex = new RegExp(q.trim(), 'i');

    const customers = await User.find({ role: 'CUSTOMER', $or: [{ name: regex }, { email: regex }, { phone: regex }] })
      .select('name email phone status')
      .limit(5);

    const providers = await Provider.find({ $or: [{ businessName: regex }, { headline: regex }, { city: regex }] })
      .populate('user', 'name email')
      .limit(5);

    const bookings = await Booking.find({ bookingNumber: regex })
      .populate('customer', 'name')
      .populate('service', 'title')
      .limit(5);

    const services = await Service.find({ title: regex }).limit(5);

    res.json({
      success: true,
      data: {
        customers,
        providers,
        bookings,
        services,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 13. CSV EXPORT
export const exportData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type } = req.params;

    let csvContent = '';
    if (type === 'customers') {
      const customers = await User.find({ role: 'CUSTOMER' }).select('-passwordHash');
      csvContent = 'ID,Name,Email,Phone,Status,RegistrationDate\n';
      customers.forEach((c) => {
        csvContent += `"${c._id}","${c.name}","${c.email}","${c.phone || ''}","${c.status}","${c.createdAt}"\n`;
      });
    } else if (type === 'providers') {
      const providers = await Provider.find().populate('user', 'name email phone');
      csvContent = 'ID,Name,BusinessName,City,HourlyRate,VerificationStatus,Rating,ReviewCount\n';
      providers.forEach((p: any) => {
        csvContent += `"${p._id}","${p.user?.name || ''}","${p.businessName || ''}","${p.city}","${p.hourlyRate}","${p.verificationStatus}","${p.rating}","${p.reviewCount}"\n`;
      });
    } else if (type === 'bookings') {
      const bookings = await Booking.find().populate('customer', 'name').populate('service', 'title');
      csvContent = 'BookingNumber,Customer,Service,ScheduledDate,TotalAmount,PlatformFee,Status,PaymentStatus\n';
      bookings.forEach((b: any) => {
        csvContent += `"${b.bookingNumber}","${b.customer?.name || ''}","${b.service?.title || ''}","${b.scheduledDate}","${b.totalAmount}","${b.platformFee}","${b.status}","${b.paymentStatus}"\n`;
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid export type' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_export_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
