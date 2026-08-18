import React, { useState } from 'react';
import { Bell, Lock, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const CustomerSettingsPage: React.FC = () => {
  // Notification Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [reviewReminders, setReviewReminders] = useState(true);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await new Promise((res) => setTimeout(res, 600));
      setPasswordMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted to support.');
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Account Settings</h1>
        <p className="text-sm text-charcoal-muted mt-1">Configure your notifications, password security, and account settings.</p>
      </div>

      {/* 1. NOTIFICATION PREFERENCES */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
          <Bell className="w-4 h-4 mr-1.5 text-brand" /> Notification Preferences
        </h2>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between p-3 bg-parchment/50 rounded-xl border border-mist/80 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-ink block">Email Notifications</span>
              <span className="text-xs text-charcoal-muted">Receive booking updates and receipts via email</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="rounded text-brand focus:ring-brand w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-parchment/50 rounded-xl border border-mist/80 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-ink block">Booking Alerts</span>
              <span className="text-xs text-charcoal-muted">Real-time alerts when provider accepts or arrives</span>
            </div>
            <input
              type="checkbox"
              checked={bookingNotifs}
              onChange={(e) => setBookingNotifs(e.target.checked)}
              className="rounded text-brand focus:ring-brand w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-parchment/50 rounded-xl border border-mist/80 cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-ink block">Review Reminders</span>
              <span className="text-xs text-charcoal-muted">Occasional prompts after completed services</span>
            </div>
            <input
              type="checkbox"
              checked={reviewReminders}
              onChange={(e) => setReviewReminders(e.target.checked)}
              className="rounded text-brand focus:ring-brand w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* 2. SECURITY & PASSWORD */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
          <Lock className="w-4 h-4 mr-1.5 text-brand" /> Security & Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                passwordMsg.includes('successfully')
                  ? 'bg-sage/20 border border-sage text-sage-dark'
                  : 'bg-brand/10 border border-brand text-brand'
              }`}
            >
              {passwordMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Current Password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>

      {/* 3. DANGER ZONE */}
      <div className="bg-bone border border-brand/30 rounded-2xl p-6 shadow-subtle space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center">
          <ShieldAlert className="w-4 h-4 mr-1.5" /> Danger Zone
        </h2>
        <p className="text-xs text-charcoal-muted">
          Permanently remove your account and all saved customer records from Trusted Hands.
        </p>
        <div className="pt-2">
          <Button variant="secondary" size="md" type="button" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettingsPage;
