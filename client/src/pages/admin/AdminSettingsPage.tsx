import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { PlatformSetting } from '../../types';
import Button from '../../components/ui/Button';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getSettings();
      setSettings(data || []);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Settings update failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-mist pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-crimson" /> Marketplace Platform Settings
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">
          Configure platform service fees, cancellation policies, provider auto-approval rules, and security controls
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-seafoam/20 border border-seafoam rounded-xl text-ink text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-seafoam" /> Platform Settings Saved & Applied!
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-bone border border-mist rounded-xl p-6 space-y-6">
            <h3 className="font-serif text-lg text-ink font-bold border-b border-mist pb-2">Financial & Fee Configuration</h3>

            {settings.map((item) => (
              <div key={item.key} className="space-y-1.5 text-xs">
                <label className="block font-bold text-ink">{item.key}</label>
                <p className="text-[11px] text-charcoal-muted mb-2">{item.description}</p>
                {item.type === 'NUMBER' ? (
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleSettingChange(item.key, parseFloat(e.target.value))}
                    className="w-full max-w-xs px-3 py-2 bg-parchment border border-mist rounded-md font-semibold text-ink"
                  />
                ) : item.type === 'BOOLEAN' ? (
                  <select
                    value={String(item.value)}
                    onChange={(e) => handleSettingChange(item.key, e.target.value === 'true')}
                    className="w-full max-w-xs px-3 py-2 bg-parchment border border-mist rounded-md font-semibold text-ink"
                  >
                    <option value="true font-semibold">Enabled (True)</option>
                    <option value="false">Disabled (False)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleSettingChange(item.key, e.target.value)}
                    className="w-full max-w-md px-3 py-2 bg-parchment border border-mist rounded-md font-semibold text-ink"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="cta" size="md">
              <Save className="w-4 h-4 mr-2" /> Save Platform Configuration
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
