import apiClient from './api/client';
import { Booking, Address, Review, Notification, Provider, Service, PortfolioItem } from '../types';
import { MOCK_PROVIDERS, MOCK_SERVICES, MOCK_REVIEWS } from '../data/mockData';

// MOCK DATA STORAGE FOR FALLBACK & LOCAL SIMULATION
const MOCK_ADDRESSES_STORAGE: Address[] = [
  {
    id: 'addr-1',
    userId: 'usr-cust-1',
    title: 'Home',
    street: 'B-402, Green Ridge Apartments, Hiranandani Estate',
    apartment: 'Flat 402',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400607',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'usr-cust-1',
    title: 'Design Studio',
    street: '88, Worli Sea Face, Near Lotus Club',
    apartment: 'Floor 3',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400018',
    country: 'India',
    isDefault: false,
  },
];

const MOCK_BOOKINGS_STORAGE: Booking[] = [
  {
    id: 'bk-9901',
    bookingNumber: 'TH-BK-884920',
    customerId: 'usr-cust-1',
    customer: {
      id: 'usr-cust-1',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98200 99881',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    providerId: 'pro-1',
    provider: MOCK_PROVIDERS[0], // Rajesh Kumar
    serviceId: 'srv-elec-1',
    service: MOCK_SERVICES[0],
    status: 'CONFIRMED',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    scheduledTimeSlot: '10:30 AM - 12:00 PM',
    serviceAddress: MOCK_ADDRESSES_STORAGE[0],
    specialInstructions: 'Please call on arrival. Main switch board is near entrance gate.',
    totalAmount: 449,
    platformFee: 50,
    providerEarnings: 399,
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bk-9902',
    bookingNumber: 'TH-BK-774120',
    customerId: 'usr-cust-1',
    customer: {
      id: 'usr-cust-1',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98200 99881',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    providerId: 'pro-2',
    provider: MOCK_PROVIDERS[1], // Arjun Vishwakarma
    serviceId: 'srv-carp-1',
    service: MOCK_SERVICES[3],
    status: 'COMPLETED',
    scheduledDate: '2026-08-10',
    scheduledTimeSlot: '02:00 PM - 04:00 PM',
    serviceAddress: MOCK_ADDRESSES_STORAGE[0],
    specialInstructions: 'Realignment of main door hinges.',
    totalAmount: 549,
    platformFee: 50,
    providerEarnings: 499,
    paymentStatus: 'PAID',
    completedAt: '2026-08-10T16:00:00Z',
    createdAt: '2026-08-08T10:00:00Z',
  },
  {
    id: 'bk-9903',
    bookingNumber: 'TH-BK-661002',
    customerId: 'usr-cust-1',
    customer: {
      id: 'usr-cust-1',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98200 99881',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    providerId: 'pro-3',
    provider: MOCK_PROVIDERS[2], // Anita Sharma
    serviceId: 'srv-clean-1',
    service: MOCK_SERVICES[5],
    status: 'COMPLETED',
    scheduledDate: '2026-07-25',
    scheduledTimeSlot: '09:00 AM - 01:00 PM',
    serviceAddress: MOCK_ADDRESSES_STORAGE[1],
    specialInstructions: 'Deep cleaning before studio launch.',
    totalAmount: 2549,
    platformFee: 50,
    providerEarnings: 2499,
    paymentStatus: 'PAID',
    completedAt: '2026-07-25T13:00:00Z',
    createdAt: '2026-07-20T11:00:00Z',
  },
];

const MOCK_NOTIFICATIONS_STORAGE: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-cust-1',
    title: 'Booking Confirmed',
    message: 'Your booking #TH-BK-884920 with Rajesh Kumar is confirmed for Tomorrow at 10:30 AM.',
    type: 'BOOKING_UPDATE',
    isRead: false,
    linkUrl: '/dashboard/bookings/bk-9901',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'usr-cust-1',
    title: 'Service Completed',
    message: 'Arjun Vishwakarma completed furniture repair for booking #TH-BK-774120.',
    type: 'BOOKING_UPDATE',
    isRead: true,
    linkUrl: '/dashboard/bookings/bk-9902',
    createdAt: '2026-08-10T16:05:00Z',
  },
  {
    id: 'notif-3',
    userId: 'usr-cust-1',
    title: 'Payment Received',
    message: 'Payment receipt of ₹549 for booking #TH-BK-774120 generated.',
    type: 'PAYMENT_RECEIPT',
    isRead: true,
    linkUrl: '/dashboard/bookings/bk-9902',
    createdAt: '2026-08-08T10:02:00Z',
  },
];

const MOCK_SAVED_PROVIDERS_STORAGE: Provider[] = [MOCK_PROVIDERS[0], MOCK_PROVIDERS[1]];

// CUSTOMER API METHODS
export const customerApi = {
  getDashboardSummary: async () => {
    try {
      const res: any = await apiClient.get('/customer/dashboard');
      return res.data || res;
    } catch {
      // Mock Fallback
      const upcoming = MOCK_BOOKINGS_STORAGE.find((b) => ['CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'PENDING'].includes(b.status));
      return {
        user: { name: 'Aarav Mehta', email: 'aarav.mehta@example.com' },
        upcomingBooking: upcoming || null,
        stats: {
          totalBookings: MOCK_BOOKINGS_STORAGE.length,
          upcomingBookings: upcoming ? 1 : 0,
          completedBookings: MOCK_BOOKINGS_STORAGE.filter((b) => b.status === 'COMPLETED').length,
          savedProviders: MOCK_SAVED_PROVIDERS_STORAGE.length,
          pendingReviews: 1,
          unreadNotifications: MOCK_NOTIFICATIONS_STORAGE.filter((n) => !n.isRead).length,
        },
      };
    }
  },

  getBookings: async (statusFilter?: string) => {
    try {
      const res: any = await apiClient.get('/customer/bookings', { params: { status: statusFilter } });
      return res.data || res || [];
    } catch {
      if (!statusFilter || statusFilter === 'ALL') return MOCK_BOOKINGS_STORAGE;
      if (statusFilter === 'UPCOMING') {
        return MOCK_BOOKINGS_STORAGE.filter((b) => ['PENDING', 'CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED'].includes(b.status));
      }
      return MOCK_BOOKINGS_STORAGE.filter((b) => b.status === statusFilter);
    }
  },

  getBookingById: async (bookingId: string) => {
    try {
      const res: any = await apiClient.get(`/customer/bookings/${bookingId}`);
      return res.booking || res.data || res;
    } catch {
      const found = MOCK_BOOKINGS_STORAGE.find((b) => b.id === bookingId || b.bookingNumber === bookingId);
      if (!found) throw new Error('Booking not found');
      return found;
    }
  },

  getSavedProviders: async () => {
    try {
      const res: any = await apiClient.get('/customer/favorites');
      return res.data || res || [];
    } catch {
      return MOCK_SAVED_PROVIDERS_STORAGE;
    }
  },

  removeSavedProvider: async (providerId: string) => {
    try {
      await apiClient.delete(`/customer/favorites/${providerId}`);
    } catch {
      const index = MOCK_SAVED_PROVIDERS_STORAGE.findIndex((p) => p.id === providerId);
      if (index > -1) MOCK_SAVED_PROVIDERS_STORAGE.splice(index, 1);
    }
  },

  getAddresses: async () => {
    try {
      const res: any = await apiClient.get('/customer/addresses');
      return res.data || res || [];
    } catch {
      return MOCK_ADDRESSES_STORAGE;
    }
  },

  createAddress: async (addressData: Omit<Address, 'id' | 'userId'>) => {
    try {
      const res: any = await apiClient.post('/customer/addresses', addressData);
      return res.address || res.data || res;
    } catch {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        userId: 'usr-cust-1',
        ...addressData,
      };
      if (newAddr.isDefault) {
        MOCK_ADDRESSES_STORAGE.forEach((a) => (a.isDefault = false));
      }
      MOCK_ADDRESSES_STORAGE.push(newAddr);
      return newAddr;
    }
  },

  updateAddress: async (id: string, addressData: Partial<Address>) => {
    try {
      const res: any = await apiClient.put(`/customer/addresses/${id}`, addressData);
      return res.address || res.data || res;
    } catch {
      const addr = MOCK_ADDRESSES_STORAGE.find((a) => a.id === id);
      if (addr) {
        if (addressData.isDefault) {
          MOCK_ADDRESSES_STORAGE.forEach((a) => (a.isDefault = false));
        }
        Object.assign(addr, addressData);
        return addr;
      }
      throw new Error('Address not found');
    }
  },

  deleteAddress: async (id: string) => {
    try {
      await apiClient.delete(`/customer/addresses/${id}`);
    } catch {
      const index = MOCK_ADDRESSES_STORAGE.findIndex((a) => a.id === id);
      if (index > -1) MOCK_ADDRESSES_STORAGE.splice(index, 1);
    }
  },

  setDefaultAddress: async (id: string) => {
    try {
      const res: any = await apiClient.patch(`/customer/addresses/${id}/default`);
      return res.address || res;
    } catch {
      MOCK_ADDRESSES_STORAGE.forEach((a) => (a.isDefault = a.id === id));
      return MOCK_ADDRESSES_STORAGE.find((a) => a.id === id);
    }
  },

  getReviews: async () => {
    try {
      const res: any = await apiClient.get('/customer/reviews');
      return res.data || res;
    } catch {
      const submitted = MOCK_REVIEWS;
      const eligible = MOCK_BOOKINGS_STORAGE.filter((b) => b.status === 'COMPLETED' && !submitted.some((r) => r.bookingId === b.id));
      return { submittedReviews: submitted, eligibleBookings: eligible };
    }
  },

  createReview: async (reviewData: { bookingId: string; rating: number; comment: string; workCategory?: string }) => {
    try {
      const res: any = await apiClient.post('/customer/reviews', reviewData);
      return res.review || res;
    } catch {
      const booking = MOCK_BOOKINGS_STORAGE.find((b) => b.id === reviewData.bookingId);
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        bookingId: reviewData.bookingId,
        customerId: 'usr-cust-1',
        customerName: 'Aarav Mehta',
        providerId: booking?.providerId || 'pro-1',
        rating: reviewData.rating,
        comment: reviewData.comment,
        workCategory: reviewData.workCategory || 'Service',
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };
      MOCK_REVIEWS.push(newReview);
      return newReview;
    }
  },

  getNotifications: async () => {
    try {
      const res: any = await apiClient.get('/customer/notifications');
      return res.data || res || [];
    } catch {
      return MOCK_NOTIFICATIONS_STORAGE;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await apiClient.patch('/customer/notifications/read-all');
    } catch {
      MOCK_NOTIFICATIONS_STORAGE.forEach((n) => (n.isRead = true));
    }
  },
};

// PROVIDER API METHODS
export const providerApi = {
  getDashboardSummary: async () => {
    try {
      const res: any = await apiClient.get('/provider/dashboard');
      return res.data || res;
    } catch {
      const todayJobs = MOCK_BOOKINGS_STORAGE.filter((b) => b.providerId === 'pro-1');
      return {
        provider: {
          id: 'pro-1',
          name: 'Rajesh Kumar',
          email: 'rajesh.electrician@trustedhands.in',
          avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80',
          businessName: 'Kumar Electrical Solutions',
          headline: 'Government Licensed Electrician — Residential Wiring & Safety Inspections',
          rating: 4.9,
          reviewCount: 128,
          verificationStatus: 'VERIFIED',
          isIdentityVerified: true,
          isBackgroundChecked: true,
          isOnline: true,
        },
        profileCompletionPercentage: 88,
        todayBookings: todayJobs,
        stats: {
          pendingAcceptance: 1,
          upcomingJobs: 2,
          completedJobs: 128,
          totalEarnings: 84500,
          thisMonthEarnings: 18900,
          rating: 4.9,
        },
      };
    }
  },

  getBookings: async (statusFilter?: string) => {
    try {
      const res: any = await apiClient.get('/provider/bookings', { params: { status: statusFilter } });
      return res.data || res || [];
    } catch {
      return MOCK_BOOKINGS_STORAGE;
    }
  },

  getBookingById: async (bookingId: string) => {
    try {
      const res: any = await apiClient.get(`/provider/bookings/${bookingId}`);
      return res.booking || res;
    } catch {
      const found = MOCK_BOOKINGS_STORAGE.find((b) => b.id === bookingId || b.bookingNumber === bookingId);
      if (!found) throw new Error('Booking not found');
      return found;
    }
  },

  updateBookingStatus: async (bookingId: string, action: 'ACCEPT' | 'DECLINE' | 'ON_THE_WAY' | 'START_SERVICE' | 'COMPLETE' | 'CANCEL', cancellationReason?: string) => {
    try {
      const res: any = await apiClient.patch(`/provider/bookings/${bookingId}/status`, { action, cancellationReason });
      return res.booking || res;
    } catch {
      const booking = MOCK_BOOKINGS_STORAGE.find((b) => b.id === bookingId);
      if (booking) {
        if (action === 'ACCEPT') booking.status = 'PROVIDER_ACCEPTED';
        else if (action === 'DECLINE' || action === 'CANCEL') {
          booking.status = 'CANCELLED';
          booking.cancellationReason = cancellationReason || 'Cancelled by provider';
        } else if (action === 'ON_THE_WAY') booking.status = 'PROVIDER_ON_THE_WAY';
        else if (action === 'START_SERVICE') booking.status = 'SERVICE_STARTED';
        else if (action === 'COMPLETE') {
          booking.status = 'COMPLETED';
          booking.completedAt = new Date().toISOString();
        }
        return booking;
      }
      throw new Error('Booking not found');
    }
  },

  getCalendar: async () => {
    try {
      const res: any = await apiClient.get('/provider/calendar');
      return res.data || res;
    } catch {
      return {
        availability: {
          isOnline: true,
          weeklySchedule: [
            { day: 'MONDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
            { day: 'TUESDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
            { day: 'WEDNESDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
            { day: 'THURSDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
            { day: 'FRIDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
            { day: 'SATURDAY', isAvailable: true, startTime: '10:00', endTime: '16:00' },
            { day: 'SUNDAY', isAvailable: false, startTime: '09:00', endTime: '18:00' },
          ],
          blackoutDates: [],
        },
        bookings: MOCK_BOOKINGS_STORAGE,
      };
    }
  },

  updateAvailability: async (availabilityData: any) => {
    try {
      const res: any = await apiClient.put('/provider/availability', availabilityData);
      return res.availability || res;
    } catch {
      return availabilityData;
    }
  },

  getServices: async () => {
    try {
      const res: any = await apiClient.get('/provider/services');
      return res.data || res || [];
    } catch {
      return MOCK_SERVICES.filter((s) => ['srv-elec-1', 'srv-elec-2', 'srv-elec-3'].includes(s.id));
    }
  },

  createService: async (serviceData: any) => {
    try {
      const res: any = await apiClient.post('/provider/services', serviceData);
      return res.service || res;
    } catch {
      const newSrv: Service = {
        id: `srv-${Date.now()}`,
        categoryId: serviceData.categoryId,
        title: serviceData.title,
        slug: serviceData.title.toLowerCase().replace(/\s+/g, '-'),
        description: serviceData.description,
        basePrice: serviceData.basePrice,
        priceType: serviceData.priceType || 'FIXED',
        estimatedDurationMinutes: serviceData.estimatedDurationMinutes || 60,
        includedTasks: serviceData.includedTasks || [],
        isActive: true,
      };
      MOCK_SERVICES.push(newSrv);
      return newSrv;
    }
  },

  updateService: async (id: string, serviceData: Partial<Service>) => {
    try {
      const res: any = await apiClient.put(`/provider/services/${id}`, serviceData);
      return res.service || res;
    } catch {
      const s = MOCK_SERVICES.find((serv) => serv.id === id);
      if (s) Object.assign(s, serviceData);
      return s;
    }
  },

  deleteService: async (id: string) => {
    try {
      await apiClient.delete(`/provider/services/${id}`);
    } catch {
      const s = MOCK_SERVICES.find((serv) => serv.id === id);
      if (s) s.isActive = false;
    }
  },

  getProfile: async () => {
    try {
      const res: any = await apiClient.get('/provider/profile');
      return res.data || res;
    } catch {
      return { user: MOCK_PROVIDERS[0].user, provider: MOCK_PROVIDERS[0] };
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const res: any = await apiClient.put('/provider/profile', profileData);
      return res.provider || res;
    } catch {
      Object.assign(MOCK_PROVIDERS[0], profileData);
      return MOCK_PROVIDERS[0];
    }
  },

  addPortfolioItem: async (item: { title: string; description: string; imageUrl: string; category?: string }) => {
    try {
      const res: any = await apiClient.post('/provider/portfolio', item);
      return res.portfolio || res;
    } catch {
      if (!MOCK_PROVIDERS[0].portfolio) MOCK_PROVIDERS[0].portfolio = [];
      const newItem: PortfolioItem = {
        id: `port-${Date.now()}`,
        ...item,
        createdAt: new Date().toISOString(),
      };
      MOCK_PROVIDERS[0].portfolio.push(newItem);
      return MOCK_PROVIDERS[0].portfolio;
    }
  },

  deletePortfolioItem: async (id: string) => {
    try {
      const res: any = await apiClient.delete(`/provider/portfolio/${id}`);
      return res.portfolio || res;
    } catch {
      if (MOCK_PROVIDERS[0].portfolio) {
        MOCK_PROVIDERS[0].portfolio = MOCK_PROVIDERS[0].portfolio.filter((p) => p.id !== id);
      }
      return MOCK_PROVIDERS[0].portfolio;
    }
  },

  getEarnings: async () => {
    try {
      const res: any = await apiClient.get('/provider/earnings');
      return res.data || res;
    } catch {
      return {
        totalEarnings: 84500,
        thisMonthEarnings: 18900,
        lastMonthEarnings: 22400,
        pendingAmount: 898,
        availablePayout: 84500,
        completedJobsCount: 128,
        ledger: [
          {
            bookingId: 'TH-BK-774120',
            date: '2026-08-10T16:00:00Z',
            service: 'Ceiling Fan & Wall Light Installation',
            customer: 'Anita Sharma',
            grossAmount: 449,
            platformFee: 50,
            netEarnings: 399,
            status: 'COMPLETED',
          },
          {
            bookingId: 'TH-BK-552091',
            date: '2026-08-05T14:30:00Z',
            service: 'Complete Home Electrical Safety Audit',
            customer: 'Rohan Deshmukh',
            grossAmount: 899,
            platformFee: 100,
            netEarnings: 799,
            status: 'COMPLETED',
          },
        ],
        transactions: [],
      };
    }
  },

  getReviews: async () => {
    try {
      const res: any = await apiClient.get('/provider/reviews');
      return res.data || res;
    } catch {
      return {
        averageRating: 4.9,
        totalReviews: 128,
        distribution: { 5: 110, 4: 15, 3: 3, 2: 0, 1: 0 },
        reviews: MOCK_REVIEWS,
      };
    }
  },

  respondToReview: async (reviewId: string, comment: string) => {
    try {
      const res: any = await apiClient.post(`/provider/reviews/${reviewId}/respond`, { comment });
      return res.review || res;
    } catch {
      const rev = MOCK_REVIEWS.find((r) => r.id === reviewId);
      if (rev) {
        rev.providerResponse = { comment, createdAt: new Date().toISOString() };
      }
      return rev;
    }
  },
};
