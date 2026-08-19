import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminProviderPendingPage: React.FC = () => {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getPendingProviders();
      setPendingList(data || []);
    } catch (err) {
      console.error('Failed to fetch pending providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW') => {
    const reason = prompt(`Provide administrative reason for setting verification status to ${action}:`) || `${action} by admin`;
    try {
      await adminService.updateProviderVerification(id, action, reason);
      fetchPending();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/providers" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Provider Master Directory
      </Link>

      <div className="border-b border-mist pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-crimson" /> Pending Provider Verification Queue
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">
          Review government credentials, trade certificates, identity proof, and background check records before granting marketplace approval
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading pending verification requests...</div>
      ) : pendingList.length === 0 ? (
        <div className="bg-bone border border-mist p-12 rounded-xl text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-seafoam mx-auto" />
          <h3 className="font-serif text-xl text-ink font-semibold">No Pending Approvals</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            All submitted provider profiles and verification documents have been reviewed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingList.map((item) => (
            <div key={item._id || item.id} className="bg-bone border border-mist rounded-xl p-6 space-y-6 shadow-subtle">
              {/* Provider Summary Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-mist/80">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl text-ink font-bold">{item.businessName || item.user?.name}</h3>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
                      {item.verificationStatus}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-charcoal mt-1">{item.headline}</p>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Location: {item.city}, {item.state} • Experience: {item.yearsOfExperience || 1} years • Contact: {item.user?.email} ({item.user?.phone || 'N/A'})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(item._id || item.id, 'APPROVED')}
                    className="px-4 py-2 bg-seafoam text-parchment font-semibold text-xs rounded-lg hover:bg-seafoam/90 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Professional
                  </button>
                  <button
                    onClick={() => handleAction(item._id || item.id, 'UNDER_REVIEW')}
                    className="px-3 py-2 bg-parchment text-ink border border-mist font-semibold text-xs rounded-lg hover:border-mineral transition-colors flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Request Changes
                  </button>
                  <button
                    onClick={() => handleAction(item._id || item.id, 'REJECTED')}
                    className="px-3 py-2 bg-crimson/10 text-crimson font-semibold text-xs rounded-lg hover:bg-crimson hover:text-parchment transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>

              {/* Submitted Verification Credentials / Documents */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-crimson" /> Submitted Verification Documents
                </h4>
                {item.documents && item.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {item.documents.map((doc: any, dIdx: number) => (
                      <div key={dIdx} className="p-3 bg-parchment border border-mist rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-ink">{doc.type}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-mist text-ink">
                            {doc.status}
                          </span>
                        </div>
                        {doc.documentNumber && (
                          <div className="text-[11px] text-charcoal-muted">Doc No: {doc.documentNumber}</div>
                        )}
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-crimson hover:underline"
                        >
                          View Document Image <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-charcoal-muted bg-parchment p-3 rounded border border-mist">
                    No individual document attachments provided. Base identity verification required.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
