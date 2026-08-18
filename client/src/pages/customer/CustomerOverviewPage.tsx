import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Search,
  Bookmark,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { customerApi } from '../../services/dashboardService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CustomerOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [bookingFilter, setBookingFilter] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sum, bks] = await Promise.all([
          customerApi.getDashboardSummary(),
          customerApi.getBookings(),
        ]);
        setSummaryData(sum);
        setRecentBookings(bks || []);
      } catch (err) {
        console.error('Error loading customer dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingBooking: Booking | null = summaryData?.upcomingBooking || null;

  const filteredBookings = recentBookings.filter((b) => {
    if (bookingFilter === 'UPCOMING') {
      return ['PENDING', 'CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'IN_PROGRESS'].includes(b.status);
    }
    return b.status === bookingFilter;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PROVIDER_ACCEPTED':
        return <Badge variant="verified">Confirmed</Badge>;
      case 'PROVIDER_ON_THE_WAY':
        return <Badge variant="verified">On The Way</Badge>;
      case 'SERVICE_STARTED':
      case 'IN_PROGRESS':
        return <Badge variant="primary">Service Started</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-bone rounded-xl"></div>
        <div className="h-48 bg-bone rounded-xl"></div>
        <div className="h-32 bg-bone rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER SECTION */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Friend'}.
        </h1>
        <p className="text-sm text-charcoal-muted mt-1">
          Here's what's happening with your Trusted Hands bookings.
        </p>
      </div>

      {/* 2. ACTIVE UPCOMING BOOKING FOCUS CARD OR NO UPCOMING EMPTY STATE */}
      {upcomingBooking ? (
        <div className="bg-bone border-2 border-brand/30 rounded-2xl p-6 shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand/10 px-4 py-1.5 rounded-bl-xl border-l border-b border-brand/20">
            <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Upcoming Service
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-subtle">
                  Booking #{upcomingBooking.bookingNumber}
                </span>
                {formatStatusBadge(upcomingBooking.status)}
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-ink">
                  {upcomingBooking.service?.title || 'Home Service'}
                </h3>
                <p className="text-sm font-medium text-charcoal mt-0.5">
                  with{' '}
                  <span className="text-brand font-semibold">
                    {upcomingBooking.provider?.user?.name || upcomingBooking.provider?.businessName || 'Rajesh Kumar'}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-charcoal-muted pt-1">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand" />
                  <span>{upcomingBooking.scheduledDate}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-brand" />
                  <span>{upcomingBooking.scheduledTimeSlot}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>{upcomingBooking.serviceAddress?.city || 'Home Visit'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-mist">
              <div className="text-left md:text-right pr-4 hidden sm:block">
                <span className="text-xs text-charcoal-muted block">Total Amount</span>
                <span className="text-lg font-serif font-bold text-slate">₹{upcomingBooking.totalAmount}</span>
              </div>

              <Link to={`/dashboard/bookings/${upcomingBooking.id}`}>
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  View Booking Details
                </Button>
              </Link>

              <a href={`tel:${upcomingBooking.provider?.user?.phone || '+919820099881'}`}>
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  <PhoneCall className="w-4 h-4 mr-2" /> Contact Professional
                </Button>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-bone border border-mist/80 rounded-2xl p-6 sm:p-8 text-center shadow-subtle">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate">Nothing scheduled yet.</h3>
            <p className="text-sm text-charcoal-muted">
              Find a background-verified local professional for your next repair, installation, or home service job.
            </p>
            <div className="pt-2">
              <Link to="/providers">
                <Button variant="primary" size="md">
                  <Search className="w-4 h-4 mr-2" /> Find a Professional
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. QUICK ACTIONS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/providers"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand hover:shadow-subtle transition-all flex flex-col justify-between group"
          >
            <Search className="w-5 h-5 text-brand mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-ink group-hover:text-brand">Find a Professional</span>
          </Link>

          <Link
            to="/dashboard/bookings"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand hover:shadow-subtle transition-all flex flex-col justify-between group"
          >
            <Calendar className="w-5 h-5 text-slate mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-ink group-hover:text-brand">View All Bookings</span>
          </Link>

          <Link
            to="/dashboard/saved"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand hover:shadow-subtle transition-all flex flex-col justify-between group"
          >
            <Bookmark className="w-5 h-5 text-sage-dark mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-ink group-hover:text-brand">Saved Professionals</span>
          </Link>

          <Link
            to="/dashboard/addresses"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand hover:shadow-subtle transition-all flex flex-col justify-between group"
          >
            <MapPin className="w-5 h-5 text-brand mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-ink group-hover:text-brand">Manage Addresses</span>
          </Link>
        </div>
      </div>

      {/* 4. BOOKING OVERVIEW LIST WITH TABS */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mist/80 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate">Booking Overview</h2>
            <p className="text-xs text-charcoal-muted">Track past and ongoing service appointments</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-parchment p-1 rounded-lg border border-mist text-xs font-semibold">
            <button
              type="button"
              onClick={() => setBookingFilter('UPCOMING')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                bookingFilter === 'UPCOMING' ? 'bg-brand text-bone shadow-xs' : 'text-charcoal hover:text-ink'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setBookingFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                bookingFilter === 'COMPLETED' ? 'bg-brand text-bone shadow-xs' : 'text-charcoal hover:text-ink'
              }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setBookingFilter('CANCELLED')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                bookingFilter === 'CANCELLED' ? 'bg-brand text-bone shadow-xs' : 'text-charcoal hover:text-ink'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* BOOKING CARDS LIST */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-3">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 border border-mist rounded-xl hover:border-brand/40 hover:bg-parchment/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-ink">{b.service?.title || 'Service Task'}</span>
                    <span className="text-xs text-charcoal-subtle">·</span>
                    <span className="text-xs font-semibold text-brand">
                      {b.provider?.user?.name || b.provider?.businessName || 'Provider'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-muted">
                    <span>{b.scheduledDate}</span>
                    <span>·</span>
                    <span>{b.scheduledTimeSlot}</span>
                    <span>·</span>
                    <span>{b.serviceAddress?.city || 'Delhi'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate block">₹{b.totalAmount}</span>
                    <div className="mt-0.5">{formatStatusBadge(b.status)}</div>
                  </div>

                  <Link
                    to={`/dashboard/bookings/${b.id}`}
                    className="text-brand font-medium text-xs flex items-center hover:underline group"
                  >
                    <span>VIEW</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-charcoal-muted">
            <p className="text-sm">No {bookingFilter.toLowerCase()} bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOverviewPage;
