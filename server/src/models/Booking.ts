import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingNumber: string;
  customer: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  status: 'PENDING' | 'CONFIRMED' | 'PROVIDER_ACCEPTED' | 'PROVIDER_ON_THE_WAY' | 'SERVICE_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string;
  serviceAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  specialInstructions?: string;
  totalAmount: number;
  platformFee: number;
  providerEarnings: number;
  paymentStatus: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
      default: 'PENDING',
    },
    scheduledDate: { type: String, required: true },
    scheduledTimeSlot: { type: String, required: true },
    serviceAddress: {
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    specialInstructions: { type: String },
    totalAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    providerEarnings: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
