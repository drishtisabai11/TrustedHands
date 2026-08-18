import React, { useEffect, useState } from 'react';
import { Briefcase, ShieldCheck, CheckCheck } from 'lucide-react';
import { Notification } from '../../types';
import { Button } from '../../components/ui/Button';

export const ProviderNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        setNotifications([
          {
            id: 'pnotif-1',
            userId: 'usr-pro-1',
            title: 'New Booking Request',
            message: 'You have a new booking request #TH-BK-884920 from Aarav Mehta.',
            type: 'BOOKING_UPDATE',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'pnotif-2',
            userId: 'usr-pro-1',
            title: 'Review Received',
            message: 'Priya R. left a 5-star review for Electrical Safety Audit.',
            type: 'BOOKING_UPDATE',
            isRead: true,
            createdAt: '2026-08-12T10:15:00Z',
          },
          {
            id: 'pnotif-3',
            userId: 'usr-pro-1',
            title: 'Identity Verified',
            message: 'Your government photo ID has been verified by the platform team.',
            type: 'VERIFICATION',
            isRead: true,
            createdAt: '2026-08-01T00:00:00Z',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="h-20 bg-bone rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Provider Alerts & Notifications</h1>
          <p className="text-sm text-charcoal-muted mt-1">Real-time alerts for booking requests, status updates, and client reviews.</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1.5 text-sage-dark" /> Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-bone border rounded-xl p-4 transition-all flex items-start space-x-3 ${
              !n.isRead ? 'border-brand/40 bg-parchment/30 ring-1 ring-brand/10' : 'border-mist'
            }`}
          >
            <div className="p-2.5 bg-parchment rounded-lg border border-mist shrink-0">
              {n.type === 'VERIFICATION' ? (
                <ShieldCheck className="w-4 h-4 text-sage-dark" />
              ) : (
                <Briefcase className="w-4 h-4 text-brand" />
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-ink text-sm">{n.title}</h3>
                {!n.isRead && <span className="w-2 h-2 bg-brand rounded-full"></span>}
              </div>
              <p className="text-xs text-charcoal">{n.message}</p>
              <span className="text-[10px] text-charcoal-muted block">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderNotificationsPage;
