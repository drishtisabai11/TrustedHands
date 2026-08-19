import React from 'react';
import { Bell } from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const notifications = [
    { id: '1', title: 'New Provider Registration', message: 'Amit Verma submitted profile and credentials for plumbing verification.', time: '10 mins ago', type: 'VERIFICATION' },
    { id: '2', title: 'Disputed Booking Intervention', message: 'Booking #TH-2026-8891 marked as disputed by customer Aarav Sharma.', time: '1 hour ago', type: 'ALERT' },
    { id: '3', title: 'Payment Gateway Alert', message: 'Razorpay webhook signature verified for Order #order_88291.', time: '2 hours ago', type: 'INFO' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-mist pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-crimson" /> System & Operational Notifications
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">Operational alerts, verification triggers, and platform activity</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-bone border border-mist rounded-xl p-4 flex items-start gap-4 shadow-subtle">
            <div className="p-2.5 rounded-lg bg-crimson/10 text-crimson mt-0.5">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-base font-bold text-ink">{n.title}</h4>
                <span className="text-[11px] text-charcoal-muted">{n.time}</span>
              </div>
              <p className="text-xs text-charcoal mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
