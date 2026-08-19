import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getProviderById(id!);
      setData(res);
    } catch (err) {
      console.error('Failed to fetch provider detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const reason = prompt(`Reason for setting verification status to ${newStatus}:`) || 'Admin update';
    try {
      await adminService.updateProviderVerification(id!, newStatus, reason);
      fetchProvider();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-charcoal-muted font-sans">Loading provider profile...</div>;
  }

  if (!data || !data.provider) {
    return (
      <div className="space-y-4 font-sans">
        <Link to="/admin/providers" className="text-xs text-crimson hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Providers
        </Link>
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          Provider profile not found.
        </div>
      </div>
    );
  }

  const p = data.provider;
  const stats = data.stats || { totalJobs: 0, completedJobs: 0, cancelledJobs: 0, cancellationRate: 0, totalEarnings: 0 };

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/providers" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Provider Master Directory
      </Link>

      {/* Header Profile Summary */}
      <div className="bg-bone border border-mist rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-burgundy text-parchment font-serif font-bold text-2xl flex items-center justify-center border-2 border-crimson">
            {p.businessName ? p.businessName.charAt(0).toUpperCase() : p.user?.name ? p.user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-ink font-bold">{p.businessName || p.user?.name}</h2>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  p.verificationStatus === 'APPROVED' || p.verificationStatus === 'VERIFIED'
                    ? 'bg-seafoam/20 text-seafoam'
                    : 'bg-crimson/10 text-crimson'
                }`}
              >
                {p.verificationStatus}
              </span>
            </div>
            <p className="text-xs font-semibold text-charcoal mt-1">{p.headline}</p>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Owner: {p.user?.name} ({p.user?.email}) • {p.city}, {p.state} • ₹{p.hourlyRate}/hr
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {p.verificationStatus !== 'APPROVED' && (
            <button
              onClick={() => handleStatusChange('APPROVED')}
              className="px-3.5 py-2 bg-seafoam text-parchment font-semibold text-xs rounded-lg hover:bg-seafoam/90"
            >
              Approve Provider
            </button>
          )}
          {p.verificationStatus !== 'SUSPENDED' && (
            <button
              onClick={() => handleStatusChange('SUSPENDED')}
              className="px-3.5 py-2 bg-crimson/10 text-crimson font-semibold text-xs rounded-lg hover:bg-crimson hover:text-parchment"
            >
              Suspend Provider
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Rating</div>
          <div className="text-2xl font-serif font-bold text-ink">★ {p.rating}</div>
          <div className="text-[10px] text-charcoal-muted">({p.reviewCount} Reviews)</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Total Jobs</div>
          <div className="text-2xl font-serif font-bold text-ink">{stats.totalJobs}</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Completed Jobs</div>
          <div className="text-2xl font-serif font-bold text-seafoam">{stats.completedJobs}</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Cancellation Rate</div>
          <div className="text-2xl font-serif font-bold text-crimson">{stats.cancellationRate}%</div>
        </div>
        <div className="p-4 bg-bone border border-mist rounded-xl">
          <div className="text-xs font-semibold text-charcoal-muted mb-1">Total Earnings</div>
          <div className="text-2xl font-serif font-bold text-ink">₹{stats.totalEarnings.toLocaleString()}</div>
        </div>
      </div>

      {/* Bio & Details */}
      <div className="bg-bone border border-mist rounded-xl p-6 space-y-4">
        <h3 className="font-serif text-lg text-ink font-semibold">Professional Profile & Bio</h3>
        <p className="text-xs text-charcoal leading-relaxed">{p.bio}</p>

        <div className="pt-4 border-t border-mist/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-semibold text-charcoal-muted">Years of Experience:</span> {p.yearsOfExperience} years
          </div>
          <div>
            <span className="font-semibold text-charcoal-muted">Identity Verified:</span> {p.isIdentityVerified ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-semibold text-charcoal-muted">Background Checked:</span> {p.isBackgroundChecked ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
};
