import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  popularServicesCount: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Wrench' },
    imageUrl: { type: String },
    popularServicesCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

export interface IService extends Document {
  category: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  priceType: 'FIXED' | 'HOURLY' | 'QUOTE';
  estimatedDurationMinutes: number;
  includedTasks: string[];
  excludedTasks?: string[];
  isActive: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    priceType: { type: String, enum: ['FIXED', 'HOURLY', 'QUOTE'], default: 'FIXED' },
    estimatedDurationMinutes: { type: Number, default: 60 },
    includedTasks: [{ type: String }],
    excludedTasks: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);
