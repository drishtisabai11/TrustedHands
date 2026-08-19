import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getCustomerById(id!);
      setData(res);
    } catch (err) {
      console.error('Failed to load customer profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!data?.user) return;
    const currentStatus = data.user.status;
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    const reason = prompt(`Enter reason for updating account status to ${nextStatus}:`) || 'Admin update';
    try {
      await adminService.updateCustomerStatus(data.user._id, nextStatus, reason);
      fetchCustomer();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-charcoal-muted font-sans">Loading customer record...</div>;
  }

  if (!data || !data.user) {
    return (
      <div className="space-y-4 font-sans">
        <Link to="/admin/customers" className="text-xs text-crimson hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          Customer record not found.
        </div>
      </div>
    );
  }

  const user = data.user;
  const stats = data.stats || { totalBookings: 0, completedBookings: 0, cancelledBookings: 0, totalSpending: 0 };
  const bookings = data.bookings || [];

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/customers" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Customer List
      </Link>

      {/* Customer Overview Card */}
      <div className="bg-bone border border-mist rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-crimson text-parchment font-serif font-bold text-2xl flex items-center justify-center border-2 border-burgundy">
            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-ink font-bold">{user.name}</h2>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  user.status === 'ACTIVE' ? 'bg-seafoam/20 text-seafoam' : 'bg-crimson/10 text-crimson'
                }`}
              >
                {user.status}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-1">{user.email} • {user.phone || 'No phone'}</p>
            <p className="text-[11px] text-mineral mt-0.5">Customer ID: {user._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              user.status === 'SUSPENDED'
                ? 'bg-seafoam text-parchment border-seafoam'
                : 'bg-crimson/10 text-crimson border-crimson/30 hover:bg-crimson hover:text-parchment'
            }`}
          >
            {user.status === 'SUSPENDED' ? 'Reactivate Account' : 'Suspend Account'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Total Bookings</div>
          <div className="text-2xl font-serif font-bold text-ink">{stats.totalBookings}</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Completed Jobs</div>
          <div className="text-2xl font-serif font-bold text-seafoam">{stats.completedBookings}</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Cancelled Jobs</div>
          <div className="text-2xl font-serif font-bold text-crimson">{stats.cancelledBookings}</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Total Lifetime Spend</div>
          <div className="text-2xl font-serif font-bold text-ink">₹{stats.totalSpending.toLocaleString()}</div>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="bg-bone border border-mist rounded-xl p-6 space-y-4">
        <h3 className="font-serif text-lg text-ink font-semibold">Booking History</h3>
        {bookings.length === 0 ? (
          <div className="text-xs text-charcoal-muted py-4">No booking history recorded for this customer.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Booking ID</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/60">
                {bookings.map((b: any) => (
                  <tr key={b._id}>
                    <td className="py-2.5 px-3 font-bold text-ink">#{b.bookingNumber}</td>
                    <td className="py-2.5 px-3">{b.service?.title || 'Service'}</td>
                    <td className="py-2.5 px-3 text-charcoal-muted">{b.scheduledDate}</td>
                    <td className="py-2.5 px-3 font-semibold text-ink">₹{b.totalAmount}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint text-ink">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link to={`/admin/bookings/${b._id}`} className="text-crimson font-semibold hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
