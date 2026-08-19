import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getBookingById(id!);
      setData(res);
    } catch (err) {
      console.error('Failed to load booking detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAction = async (newStatus: string) => {
    const reason = prompt(`Enter administrative note/reason for updating status to ${newStatus}:`) || 'Admin update';
    try {
      await adminService.updateBookingAdmin(id!, newStatus, reason, reason);
      fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-charcoal-muted font-sans">Loading booking details...</div>;
  }

  if (!data || !data.booking) {
    return (
      <div className="space-y-4 font-sans">
        <Link to="/admin/bookings" className="text-xs text-crimson hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </Link>
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          Booking record not found.
        </div>
      </div>
    );
  }

  const b = data.booking;
  const p = data.payment;

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/bookings" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Booking Registry
      </Link>

      {/* Booking Header Overview */}
      <div className="bg-bone border border-mist rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl text-ink font-bold">Booking #{b.bookingNumber}</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                b.status === 'COMPLETED'
                  ? 'bg-seafoam/20 text-seafoam'
                  : b.status === 'CANCELLED'
                  ? 'bg-crimson/10 text-crimson'
                  : 'bg-amber-500/20 text-amber-900'
              }`}
            >
              {b.status}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1">Service: {b.service?.title || 'Service'}</p>
        </div>

        <div className="flex items-center gap-2">
          {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
            <>
              <button
                onClick={() => handleAdminAction('CANCELLED')}
                className="px-3.5 py-2 bg-crimson/10 text-crimson font-semibold text-xs rounded-lg hover:bg-crimson hover:text-parchment"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => handleAdminAction('COMPLETED')}
                className="px-3.5 py-2 bg-seafoam text-parchment font-semibold text-xs rounded-lg hover:bg-seafoam/90"
              >
                Mark Completed
              </button>
            </>
          )}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Total Customer Payment</div>
          <div className="text-2xl font-serif font-bold text-ink">₹{b.totalAmount}</div>
          <div className="text-[11px] text-seafoam font-semibold mt-1">
            Status: {b.paymentStatus} {p?.method ? `(${p.method})` : ''}
          </div>
        </div>

        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Platform Commission Fee</div>
          <div className="text-2xl font-serif font-bold text-crimson">₹{b.platformFee}</div>
          <div className="text-[11px] text-crimson font-semibold mt-1">Retained Platform Revenue</div>
        </div>

        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Provider Earnings</div>
          <div className="text-2xl font-serif font-bold text-ink">₹{b.providerEarnings}</div>
          <div className="text-[11px] text-charcoal-muted mt-1">Payout to Provider</div>
        </div>
      </div>

      {/* Parties & Schedule Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-bone border border-mist rounded-xl p-6 space-y-3">
          <h3 className="font-serif text-lg text-ink font-semibold border-b border-mist pb-2">Customer Details</h3>
          <div className="text-xs space-y-1">
            <div className="font-bold text-ink text-sm">{b.customer?.name}</div>
            <div className="text-charcoal-muted">Email: {b.customer?.email}</div>
            <div className="text-charcoal-muted">Phone: {b.customer?.phone || 'N/A'}</div>
          </div>
        </div>

        {/* Provider Information */}
        <div className="bg-bone border border-mist rounded-xl p-6 space-y-3">
          <h3 className="font-serif text-lg text-ink font-semibold border-b border-mist pb-2">Provider Details</h3>
          <div className="text-xs space-y-1">
            <div className="font-bold text-ink text-sm">{b.provider?.user?.name}</div>
            <div className="text-charcoal-muted">Email: {b.provider?.user?.email}</div>
            <div className="text-charcoal-muted">Phone: {b.provider?.user?.phone || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Service Address & Instructions */}
      <div className="bg-bone border border-mist rounded-xl p-6 space-y-3">
        <h3 className="font-serif text-lg text-ink font-semibold">Scheduled Appointment & Address</h3>
        <div className="text-xs space-y-2">
          <div>
            <span className="font-semibold text-charcoal-muted">Date & Slot:</span> {b.scheduledDate} ({b.scheduledTimeSlot})
          </div>
          {b.serviceAddress && (
            <div>
              <span className="font-semibold text-charcoal-muted">Address:</span> {b.serviceAddress.street}, {b.serviceAddress.city}, {b.serviceAddress.state} - {b.serviceAddress.postalCode}
            </div>
          )}
          {b.specialInstructions && (
            <div>
              <span className="font-semibold text-charcoal-muted">Customer Special Notes:</span> "{b.specialInstructions}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
