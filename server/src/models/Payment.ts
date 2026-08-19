import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
  method: 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'CASH';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  receiptUrl?: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    method: { type: String, enum: ['CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH'], default: 'CARD' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export interface IReview extends Document {
  booking: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  workCategory: string;
  isVerifiedPurchase: boolean;
  moderationStatus: 'VISIBLE' | 'FLAGGED' | 'HIDDEN' | 'RESTORED';
  flaggedReason?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  providerResponse?: {
    comment: string;
    respondedAt?: Date;
    createdAt?: Date;
  };
}

const ReviewSchema = new Schema<IReview>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    workCategory: { type: String, required: true },
    isVerifiedPurchase: { type: Boolean, default: true },
    moderationStatus: {
      type: String,
      enum: ['VISIBLE', 'FLAGGED', 'HIDDEN', 'RESTORED'],
      default: 'VISIBLE',
      index: true,
    },
    flaggedReason: { type: String },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: { type: Date },
    providerResponse: {
      comment: { type: String },
      respondedAt: { type: Date },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);

