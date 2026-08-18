import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { customerApi } from '../../services/dashboardService';
import { Notification } from '../../types';
import { Button } from '../../components/ui/Button';

export const CustomerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await customerApi.markAllNotificationsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_UPDATE':
        return <Calendar className="w-4 h-4 text-brand" />;
      case 'PAYMENT_RECEIPT':
        return <CreditCard className="w-4 h-4 text-slate" />;
      case 'VERIFICATION':
        return <ShieldCheck className="w-4 h-4 text-sage-dark" />;
      default:
        return <Bell className="w-4 h-4 text-charcoal" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="h-20 bg-bone rounded-xl"></div>
        <div className="h-20 bg-bone rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Notifications</h1>
          <p className="text-sm text-charcoal-muted mt-1">Updates regarding your bookings, payments, and system notifications.</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1.5 text-sage-dark" /> Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-bone border rounded-xl p-4 transition-all flex items-start justify-between gap-4 ${
                !n.isRead ? 'border-brand/40 bg-parchment/30 ring-1 ring-brand/10' : 'border-mist'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-parchment rounded-lg border border-mist mt-0.5">{getNotificationIcon(n.type)}</div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif font-bold text-ink text-sm">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-brand rounded-full" title="Unread"></span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal">{n.message}</p>
                  <span className="text-[10px] text-charcoal-muted block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {n.linkUrl && (
                <Link
                  to={n.linkUrl}
                  className="px-3 py-1.5 bg-bone border border-mist hover:border-brand text-xs font-semibold text-brand rounded-lg shrink-0 transition-colors"
                >
                  View Detail
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl p-12 text-center text-charcoal-muted">
          <p className="text-sm">No notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerNotificationsPage;
