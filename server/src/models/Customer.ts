import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  user: mongoose.Types.ObjectId;
  preferredPaymentMethod?: string;
  totalBookings: number;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferredPaymentMethod: { type: String, enum: ['CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH'] },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
