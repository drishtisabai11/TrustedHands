import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Service } from '../models/Category';
import { Provider } from '../models/Provider';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { notificationService } from '../services/notificationService';

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { providerId, serviceId, scheduledDate, scheduledTimeSlot, serviceAddress, specialInstructions } = req.body;

    if (!providerId || !serviceId || !scheduledDate || !scheduledTimeSlot || !serviceAddress) {
      res.status(400).json({ success: false, message: 'Provider, service, date, time slot, and address are required.' });
      return;
    }

    // Double-Booking Concurrency Protection: Check if provider is already booked for this date and time
    const existingBooking = await Booking.findOne({
      provider: providerId,
      scheduledDate,
      scheduledTimeSlot,
      status: { $in: ['CONFIRMED', 'PROVIDER_ACCEPTED', 'IN_PROGRESS', 'PENDING'] },
    });

    if (existingBooking) {
      res.status(409).json({
        success: false,
        message: 'This arrival time slot has already been reserved by another client. Please select another time.',
      });
      return;
    }

    // Backend Price Calculation Guard
    const serviceDoc = await Service.findById(serviceId);
    const servicePrice = serviceDoc ? serviceDoc.basePrice : 499;
    const platformFee = Math.round(servicePrice * 0.12) || 50;
    const totalAmount = servicePrice + platformFee;
    const providerEarnings = servicePrice;

    const bookingNumber = `TH-BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = await Booking.create({
      bookingNumber,
      customer: req.user._id,
      provider: providerId,
      service: serviceId,
      status: 'PENDING',
      scheduledDate,
      scheduledTimeSlot,
      serviceAddress,
      specialInstructions,
      totalAmount,
      platformFee,
      providerEarnings,
      paymentStatus: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Booking initiated. Please complete payment to confirm.',
      booking: newBooking,
    });
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
    let booking = await Booking.findById(id)
      .populate('provider')
      .populate('service')
      .populate('customer', 'name email phone avatar');

    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: id })
        .populate('provider')
        .populate('service')
        .populate('customer', 'name email phone avatar');
    }

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking record not found.' });
      return;
    }

    // Authorization Guard
    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      res.status(403).json({ success: false, message: 'Access denied to this booking record.' });
      return;
    }

    res.status(200).json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const query = req.user.role === 'PROVIDER' ? { provider: req.user._id } : { customer: req.user._id };
    const bookings = await Booking.find(query)
      .populate('provider')
      .populate('service')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this booking.' });
      return;
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      res.status(400).json({ success: false, message: `Cannot cancel a booking that is already ${booking.status}.` });
      return;
    }

    booking.status = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'Cancelled by customer';
    if (booking.paymentStatus === 'PAID') {
      booking.paymentStatus = 'REFUNDED';
    }
    await booking.save();

    await notificationService.createNotification(
      req.user._id.toString(),
      'Booking Cancelled',
      `Booking #${booking.bookingNumber} has been cancelled.`,
      'BOOKING_UPDATE',
      `/booking/${booking._id}`
    );

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
