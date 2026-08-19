import mongoose, { Schema, Document } from 'mongoose';

export interface ICMSSection extends Document {
  sectionKey: string; // e.g. 'homepage_hero', 'homepage_about', 'about_mission'
  title: string;
  subtitle?: string;
  bodyContent?: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
  isPublished: boolean;
  updatedBy?: mongoose.Types.ObjectId;
}

const CMSSectionSchema = new Schema<ICMSSection>(
  {
    sectionKey: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    bodyContent: { type: String },
    mediaUrl: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const CMSSection = mongoose.model<ICMSSection>('CMSSection', CMSSectionSchema);
