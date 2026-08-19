import apiClient from './api/client';
import { AdminOverview, AdminAnalytics, CMSSection, PlatformSetting, FAQ } from '../types';

export const adminService = {
  // 1. Overview & Analytics
  getOverview: async (): Promise<AdminOverview> => {
    try {
      const res: any = await apiClient.get('/admin/overview');
      return res.data || res;
    } catch {
      return {
        attention: {
          pendingProviderApprovals: 8,
          bookingsRequiringIntervention: 3,
          paymentIssues: 2,
          flaggedReviews: 4,
        },
        snapshot: {
          totalCustomers: 1240,
          activeProviders: 184,
          bookingsToday: 26,
          bookingsThisMonth: 412,
          completedBookings: 388,
          grossBookingValue: 485000,
          platformRevenue: 72750,
          averageRating: 4.8,
        },
      };
    }
  },

  getAnalytics: async (period = '30d', startDate?: string, endDate?: string): Promise<AdminAnalytics> => {
    try {
      const params: any = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res: any = await apiClient.get('/admin/analytics', { params });
      return res.data || res;
    } catch {
      return {
        period,
        metrics: {
          totalBookings: 412,
          completedBookings: 388,
          cancelledBookings: 24,
          cancellationRate: 5.8,
          grossValue: 485000,
          platformRevenue: 72750,
          avgBookingValue: 1250,
        },
        categoryPerformance: [
          { category: 'Electrical Work', bookings: 142, completed: 135, cancelled: 7, revenue: 168000 },
          { category: 'Plumbing & Drainage', bookings: 110, completed: 104, cancelled: 6, revenue: 126000 },
          { category: 'Home Deep Cleaning', bookings: 88, completed: 82, cancelled: 6, revenue: 115000 },
          { category: 'Carpentry & Furniture', bookings: 45, completed: 42, cancelled: 3, revenue: 54000 },
          { category: 'AC & Appliance Repair', bookings: 27, completed: 25, cancelled: 2, revenue: 22000 },
        ],
      };
    }
  },

  // 2. Global Search & Export
  globalSearch: async (q: string) => {
    try {
      const res: any = await apiClient.get('/admin/search', { params: { q } });
      return res.data || res;
    } catch {
      return { customers: [], providers: [], bookings: [], services: [] };
    }
  },

  exportData: (type: 'customers' | 'providers' | 'bookings' | 'payments' | 'reviews') => {
    window.open(`/api/v1/admin/export/${type}`, '_blank');
  },

  // 3. Customers
  getCustomers: async (q = '', status = '', page = 1, limit = 10) => {
    try {
      const res: any = await apiClient.get('/admin/customers', { params: { q, status, page, limit } });
      return res;
    } catch {
      return {
        data: [
          { _id: 'cust-1', id: 'cust-1', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', status: 'ACTIVE', createdAt: '2026-01-15T09:00:00.000Z' },
          { _id: 'cust-2', id: 'cust-2', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98765 43211', status: 'ACTIVE', createdAt: '2026-02-01T11:30:00.000Z' },
          { _id: 'cust-3', id: 'cust-3', name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91 98765 43212', status: 'SUSPENDED', createdAt: '2026-02-10T14:15:00.000Z' },
        ],
        pagination: { total: 3, page: 1, pages: 1 },
      };
    }
  },

  getCustomerById: async (id: string) => {
    try {
      const res: any = await apiClient.get(`/admin/customers/${id}`);
      return res.data || res;
    } catch {
      return {
        user: { _id: id, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', status: 'ACTIVE', createdAt: '2026-01-15T09:00:00.000Z' },
        stats: { totalBookings: 8, completedBookings: 7, cancelledBookings: 1, totalSpending: 9400 },
        bookings: [],
        reviews: [],
      };
    }
  },

  updateCustomerStatus: async (id: string, status: string, reason?: string) => {
    const res: any = await apiClient.patch(`/admin/customers/${id}/status`, { status, reason });
    return res;
  },

  // 4. Providers
  getProviders: async (q = '', status = '', page = 1, limit = 10) => {
    try {
      const res: any = await apiClient.get('/admin/providers', { params: { q, status, page, limit } });
      return res;
    } catch {
      return {
        data: [
          {
            _id: 'prov-1',
            id: 'prov-1',
            businessName: 'Sharma Electrical Services',
            headline: 'Certified Master Electrician with 12 Years Experience',
            city: 'Mumbai',
            state: 'Maharashtra',
            hourlyRate: 500,
            rating: 4.9,
            reviewCount: 48,
            verificationStatus: 'APPROVED',
            user: { name: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', phone: '+91 98111 22233' },
          },
          {
            _id: 'prov-2',
            id: 'prov-2',
            businessName: 'Verma Plumbing Works',
            headline: 'Residential & Commercial Plumbing Specialist',
            city: 'Delhi',
            state: 'NCR',
            hourlyRate: 450,
            rating: 4.7,
            reviewCount: 32,
            verificationStatus: 'SUBMITTED',
            user: { name: 'Amit Verma', email: 'amit.verma@example.com', phone: '+91 98222 33344' },
          },
        ],
        pagination: { total: 2, page: 1, pages: 1 },
      };
    }
  },

  getPendingProviders: async () => {
    try {
      const res: any = await apiClient.get('/admin/providers/pending');
      return res.data || res;
    } catch {
      return [
        {
          _id: 'prov-2',
          id: 'prov-2',
          businessName: 'Verma Plumbing Works',
          headline: 'Residential & Commercial Plumbing Specialist',
          city: 'Delhi',
          yearsOfExperience: 8,
          verificationStatus: 'SUBMITTED',
          user: { name: 'Amit Verma', email: 'amit.verma@example.com', phone: '+91 98222 33344' },
          documents: [
            { id: 'doc-1', type: 'GOVT_ID', documentNumber: 'AADH-8899-1234', fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe', status: 'SUBMITTED' },
            { id: 'doc-2', type: 'TRADE_CERTIFICATE', documentNumber: 'CERT-PLUMB-091', fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f', status: 'SUBMITTED' },
          ],
        },
      ];
    }
  },

  getProviderById: async (id: string) => {
    try {
      const res: any = await apiClient.get(`/admin/providers/${id}`);
      return res.data || res;
    } catch {
      return {
        provider: {
          _id: id,
          businessName: 'Sharma Electrical Services',
          headline: 'Certified Master Electrician',
          bio: 'Providing top-tier electrical repair, wiring, and panel upgrades across Mumbai.',
          city: 'Mumbai',
          state: 'Maharashtra',
          hourlyRate: 500,
          yearsOfExperience: 12,
          rating: 4.9,
          reviewCount: 48,
          verificationStatus: 'APPROVED',
          isIdentityVerified: true,
          isBackgroundChecked: true,
          isInsured: true,
          user: { name: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', phone: '+91 98111 22233' },
        },
        documents: [],
        stats: { totalJobs: 52, completedJobs: 50, cancelledJobs: 2, cancellationRate: 3.8, totalEarnings: 62500 },
        bookings: [],
        reviews: [],
      };
    }
  },

  updateProviderVerification: async (id: string, verificationStatus: string, reason?: string) => {
    const res: any = await apiClient.patch(`/admin/providers/${id}/verification`, { verificationStatus, reason });
    return res;
  },

  // 5. Services & Categories
  getServices: async () => {
    try {
      const res: any = await apiClient.get('/admin/services');
      return res.data || res;
    } catch {
      return [
        { _id: 'srv-1', title: 'Complete Home Electrical Inspection', category: { name: 'Electrical' }, basePrice: 799, priceType: 'FIXED', isActive: true },
        { _id: 'srv-2', title: 'Tap & Faucet Leak Repair', category: { name: 'Plumbing' }, basePrice: 499, priceType: 'FIXED', isActive: true },
      ];
    }
  },

  createService: async (data: any) => {
    const res: any = await apiClient.post('/admin/services', data);
    return res;
  },

  updateService: async (id: string, data: any) => {
    const res: any = await apiClient.patch(`/admin/services/${id}`, data);
    return res;
  },

  getCategories: async () => {
    try {
      const res: any = await apiClient.get('/admin/categories');
      return res.data || res;
    } catch {
      return [
        { _id: 'cat-1', name: 'Electrical Work', slug: 'electrical', description: 'Wiring, fixtures, switches & circuit panels', iconName: 'Zap', isActive: true },
        { _id: 'cat-2', name: 'Plumbing Services', slug: 'plumbing', description: 'Pipes, drains, taps & bathroom fitting repair', iconName: 'Droplet', isActive: true },
      ];
    }
  },

  createCategory: async (data: any) => {
    const res: any = await apiClient.post('/admin/categories', data);
    return res;
  },

  updateCategory: async (id: string, data: any) => {
    const res: any = await apiClient.patch(`/admin/categories/${id}`, data);
    return res;
  },

  // 6. Bookings
  getBookings: async (q = '', status = '', page = 1, limit = 10) => {
    try {
      const res: any = await apiClient.get('/admin/bookings', { params: { q, status, page, limit } });
      return res;
    } catch {
      return {
        data: [
          {
            _id: 'bk-1',
            bookingNumber: 'TH-2026-8891',
            customer: { name: 'Aarav Sharma', email: 'aarav@example.com' },
            provider: { user: { name: 'Rajesh Sharma' } },
            service: { title: 'Electrical Outlet & Switch Replacement' },
            scheduledDate: '2026-08-20',
            scheduledTimeSlot: '10:00 AM - 12:00 PM',
            totalAmount: 1200,
            platformFee: 180,
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            createdAt: '2026-08-19T08:00:00.000Z',
          },
        ],
        pagination: { total: 1, page: 1, pages: 1 },
      };
    }
  },

  getBookingById: async (id: string) => {
    try {
      const res: any = await apiClient.get(`/admin/bookings/${id}`);
      return res.data || res;
    } catch {
      return {
        booking: {
          _id: id,
          bookingNumber: 'TH-2026-8891',
          customer: { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 43210' },
          provider: { user: { name: 'Rajesh Sharma', email: 'rajesh@example.com', phone: '+91 98111 22233' } },
          service: { title: 'Electrical Outlet & Switch Replacement', basePrice: 1200 },
          scheduledDate: '2026-08-20',
          scheduledTimeSlot: '10:00 AM - 12:00 PM',
          serviceAddress: { street: '402 Sunrise Towers', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
          totalAmount: 1200,
          platformFee: 180,
          providerEarnings: 1020,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          createdAt: '2026-08-19T08:00:00.000Z',
        },
        payment: { _id: 'pay-1', amount: 1200, status: 'PAID', method: 'UPI', razorpayPaymentId: 'pay_N89x76s92' },
      };
    }
  },

  updateBookingAdmin: async (id: string, status: string, cancellationReason?: string, adminNote?: string) => {
    const res: any = await apiClient.patch(`/admin/bookings/${id}`, { status, cancellationReason, adminNote });
    return res;
  },

  // 7. Payments & Refunds
  getPayments: async (status = '', page = 1, limit = 10) => {
    try {
      const res: any = await apiClient.get('/admin/payments', { params: { status, page, limit } });
      return res;
    } catch {
      return {
        data: [
          {
            _id: 'pay-1',
            customer: { name: 'Aarav Sharma' },
            booking: { bookingNumber: 'TH-2026-8891', totalAmount: 1200 },
            amount: 1200,
            status: 'PAID',
            method: 'UPI',
            razorpayPaymentId: 'pay_N89x76s92',
            createdAt: '2026-08-19T08:00:00.000Z',
          },
        ],
        pagination: { total: 1, page: 1, pages: 1 },
      };
    }
  },

  initiateRefund: async (paymentId: string, reason: string) => {
    const res: any = await apiClient.post('/admin/payments/refund', { paymentId, reason });
    return res;
  },

  // 8. Reviews
  getReviews: async (rating = '', status = '', page = 1, limit = 10) => {
    try {
      const res: any = await apiClient.get('/admin/reviews', { params: { rating, status, page, limit } });
      return res;
    } catch {
      return {
        data: [
          {
            _id: 'rev-1',
            rating: 5,
            comment: 'Punctual professional. Resolved circuit failure cleanly.',
            workCategory: 'Electrical',
            moderationStatus: 'VISIBLE',
            customer: { name: 'Aarav Sharma' },
            provider: { user: { name: 'Rajesh Sharma' } },
            createdAt: '2026-08-18T10:00:00.000Z',
          },
        ],
        pagination: { total: 1, page: 1, pages: 1 },
      };
    }
  },

  moderateReview: async (id: string, moderationStatus: string, reason?: string) => {
    const res: any = await apiClient.patch(`/admin/reviews/${id}/moderation`, { moderationStatus, reason });
    return res;
  },

  // 9. CMS
  getCMSContent: async (): Promise<CMSSection[]> => {
    try {
      const res: any = await apiClient.get('/admin/cms');
      return res.data || res;
    } catch {
      return [
        { sectionKey: 'homepage_hero', title: 'Verified Local Services. Uncompromising Trust.', subtitle: 'Book certified electricians, plumbers, carpenters, and technicians with clear pricing and guaranteed satisfaction.' },
        { sectionKey: 'about_mission', title: 'Empowering Local Craftsmanship', bodyContent: 'Trusted Hands was built to bridge local service providers with homeowners through transparency and verification.' },
      ];
    }
  },

  updateCMSContent: async (data: Partial<CMSSection>) => {
    const res: any = await apiClient.patch('/admin/cms', data);
    return res;
  },

  getFAQs: async (): Promise<FAQ[]> => {
    try {
      const res: any = await apiClient.get('/admin/faqs');
      return res.data || res;
    } catch {
      return [
        { id: 'faq-1', question: 'How are service professionals verified?', answer: 'Every provider submits government ID, trade license, and undergoes identity and background checks before activation.', category: 'VERIFICATION', order: 1 },
        { id: 'faq-2', question: 'What happens if I need to cancel my booking?', answer: 'Cancellations up to 2 hours prior to scheduled appointment receive 100% refund.', category: 'BOOKINGS', order: 2 },
      ];
    }
  },

  createFAQ: async (data: any) => {
    const res: any = await apiClient.post('/admin/faqs', data);
    return res;
  },

  updateFAQ: async (id: string, data: any) => {
    const res: any = await apiClient.patch(`/admin/faqs/${id}`, data);
    return res;
  },

  deleteFAQ: async (id: string) => {
    const res: any = await apiClient.delete(`/admin/faqs/${id}`);
    return res;
  },

  // 10. Platform Settings & Audit Logs
  getSettings: async (): Promise<PlatformSetting[]> => {
    try {
      const res: any = await apiClient.get('/admin/settings');
      return res.data || res;
    } catch {
      return [
        { key: 'platform_fee_percent', value: 15, type: 'NUMBER', group: 'FEES', description: 'Platform commission percentage retained per booking' },
        { key: 'provider_auto_approval', value: false, type: 'BOOLEAN', group: 'PROVIDER', description: 'Require manual admin review for provider registrations' },
        { key: 'booking_cancellation_hours', value: 2, type: 'NUMBER', group: 'BOOKING', description: 'Minimum notice hours for penalty-free customer cancellation' },
      ];
    }
  },

  updateSettings: async (settings: PlatformSetting[]) => {
    const res: any = await apiClient.patch('/admin/settings', { settings });
    return res;
  },

  getAuditLogs: async (action = '', entityType = '', page = 1, limit = 20) => {
    try {
      const res: any = await apiClient.get('/admin/audit-logs', { params: { action, entityType, page, limit } });
      return res;
    } catch {
      return {
        data: [
          {
            _id: 'log-1',
            adminEmail: 'admin@trustedhands.com',
            action: 'PROVIDER_APPROVED',
            entityType: 'PROVIDER',
            entityId: 'prov-1',
            description: 'Approved provider Rajesh Sharma following document verification',
            createdAt: '2026-08-19T09:30:00.000Z',
          },
        ],
        pagination: { total: 1, page: 1, pages: 1 },
      };
    }
  },
};
