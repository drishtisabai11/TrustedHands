import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformSetting extends Document {
  key: string; // e.g. 'platform_fee_percent', 'provider_auto_approval', 'booking_cancellation_hours'
  value: any;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  group: 'GENERAL' | 'FEES' | 'BOOKING' | 'PROVIDER' | 'SECURITY';
  description: string;
  updatedBy?: mongoose.Types.ObjectId;
}

const PlatformSettingSchema = new Schema<IPlatformSetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON'], default: 'STRING' },
    group: { type: String, enum: ['GENERAL', 'FEES', 'BOOKING', 'PROVIDER', 'SECURITY'], default: 'GENERAL' },
    description: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const PlatformSetting = mongoose.model<IPlatformSetting>('PlatformSetting', PlatformSettingSchema);
