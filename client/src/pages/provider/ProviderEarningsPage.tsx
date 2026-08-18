import React, { useEffect, useState } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { providerApi } from '../../services/dashboardService';
import { Button } from '../../components/ui/Button';

export const ProviderEarningsPage: React.FC = () => {
  const [earningsData, setEarningsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const data = await providerApi.getEarnings();
        setEarningsData(data);
      } catch (err) {
        console.error('Error fetching earnings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-bone rounded-xl"></div>
          <div className="h-32 bg-bone rounded-xl"></div>
          <div className="h-32 bg-bone rounded-xl"></div>
        </div>
      </div>
    );
  }

  const ledger = earningsData?.ledger || [];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Earnings & Financial Ledger</h1>
        <p className="text-sm text-charcoal-muted mt-1">Track net earnings, payouts, and detailed fee breakdowns for completed jobs.</p>
      </div>

      {/* 1. EARNINGS SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bone border border-mist p-5 rounded-2xl shadow-subtle space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">Total Net Earnings</span>
          <span className="text-2xl font-serif font-bold text-sage-dark block">₹{earningsData?.totalEarnings || 0}</span>
          <span className="text-xs text-charcoal-muted">All-time completed jobs</span>
        </div>

        <div className="bg-bone border border-mist p-5 rounded-2xl shadow-subtle space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">This Month</span>
          <span className="text-2xl font-serif font-bold text-brand block">₹{earningsData?.thisMonthEarnings || 0}</span>
          <span className="text-xs text-charcoal-muted">Current billing period</span>
        </div>

        <div className="bg-bone border border-mist p-5 rounded-2xl shadow-subtle space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">Last Month</span>
          <span className="text-2xl font-serif font-bold text-slate block">₹{earningsData?.lastMonthEarnings || 0}</span>
          <span className="text-xs text-charcoal-muted">Previous month total</span>
        </div>

        <div className="bg-bone border border-mist p-5 rounded-2xl shadow-subtle space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">Pending Payout</span>
          <span className="text-2xl font-serif font-bold text-amber-600 block">₹{earningsData?.pendingAmount || 0}</span>
          <span className="text-xs text-charcoal-muted">Active jobs in progress</span>
        </div>
      </div>

      {/* 2. SIMPLE PURPOSEFUL VISUALIZATION */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate">Earnings Breakdown</h2>
            <p className="text-xs text-charcoal-muted">Monthly performance ratio</p>
          </div>
          <span className="text-xs font-bold text-sage-dark bg-sage/20 px-3 py-1 rounded-full flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> Healthy Activity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-parchment/50 border border-mist rounded-xl space-y-1">
            <span className="text-xs text-charcoal-muted block">Completed Jobs Count</span>
            <span className="text-xl font-serif font-bold text-ink">{earningsData?.completedJobsCount || 128} jobs</span>
            <span className="text-[11px] text-charcoal block">Average ticket value: ₹660 / job</span>
          </div>

          <div className="p-4 bg-parchment/50 border border-mist rounded-xl space-y-1">
            <span className="text-xs text-charcoal-muted block">Platform Assurance Fee</span>
            <span className="text-xl font-serif font-bold text-ink">12% Flat Rate</span>
            <span className="text-[11px] text-charcoal block">Covers customer escrow protection & support</span>
          </div>
        </div>
      </div>

      {/* 3. TRANSACTION LEDGER (RESPONSIVE STACKED ON MOBILE) */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-mist pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate">Completed Job Ledger</h2>
            <p className="text-xs text-charcoal-muted">Detailed payment log per booking</p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" /> Export Statement
          </Button>
        </div>

        {ledger.length > 0 ? (
          <div className="space-y-3">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-mist text-charcoal-subtle font-bold uppercase tracking-wider">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3 text-right">Gross Amount</th>
                    <th className="pb-3 text-right">Fee (12%)</th>
                    <th className="pb-3 text-right">Net Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/60 text-ink">
                  {ledger.map((item: any) => (
                    <tr key={item.bookingId} className="hover:bg-parchment/40">
                      <td className="py-3 font-mono font-semibold text-brand">#{item.bookingId}</td>
                      <td className="py-3 text-charcoal-muted">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="py-3 font-medium">{item.service}</td>
                      <td className="py-3">{item.customer}</td>
                      <td className="py-3 text-right text-charcoal font-medium">₹{item.grossAmount}</td>
                      <td className="py-3 text-right text-charcoal-muted">₹{item.platformFee}</td>
                      <td className="py-3 text-right font-serif font-bold text-sage-dark">₹{item.netEarnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden space-y-3">
              {ledger.map((item: any) => (
                <div key={item.bookingId} className="p-4 border border-mist rounded-xl space-y-2 bg-parchment/30 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-brand">#{item.bookingId}</span>
                    <span className="font-serif font-bold text-sage-dark text-sm">₹{item.netEarnings}</span>
                  </div>

                  <p className="font-bold text-ink">{item.service}</p>
                  <p className="text-charcoal-muted">
                    Client: {item.customer} · {new Date(item.date).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between text-[11px] pt-2 border-t border-mist/60 text-charcoal">
                    <span>Gross: ₹{item.grossAmount}</span>
                    <span>Platform Fee: ₹{item.platformFee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-charcoal-muted">
            <p className="text-sm">No completed transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderEarningsPage;
