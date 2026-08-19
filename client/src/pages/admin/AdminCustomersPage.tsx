import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Download, Users } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    fetchCustomers(1);
  }, [statusFilter]);

  const fetchCustomers = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await adminService.getCustomers(query, statusFilter, page, 10);
      setCustomers(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(1);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    const reason = prompt(`Enter reason for changing status to ${nextStatus}:`) || 'Admin status toggle';
    try {
      await adminService.updateCustomerStatus(id, nextStatus, reason);
      fetchCustomers(pagination.page);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-crimson" /> Customer Management
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">Search, filter, inspect profiles, and manage customer account statuses</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => adminService.exportData('customers')} className="text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Customers CSV
        </Button>
      </div>

      {/* Filters Form */}
      <div className="bg-bone border border-mist p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-mineral absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, or customer ID..."
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
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table for Desktop / Stacked Cards for Mobile */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading customer directory...</div>
      ) : customers.length === 0 ? (
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          No customers found matching the search criteria.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-bone border border-mist rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/60">
                {customers.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-parchment/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-ink text-sm">{c.name}</div>
                      <div className="text-[11px] text-charcoal-muted">ID: {c._id || c.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal">{c.email}</div>
                      <div className="text-[11px] text-mineral">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'ACTIVE'
                            ? 'bg-seafoam/20 text-seafoam border border-seafoam/30'
                            : 'bg-crimson/10 text-crimson border border-crimson/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link to={`/admin/customers/${c._id || c.id}`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(c._id || c.id, c.status)}
                        className={`px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
                          c.status === 'SUSPENDED'
                            ? 'bg-seafoam text-parchment border-seafoam hover:bg-seafoam/90'
                            : 'bg-crimson/10 text-crimson border-crimson/30 hover:bg-crimson hover:text-parchment'
                        }`}
                      >
                        {c.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="md:hidden space-y-3">
            {customers.map((c) => (
              <div key={c._id || c.id} className="bg-bone border border-mist rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-ink text-sm">{c.name}</h4>
                    <p className="text-xs text-charcoal-muted">{c.email}</p>
                    <p className="text-xs text-mineral">{c.phone || 'No phone'}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'ACTIVE' ? 'bg-seafoam/20 text-seafoam' : 'bg-crimson/10 text-crimson'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-mist/60 flex items-center justify-between text-xs">
                  <span className="text-charcoal-muted">Joined {new Date(c.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/customers/${c._id || c.id}`}>
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2">
                        View
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(c._id || c.id, c.status)}
                      className="px-2 py-1 bg-crimson/10 text-crimson rounded font-semibold text-xs"
                    >
                      {c.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center text-xs text-charcoal-muted pt-4">
              <span>
                Page {pagination.page} of {pagination.pages} ({pagination.total} total customers)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchCustomers(pagination.page - 1)}
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchCustomers(pagination.page + 1)}
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
