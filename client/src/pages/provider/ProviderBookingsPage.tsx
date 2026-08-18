import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, PhoneCall, Check, X, Navigation, Play, CheckCircle2 } from 'lucide-react';
import { providerApi } from '../../services/dashboardService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ProviderBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('PENDING');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await providerApi.getBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Error loading provider bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusAction = async (bookingId: string, action: 'ACCEPT' | 'DECLINE' | 'ON_THE_WAY' | 'START_SERVICE' | 'COMPLETE' | 'CANCEL') => {
    setActionLoading(bookingId);
    try {
      await providerApi.updateBookingStatus(bookingId, action);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'PENDING') return b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (activeTab === 'UPCOMING') return b.status === 'PROVIDER_ACCEPTED' || b.status === 'PROVIDER_ON_THE_WAY';
    if (activeTab === 'IN_PROGRESS') return b.status === 'SERVICE_STARTED' || b.status === 'IN_PROGRESS';
    return b.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Provider Bookings</h1>
        <p className="text-sm text-charcoal-muted mt-1">Manage service requests and update job progress in real time.</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex border-b border-mist/80 space-x-6 text-sm font-semibold overflow-x-auto">
        {(['PENDING', 'UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 shrink-0 transition-all relative capitalize ${
              activeTab === tab ? 'text-brand font-bold' : 'text-charcoal-muted hover:text-ink'
            }`}
          >
            {tab.replace('_', ' ').toLowerCase()}
            {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full"></span>}
          </button>
        ))}
      </div>

      {/* BOOKING CARDS */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-bone rounded-xl"></div>
          <div className="h-40 bg-bone rounded-xl"></div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-bone border border-mist rounded-xl p-5 shadow-subtle space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mist pb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-mono font-semibold uppercase text-charcoal-subtle">
                      #{b.bookingNumber}
                    </span>
                    <Badge variant={b.status === 'COMPLETED' ? 'outline' : b.status === 'CANCELLED' ? 'secondary' : 'verified'}>
                      {b.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink">{b.service?.title || 'Service Job'}</h3>
                  <p className="text-sm font-medium text-brand">
                    Customer: <span className="text-ink font-semibold">{b.customer?.name || 'Anita Sharma'}</span>
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-xs text-charcoal-muted block">Net Earnings</span>
                  <span className="text-xl font-serif font-bold text-slate">₹{b.providerEarnings}</span>
                </div>
              </div>

              {/* DETAILS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium text-charcoal">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-brand shrink-0" />
                  <span>Date: {b.scheduledDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <span>Slot: {b.scheduledTimeSlot}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-brand shrink-0" />
                  <span>Location: {b.serviceAddress?.street || 'South Delhi'}</span>
                </div>
              </div>

              {b.specialInstructions && (
                <p className="text-xs text-charcoal-muted bg-parchment/60 p-2.5 rounded-lg border border-mist italic">
                  Note: "{b.specialInstructions}"
                </p>
              )}

              {/* CONTROLLED STATE MACHINE ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-mist/80">
                <a href={`tel:${b.customer?.phone || '+919811255901'}`}>
                  <Button variant="outline" size="sm">
                    <PhoneCall className="w-3.5 h-3.5 mr-1.5" /> Call Customer
                  </Button>
                </a>

                <div className="flex items-center space-x-2">
                  {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusAction(b.id, 'DECLINE')}
                        disabled={actionLoading === b.id}
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusAction(b.id, 'ACCEPT')}
                        disabled={actionLoading === b.id}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> ACCEPT BOOKING
                      </Button>
                    </>
                  )}

                  {b.status === 'PROVIDER_ACCEPTED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusAction(b.id, 'ON_THE_WAY')}
                      disabled={actionLoading === b.id}
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1.5" /> Mark On The Way
                    </Button>
                  )}

                  {b.status === 'PROVIDER_ON_THE_WAY' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusAction(b.id, 'START_SERVICE')}
                      disabled={actionLoading === b.id}
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Start Service Work
                    </Button>
                  )}

                  {(b.status === 'SERVICE_STARTED' || b.status === 'IN_PROGRESS') && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusAction(b.id, 'COMPLETE')}
                      disabled={actionLoading === b.id}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> MARK COMPLETED
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl p-12 text-center text-charcoal-muted">
          <p className="text-sm">No {activeTab.toLowerCase().replace('_', ' ')} bookings.</p>
        </div>
      )}
    </div>
  );
};

export default ProviderBookingsPage;
