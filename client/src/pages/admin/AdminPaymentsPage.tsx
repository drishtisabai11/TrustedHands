import React, { useEffect, useState } from 'react';
import { CreditCard, RefreshCw, Download } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPayments(statusFilter, 1, 15);
      setPayments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateRefund = async (paymentId: string, currentAmount: number) => {
    const reason = prompt(`Reason for initiating full refund of ₹${currentAmount}:`) || 'Admin refund action';
    if (!reason) return;

    try {
      await adminService.initiateRefund(paymentId, reason);
      alert(`Refund of ₹${currentAmount} successfully processed.`);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Refund processing failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-crimson" /> Payment & Refund Operations
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Track gateway transactions, Razorpay reference IDs, payment statuses, and initiate administrative refunds
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => adminService.exportData('payments')} className="text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Payments CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-bone border border-mist p-4 rounded-xl flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-charcoal-muted">Filter Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-parchment border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson font-medium text-ink"
          >
            <option value="">All Payment Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <Button variant="outline" size="sm" onClick={fetchPayments} className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Transactions
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading transaction records...</div>
      ) : payments.length === 0 ? (
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          No payment records found.
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Refund Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-parchment/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">
                    {p.razorpayPaymentId || p._id}
                    <div className="text-[10px] text-charcoal-muted font-mono">{p._id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal">{p.customer?.name || 'Customer'}</td>
                  <td className="py-3.5 px-4 font-semibold text-ink">
                    #{p.booking?.bookingNumber || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal">{p.method || 'CARD'}</td>
                  <td className="py-3.5 px-4 font-serif font-bold text-ink">₹{p.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'PAID'
                          ? 'bg-seafoam/20 text-seafoam'
                          : p.status === 'REFUNDED'
                          ? 'bg-amber-500/20 text-amber-900'
                          : 'bg-crimson/10 text-crimson'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === 'PAID' ? (
                      <button
                        onClick={() => handleInitiateRefund(p._id, p.amount)}
                        className="px-2.5 py-1 bg-crimson/10 text-crimson hover:bg-crimson hover:text-parchment rounded text-xs font-semibold transition-colors"
                      >
                        Initiate Refund
                      </button>
                    ) : (
                      <span className="text-[11px] text-charcoal-muted italic">{p.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
