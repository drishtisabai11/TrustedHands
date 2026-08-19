import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CalendarCheck, Eye, Download } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    fetchBookings(1);
  }, [statusFilter]);

  const fetchBookings = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await adminService.getBookings(query, statusFilter, page, 10);
      setBookings(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(1);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-crimson" /> Booking Master Registry
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Search marketplace bookings, monitor service fulfillment timelines, and handle interventions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => adminService.exportData('bookings')} className="text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Bookings CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-bone border border-mist p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-mineral absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Booking ID (e.g. TH-2026-8891)..."
              className="w-full pl-9 pr-3 py-2 bg-parchment border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson"
            />
          </div>
          <Button type="submit" variant="cta" size="sm" className="text-xs">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-charcoal-muted">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-parchment border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson font-medium text-ink"
          >
            <option value="">All Booking Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="DISPUTED">DISPUTED</option>
          </select>
        </div>
      </div>

      {/* Table / Mobile Cards */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          No booking records found.
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-bone border border-mist rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Booking ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/60">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-parchment/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ink">#{b.bookingNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-charcoal">{b.customer?.name || 'Customer'}</td>
                    <td className="py-3.5 px-4 text-charcoal-muted">{b.provider?.user?.name || 'Provider'}</td>
                    <td className="py-3.5 px-4 font-medium text-ink">{b.service?.title || 'Service'}</td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {b.scheduledDate} ({b.scheduledTimeSlot})
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-ink">₹{b.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'COMPLETED'
                            ? 'bg-seafoam/20 text-seafoam'
                            : b.status === 'CANCELLED'
                            ? 'bg-crimson/10 text-crimson'
                            : 'bg-amber-500/10 text-amber-900'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/admin/bookings/${b._id}`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked View */}
          <div className="md:hidden space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="bg-bone border border-mist rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-ink">#{b.bookingNumber}</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-mint text-ink">{b.status}</span>
                </div>
                <div>{b.service?.title}</div>
                <div className="text-charcoal-muted">
                  Customer: {b.customer?.name} • Provider: {b.provider?.user?.name}
                </div>
                <div className="pt-2 border-t border-mist/60 flex justify-between items-center">
                  <span className="font-serif font-bold text-ink">₹{b.totalAmount}</span>
                  <Link to={`/admin/bookings/${b._id}`}>
                    <Button variant="outline" size="sm" className="text-xs py-1 px-2">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center text-xs text-charcoal-muted pt-4">
              <span>
                Page {pagination.page} of {pagination.pages} ({pagination.total} total bookings)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchBookings(pagination.page - 1)}
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchBookings(pagination.page + 1)}
                  className="text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
