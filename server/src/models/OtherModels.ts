import mongoose, { Schema, Document } from 'mongoose';

// 1. Address Model
export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddress>('Address', AddressSchema);

// 2. Provider Document Model
export interface IProviderDocument extends Document {
  provider: mongoose.Types.ObjectId;
  type: 'GOVT_ID' | 'BUSINESS_LICENSE' | 'INSURANCE' | 'TRADE_CERTIFICATE' | 'BACKGROUND_CHECK';
  documentNumber?: string;
  fileUrl: string;
  status: 'UNVERIFIED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: Date;
}

const ProviderDocumentSchema = new Schema<IProviderDocument>(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    type: {
      type: String,
      enum: ['GOVT_ID', 'BUSINESS_LICENSE', 'INSURANCE', 'TRADE_CERTIFICATE', 'BACKGROUND_CHECK'],
      required: true,
    },
    documentNumber: { type: String },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['UNVERIFIED', 'SUBMITTED', 'VERIFIED', 'REJECTED'],
      default: 'SUBMITTED',
    },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const ProviderDocument = mongoose.model<IProviderDocument>('ProviderDocument', ProviderDocumentSchema);

// 3. Notification Model
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'BOOKING_UPDATE' | 'PAYMENT_RECEIPT' | 'VERIFICATION' | 'SYSTEM';
  isRead: boolean;
  linkUrl?: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['BOOKING_UPDATE', 'PAYMENT_RECEIPT', 'VERIFICATION', 'SYSTEM'], default: 'SYSTEM' },
    isRead: { type: Boolean, default: false },
    linkUrl: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

// 4. Transaction Model
export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: 'PAYMENT' | 'PAYOUT' | 'REFUND' | 'PLATFORM_FEE';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  referenceId: string;
  description: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['PAYMENT', 'PAYOUT', 'REFUND', 'PLATFORM_FEE'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'COMPLETED' },
    referenceId: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

// 5. Favorite Model
export interface IFavorite extends Document {
  customer: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ customer: 1, provider: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);

// 6. CMSPage Model
export interface ICMSPage extends Document {
  slug: string;
  title: string;
  contentMarkdown: string;
  metaDescription: string;
}

const CMSPageSchema = new Schema<ICMSPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    contentMarkdown: { type: String, required: true },
    metaDescription: { type: String, required: true },
  },
  { timestamps: true }
);

export const CMSPage = mongoose.model<ICMSPage>('CMSPage', CMSPageSchema);

// 7. FAQ Model
export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: 'GENERAL' | 'BOOKINGS' | 'PAYMENTS' | 'VERIFICATION' | 'PROVIDERS';
  order: number;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ['GENERAL', 'BOOKINGS', 'PAYMENTS', 'VERIFICATION', 'PROVIDERS'],
      default: 'GENERAL',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);

// 8. SiteSetting Model
export interface ISiteSetting extends Document {
  key: string;
  value: string;
  description: string;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const SiteSetting = mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
