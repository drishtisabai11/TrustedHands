import React, { useState } from 'react';
import { Camera, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';

export const CustomerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Aarav');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || 'Mehta');
  const [email, setEmail] = useState(user?.email || 'aarav.mehta@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98200 99881');
  const [preferredContact, setPreferredContact] = useState<'PHONE' | 'EMAIL' | 'WHATSAPP'>('PHONE');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save profile
      await new Promise((res) => setTimeout(res, 600));
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Personal Profile</h1>
        <p className="text-sm text-charcoal-muted mt-1">Manage your account information and contact preferences.</p>
      </div>

      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-6">
        {/* AVATAR UPLOAD HEADER */}
        <div className="flex items-center space-x-5 pb-6 border-b border-mist">
          <div className="relative group">
            <Avatar name={`${firstName} ${lastName}`} src={user?.avatar} size="xl" />
            <button
              type="button"
              className="absolute bottom-0 right-0 p-1.5 bg-brand text-bone rounded-full shadow-sm hover:scale-105 transition-transform"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="font-serif font-bold text-ink text-lg">{firstName} {lastName}</h3>
            <p className="text-xs text-charcoal-muted">{email}</p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-sage/20 text-sage-dark px-2 py-0.5 rounded mt-1">
              Verified Customer
            </span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {successMsg && (
            <div className="p-3 bg-sage/20 border border-sage text-sage-dark rounded-lg text-xs font-semibold flex items-center">
              <Check className="w-4 h-4 mr-2" /> Profile information updated successfully.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                First Name
              </label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                Last Name
              </label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Email Address
            </label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required readOnly disabled />
            <span className="text-[10px] text-charcoal-muted mt-1 block">Email cannot be changed directly for security reasons.</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Phone Number
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98200 00000" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-2">
              Preferred Contact Method
            </label>
            <div className="flex space-x-4">
              {(['PHONE', 'EMAIL', 'WHATSAPP'] as const).map((method) => (
                <label key={method} className="flex items-center space-x-2 text-xs font-semibold text-ink cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={preferredContact === method}
                    onChange={() => setPreferredContact(method)}
                    className="text-brand focus:ring-brand"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-mist flex justify-end">
            <Button variant="primary" size="md" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
