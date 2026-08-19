export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export type VerificationStatus = 'UNVERIFIED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED'
  | 'PROVIDER_ACCEPTED'
  | 'PROVIDER_ON_THE_WAY'
  | 'SERVICE_STARTED'
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'DISPUTED';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'CASH';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  title: string; // e.g. Home, Office, Studio
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  userId?: string;
  user?: User;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  addresses?: Address[];
  preferredPaymentMethod?: PaymentMethod;
  totalBookings?: number;
}

export interface ProviderDocument {
  id: string;
  providerId: string;
  type: 'GOVT_ID' | 'BUSINESS_LICENSE' | 'INSURANCE' | 'TRADE_CERTIFICATE' | 'BACKGROUND_CHECK';
  documentNumber?: string;
  fileUrl: string;
  status: VerificationStatus;
  expiryDate?: string;
  verifiedAt?: string;
}

export interface TimeSlot {
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "17:00"
}

export interface DayAvailability {
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface Availability {
  id: string;
  providerId: string;
  schedule: DayAvailability[];
  blackoutDates: string[]; // ISO Date strings
}

export interface PortfolioItem {
  id?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
}

export interface Provider {
  id: string;
  userId: string;
  user: User;
  businessName?: string;
  headline: string; // e.g. "Master Electrician with 12 Years Residential & Commercial Experience"
  bio: string;
  categories: string[]; // Category IDs
  servicesOffered: string[]; // Service IDs
  hourlyRate: number;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  isIdentityVerified: boolean;
  isBackgroundChecked: boolean;
  isInsured: boolean;
  documents: ProviderDocument[];
  serviceAreaRadiusKm: number;
  location: {
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  availability?: Availability;
  badges: string[];
  portfolio?: PortfolioItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  popularServicesCount: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  categoryId: string;
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

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customer?: Customer;
  providerId: string;
  provider?: Provider;
  serviceId: string;
  service?: Service;
  status: BookingStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string; // e.g. "10:00 AM - 12:00 PM"
  serviceAddress: Address;
  specialInstructions?: string;
  totalAmount: number;
  platformFee: number;
  providerEarnings: number;
  paymentStatus: PaymentStatus;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'PAYMENT' | 'PAYOUT' | 'REFUND' | 'PLATFORM_FEE';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  referenceId: string;
  description: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  workCategory: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  providerResponse?: {
    comment: string;
    createdAt: string;
    respondedAt?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING_UPDATE' | 'PAYMENT_RECEIPT' | 'VERIFICATION' | 'SYSTEM';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  customerId: string;
  providerId: string;
  createdAt: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  contentMarkdown: string;
  metaDescription: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'GENERAL' | 'BOOKINGS' | 'PAYMENTS' | 'VERIFICATION' | 'PROVIDERS';
  order: number;
}

export interface SiteSetting {
  key: string;
  value: string;
  description: string;
}

export interface AuditLog {
  _id: string;
  admin: string | { _id: string; name: string; email: string };
  adminEmail: string;
  action: string;
  entityType: 'PROVIDER' | 'CUSTOMER' | 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'SERVICE' | 'CATEGORY' | 'CMS' | 'SETTINGS' | 'SYSTEM';
  entityId?: string;
  description: string;
  metadata?: any;
  createdAt: string;
}

export interface CMSSection {
  _id?: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  bodyContent?: string;
  mediaUrl?: string;
  metadata?: any;
  isPublished?: boolean;
  updatedAt?: string;
}

export interface PlatformSetting {
  _id?: string;
  key: string;
  value: any;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  group: 'GENERAL' | 'FEES' | 'BOOKING' | 'PROVIDER' | 'SECURITY';
  description: string;
  updatedAt?: string;
}

export interface AdminOverview {
  attention: {
    pendingProviderApprovals: number;
    bookingsRequiringIntervention: number;
    paymentIssues: number;
    flaggedReviews: number;
  };
  snapshot: {
    totalCustomers: number;
    activeProviders: number;
    bookingsToday: number;
    bookingsThisMonth: number;
    completedBookings: number;
    grossBookingValue: number;
    platformRevenue: number;
    averageRating: number;
  };
}

export interface AdminAnalytics {
  period: string;
  metrics: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    cancellationRate: number;
    grossValue: number;
    platformRevenue: number;
    avgBookingValue: number;
  };
  categoryPerformance: Array<{
    category: string;
    bookings: number;
    completed: number;
    cancelled: number;
    revenue: number;
  }>;
}
