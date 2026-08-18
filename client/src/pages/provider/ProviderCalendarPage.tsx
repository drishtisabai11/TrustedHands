import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { providerApi } from '../../services/dashboardService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';

export const ProviderCalendarPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCal = async () => {
      setLoading(true);
      try {
        const data = await providerApi.getCalendar();
        setBookings(data?.bookings || []);
      } catch (err) {
        console.error('Error fetching calendar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCal();
  }, []);

  // Generate 7-day week selector for mobile & desktop
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + (i - 1));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });

  const selectedDateBookings = bookings.filter((b) => b.scheduledDate === selectedDate);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="h-24 bg-bone rounded-xl"></div>
        <div className="h-48 bg-bone rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Schedule & Calendar</h1>
        <p className="text-sm text-charcoal-muted mt-1">Review your upcoming jobs, availability slots, and arrival times.</p>
      </div>

      {/* 7-DAY MOBILE & DESKTOP DATE SELECTOR */}
      <div className="bg-bone border border-mist rounded-2xl p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-mist">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1 text-brand" /> Week Schedule Overview
          </span>
          <span className="text-xs font-semibold text-brand">Selected: {selectedDate}</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const hasBooking = bookings.some((b) => b.scheduledDate === day.dateStr);
            const isSelected = selectedDate === day.dateStr;

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDate(day.dateStr)}
                className={`p-2.5 rounded-xl border text-center transition-all relative ${
                  isSelected
                    ? 'bg-brand text-bone border-brand shadow-sm font-bold'
                    : 'bg-parchment/60 border-mist hover:border-brand/40 text-charcoal'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold block">{day.dayName}</span>
                <span className="text-base font-serif font-bold block">{day.dayNum}</span>

                {hasBooking && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 block ${
                      isSelected ? 'bg-bone' : 'bg-brand'
                    }`}
                  ></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DATE JOBS SCHEDULE */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate">Appointments for {selectedDate}</h2>

        {selectedDateBookings.length > 0 ? (
          <div className="space-y-3">
            {selectedDateBookings.map((b) => (
              <div key={b.id} className="p-4 border border-mist rounded-xl bg-parchment/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {b.scheduledTimeSlot}
                  </span>
                  <Badge variant="verified">{b.status.replace(/_/g, ' ')}</Badge>
                </div>

                <h3 className="font-serif text-base font-bold text-ink">{b.service?.title || 'Service Appointment'}</h3>

                <div className="flex flex-wrap gap-3 text-xs text-charcoal">
                  <span className="flex items-center font-medium">
                    <User className="w-3.5 h-3.5 mr-1 text-charcoal-muted" /> Client: {b.customer?.name || 'Anita Sharma'}
                  </span>
                  <span className="flex items-center font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-charcoal-muted" /> {b.serviceAddress?.street || 'South Delhi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-charcoal-muted space-y-1">
            <p className="text-sm font-semibold text-ink">No bookings scheduled for this date.</p>
            <p className="text-xs">Your time slots remain open for customer requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCalendarPage;
