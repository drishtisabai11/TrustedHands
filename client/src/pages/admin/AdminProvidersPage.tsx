import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Clock, Eye, Download } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    fetchProviders(1);
  }, [statusFilter]);

  const fetchProviders = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await adminService.getProviders(query, statusFilter, page, 10);
      setProviders(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders(1);
  };

  const handleStatusTransition = async (id: string, nextStatus: string) => {
    const reason = prompt(`Reason for setting status to ${nextStatus}:`) || 'Admin status change';
    try {
      await adminService.updateProviderVerification(id, nextStatus, reason);
      fetchProviders(pagination.page);
    } catch (err: any) {
      alert(err.message || 'Status transition failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Pending Alert Link */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-crimson" /> Provider Management & Verification
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Manage provider profiles, review verification credentials, approve professionals, and monitor ratings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/providers/pending">
            <Button variant="cta" size="sm" className="text-xs">
              <Clock className="w-3.5 h-3.5 mr-1.5" /> Pending Verification Queue
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => adminService.exportData('providers')} className="text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </Button>
        </div>
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
              placeholder="Search by provider name, business, headline, or city..."
              className="w-full pl-9 pr-3 py-2 bg-parchment border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson"
            />
          </div>
          <Button type="submit" variant="cta" size="sm" className="text-xs">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-charcoal-muted">Verification Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-parchment border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson font-medium text-ink"
          >
            <option value="">All Verification Statuses</option>
            <option value="APPROVED">APPROVED</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="REJECTED">REJECTED</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View / Mobile Cards */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading providers...</div>
      ) : providers.length === 0 ? (
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          No provider profiles match the filter criteria.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-bone border border-mist rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Provider / Business</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Hourly Rate</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist/60">
                {providers.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-parchment/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-ink text-sm">{p.businessName || p.user?.name}</div>
                      <div className="text-[11px] text-charcoal-muted line-clamp-1">{p.headline}</div>
                      <div className="text-[10px] text-mineral">{p.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {p.city}, {p.state}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-ink">₹{p.hourlyRate}/hr</td>
                    <td className="py-3.5 px-4 font-bold text-ink">
                      ★ {p.rating || 5.0} <span className="text-[10px] font-normal text-charcoal-muted">({p.reviewCount || 0})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.verificationStatus === 'APPROVED' || p.verificationStatus === 'VERIFIED'
                            ? 'bg-seafoam/20 text-seafoam border border-seafoam/30'
                            : p.verificationStatus === 'SUBMITTED' || p.verificationStatus === 'UNDER_REVIEW'
                            ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                            : 'bg-crimson/10 text-crimson border border-crimson/30'
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link to={`/admin/providers/${p._id || p.id}`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                          <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                        </Button>
                      </Link>
                      {p.verificationStatus !== 'SUSPENDED' ? (
                        <button
                          onClick={() => handleStatusTransition(p._id || p.id, 'SUSPENDED')}
                          className="px-2.5 py-1 bg-crimson/10 text-crimson hover:bg-crimson hover:text-parchment rounded text-xs font-semibold transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusTransition(p._id || p.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-seafoam text-parchment hover:bg-seafoam/90 rounded text-xs font-semibold transition-colors"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked View */}
          <div className="md:hidden space-y-3">
            {providers.map((p) => (
              <div key={p._id || p.id} className="bg-bone border border-mist rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-ink text-sm">{p.businessName || p.user?.name}</h4>
                    <p className="text-xs text-charcoal-muted">{p.headline}</p>
                    <p className="text-xs text-mineral">{p.city}, ₹{p.hourlyRate}/hr</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.verificationStatus === 'APPROVED' ? 'bg-seafoam/20 text-seafoam' : 'bg-crimson/10 text-crimson'
                    }`}
                  >
                    {p.verificationStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-mist/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-ink">Rating: ★ {p.rating}</span>
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/providers/${p._id || p.id}`}>
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center text-xs text-charcoal-muted pt-4">
              <span>
                Page {pagination.page} of {pagination.pages} ({pagination.total} total providers)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchProviders(pagination.page - 1)}
                  className="text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchProviders(pagination.page + 1)}
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
