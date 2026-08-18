import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, Search } from 'lucide-react';
import { customerApi } from '../../services/dashboardService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';

export const CustomerBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await customerApi.getBookings();
        setBookings(data || []);
      } catch (err) {
        console.error('Error loading bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'UPCOMING') {
      return ['PENDING', 'CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'IN_PROGRESS'].includes(b.status);
    }
    return b.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">My Bookings</h1>
        <p className="text-sm text-charcoal-muted mt-1">Manage and track your service bookings on Trusted Hands.</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex border-b border-mist/80 space-x-6 text-sm font-semibold">
        {(['UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-all relative capitalize ${
              activeTab === tab ? 'text-brand font-bold' : 'text-charcoal-muted hover:text-ink'
            }`}
          >
            {tab.toLowerCase()}
            {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full"></span>}
          </button>
        ))}
      </div>

      {/* BOOKING CARDS */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-bone rounded-xl"></div>
          <div className="h-32 bg-bone rounded-xl"></div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-bone border border-mist rounded-xl p-5 hover:border-brand/40 hover:shadow-subtle transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-subtle">
                    #{b.bookingNumber}
                  </span>
                  <Badge variant={b.status === 'COMPLETED' ? 'outline' : b.status === 'CANCELLED' ? 'secondary' : 'verified'}>
                    {b.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">{b.service?.title || 'Service Booking'}</h3>
                  <p className="text-sm text-charcoal">
                    with{' '}
                    <span className="font-semibold text-brand">
                      {b.provider?.user?.name || b.provider?.businessName || 'Rajesh Kumar'}
                    </span>
                    <span className="text-xs text-charcoal-muted ml-2">({b.provider?.headline || 'Licensed Tradesperson'})</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-charcoal-muted">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    <span>{b.scheduledDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-brand" />
                    <span>{b.scheduledTimeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    <span>{b.serviceAddress?.city || 'Delhi'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-6 shrink-0 border-t md:border-t-0 border-mist pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-charcoal-muted block">Amount</span>
                  <span className="text-base font-serif font-bold text-slate">₹{b.totalAmount}</span>
                </div>

                <Link
                  to={`/dashboard/bookings/${b.id}`}
                  className="px-4 py-2 bg-brand text-bone text-xs font-bold rounded-lg hover:bg-brand-hover transition-colors flex items-center"
                >
                  <span>VIEW BOOKING</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl p-12 text-center space-y-3">
          <p className="font-serif text-lg font-bold text-slate">Your next booking will appear here.</p>
          <p className="text-sm text-charcoal-muted max-w-sm mx-auto">
            Book trusted electrical, plumbing, carpentry, or cleaning professionals for your home.
          </p>
          <div className="pt-2">
            <Link
              to="/providers"
              className="inline-flex items-center px-4 py-2 bg-brand text-bone text-sm font-semibold rounded-lg hover:bg-brand-hover"
            >
              <Search className="w-4 h-4 mr-2" /> Browse Professionals
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookingsPage;
