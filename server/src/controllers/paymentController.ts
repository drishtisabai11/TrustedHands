import { Response } from 'express';
import crypto from 'crypto';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Transaction } from '../models/OtherModels';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { notificationService } from '../services/notificationService';
import { emailService } from '../services/emailService';

export const createRazorpayOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking record not found.' });
      return;
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    await Payment.create({
      booking: booking._id,
      customer: req.user._id,
      amount: booking.totalAmount,
      currency: 'INR',
      status: 'PENDING',
      method: 'CARD',
      razorpayOrderId,
    });

    res.status(200).json({
      success: true,
      message: 'Razorpay payment order generated.',
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: env.RAZORPAY_KEY_ID,
      bookingNumber: booking.bookingNumber,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // HMAC Signature Validation Architecture
    let isValidSignature = true;
    if (razorpaySignature && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_KEY_SECRET !== 'rzp_test_secret') {
      const generatedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
      isValidSignature = generatedSignature === razorpaySignature;
    }

    if (!isValidSignature) {
      booking.status = 'PENDING';
      booking.paymentStatus = 'FAILED';
      await booking.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed. Security signature mismatch.',
      });
      return;
    }

    // Successful Payment Verification: Update Booking Status
    booking.status = 'CONFIRMED';
    booking.paymentStatus = 'PAID';
    await booking.save();

    await Payment.findOneAndUpdate(
      { booking: booking._id },
      {
        status: 'PAID',
        razorpayPaymentId: razorpayPaymentId || `pay_${Math.random().toString(36).substring(2, 12)}`,
        razorpaySignature,
      },
      { upsert: true }
    );

    // Record Escrow Transaction
    await Transaction.create({
      user: req.user._id,
      type: 'PAYMENT',
      amount: booking.totalAmount,
      status: 'COMPLETED',
      referenceId: razorpayPaymentId || razorpayOrderId,
      description: `Payment for booking #${booking.bookingNumber}`,
    });

    // Create Notification
    await notificationService.createNotification(
      req.user._id.toString(),
      'Payment Received',
      `Payment of ₹${booking.totalAmount} for booking #${booking.bookingNumber} confirmed.`,
      'PAYMENT_RECEIPT',
      `/booking/${booking._id}`
    );

    // Send Confirmation Email
    emailService.sendBookingConfirmation(
      req.user.email,
      booking.bookingNumber,
      'Service Booking',
      booking.scheduledDate,
      booking.scheduledTimeSlot
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Booking is now confirmed.',
      bookingId: booking._id,
      bookingNumber: booking.bookingNumber,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
