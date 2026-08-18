import React, { useState } from 'react';
import { Clock, Calendar, Check, Save } from 'lucide-react';
import { providerApi } from '../../services/dashboardService';
import { Button } from '../../components/ui/Button';

export const ProviderAvailabilityPage: React.FC = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'MONDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'TUESDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'WEDNESDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'THURSDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'FRIDAY', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'SATURDAY', isAvailable: true, startTime: '10:00', endTime: '16:00' },
    { day: 'SUNDAY', isAvailable: false, startTime: '09:00', endTime: '18:00' },
  ]);

  const [blackoutDate, setBlackoutDate] = useState('');
  const [blackoutList, setBlackoutList] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const toggleDay = (idx: number) => {
    const updated = [...weeklySchedule];
    updated[idx].isAvailable = !updated[idx].isAvailable;
    setWeeklySchedule(updated);
  };

  const handleTimeChange = (idx: number, field: 'startTime' | 'endTime', val: string) => {
    const updated = [...weeklySchedule];
    updated[idx][field] = val;
    setWeeklySchedule(updated);
  };

  const addBlackoutDate = () => {
    if (!blackoutDate) return;
    if (!blackoutList.includes(blackoutDate)) {
      setBlackoutList([...blackoutList, blackoutDate]);
    }
    setBlackoutDate('');
  };

  const removeBlackoutDate = (d: string) => {
    setBlackoutList(blackoutList.filter((item) => item !== d));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await providerApi.updateAvailability({ weeklySchedule, blackoutDates: blackoutList });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error('Error saving availability:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Availability & Working Hours</h1>
        <p className="text-sm text-charcoal-muted mt-1">Configure your working days, arrival windows, and blackout periods.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {successMsg && (
          <div className="p-3 bg-sage/20 border border-sage text-sage-dark rounded-lg text-xs font-semibold flex items-center">
            <Check className="w-4 h-4 mr-2" /> Availability schedule updated successfully.
          </div>
        )}

        {/* WEEKLY WORKING HOURS */}
        <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-brand" /> Weekly Working Hours
          </h2>

          <div className="space-y-3">
            {weeklySchedule.map((item, idx) => (
              <div
                key={item.day}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  item.isAvailable ? 'bg-parchment/40 border-mist' : 'bg-mist/20 border-mist/40 opacity-70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.isAvailable}
                    onChange={() => toggleDay(idx)}
                    className="rounded text-brand focus:ring-brand w-4 h-4"
                  />
                  <span className="text-sm font-bold text-ink w-28 uppercase">{item.day}</span>
                </div>

                {item.isAvailable ? (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-charcoal-muted">From</span>
                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                      className="p-1.5 border border-mist rounded-md bg-bone font-mono text-xs"
                    />
                    <span className="text-charcoal-muted">To</span>
                    <input
                      type="time"
                      value={item.endTime}
                      onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                      className="p-1.5 border border-mist rounded-md bg-bone font-mono text-xs"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-charcoal-muted font-medium italic">Unavailable / Day Off</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BLACKOUT DATES */}
        <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-brand" /> Unavailable / Blackout Dates
          </h2>

          <div className="flex items-center space-x-3">
            <input
              type="date"
              value={blackoutDate}
              onChange={(e) => setBlackoutDate(e.target.value)}
              className="p-2 border border-mist rounded-lg bg-bone text-xs"
            />
            <Button variant="outline" size="sm" type="button" onClick={addBlackoutDate}>
              Block Selected Date
            </Button>
          </div>

          {blackoutList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {blackoutList.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full text-xs font-semibold flex items-center"
                >
                  {d}
                  <button type="button" onClick={() => removeBlackoutDate(d)} className="ml-2 hover:text-slate">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Availability Schedule'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProviderAvailabilityPage;
