import mongoose, { Schema, Document } from 'mongoose';

export interface IProvider extends Document {
  user: mongoose.Types.ObjectId;
  businessName?: string;
  headline: string;
  bio: string;
  categories: mongoose.Types.ObjectId[];
  servicesOffered: mongoose.Types.ObjectId[];
  hourlyRate: number;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  verificationStatus: 'UNVERIFIED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  isIdentityVerified: boolean;
  isBackgroundChecked: boolean;
  isInsured: boolean;
  serviceAreaRadiusKm: number;
  city: string;
  state: string;
  location?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  badges: string[];
}

const ProviderSchema = new Schema<IProvider>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, trim: true },
    headline: { type: String, required: true },
    bio: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    servicesOffered: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    hourlyRate: { type: Number, required: true, min: 0 },
    yearsOfExperience: { type: Number, default: 1 },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'SUBMITTED', 'VERIFIED', 'REJECTED'],
      default: 'UNVERIFIED',
    },
    isIdentityVerified: { type: Boolean, default: false },
    isBackgroundChecked: { type: Boolean, default: false },
    isInsured: { type: Boolean, default: false },
    serviceAreaRadiusKm: { type: Number, default: 15 },
    city: { type: String, required: true },
    state: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
    badges: [{ type: String }],
  },
  { timestamps: true }
);

ProviderSchema.index({ location: '2dsphere' });

export const Provider = mongoose.model<IProvider>('Provider', ProviderSchema);
