import React, { useState } from 'react';
import { Lock, CreditCard, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProviderSettingsPage: React.FC = () => {
  // Payout Settings
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100293481290');
  const [ifscCode, setIfscCode] = useState('HDFC0000240');
  const [upiId, setUpiId] = useState('rajesh@okhdfcbank');

  // Password Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [payoutSavedMsg, setPayoutSavedMsg] = useState(false);

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

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSavedMsg(true);
    setTimeout(() => setPayoutSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Provider Settings</h1>
        <p className="text-sm text-charcoal-muted mt-1">Configure payout destinations, security, and alert preferences.</p>
      </div>

      {/* 1. PAYOUT & BANKING DETAILS */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
          <CreditCard className="w-4 h-4 mr-1.5 text-brand" /> Direct Earnings Payout Settings
        </h2>

        <form onSubmit={handlePayoutSubmit} className="space-y-4">
          {payoutSavedMsg && (
            <div className="p-3 bg-sage/20 border border-sage text-sage-dark rounded-lg text-xs font-semibold flex items-center">
              <Check className="w-4 h-4 mr-2" /> Payout account updated successfully.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Bank Name</label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">IFSC Code</label>
              <Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Account Number</label>
            <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">UPI ID (Alternative)</label>
            <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@upi" />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" type="submit">
              Save Payout Account
            </Button>
          </div>
        </form>
      </div>

      {/* 2. SECURITY */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
          <Lock className="w-4 h-4 mr-1.5 text-brand" /> Password & Security
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
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Current Password</label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">New Password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Confirm New Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderSettingsPage;
