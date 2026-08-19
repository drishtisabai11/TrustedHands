import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  admin: mongoose.Types.ObjectId;
  adminEmail: string;
  action: string; // e.g. PROVIDER_APPROVED, PROVIDER_SUSPENDED, REFUND_INITIATED, REVIEW_HIDDEN
  entityType: 'PROVIDER' | 'CUSTOMER' | 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'SERVICE' | 'CATEGORY' | 'CMS' | 'SETTINGS' | 'SYSTEM';
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true, index: true },
    entityType: {
      type: String,
      enum: ['PROVIDER', 'CUSTOMER', 'BOOKING', 'PAYMENT', 'REVIEW', 'SERVICE', 'CATEGORY', 'CMS', 'SETTINGS', 'SYSTEM'],
      required: true,
      index: true,
    },
    entityId: { type: String, index: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
