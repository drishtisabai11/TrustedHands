import React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateOption {
  dateString: string; // YYYY-MM-DD
  dayName: string;   // e.g. "Mon"
  dayNumber: number; // e.g. 18
  monthName: string; // e.g. "Aug"
  isAvailable?: boolean;
}

export interface DateSelectorProps {
  dates: DateOption[];
  selectedDate: string;
  onSelectDate: (dateString: string) => void;
  className?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onSelectDate,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 font-sans ${className}`}>
      {dates.map((d) => {
        const isSelected = selectedDate === d.dateString;
        const isDisabled = d.isAvailable === false;

        return (
          <button
            key={d.dateString}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectDate(d.dateString)}
            className={`
              flex flex-col items-center justify-center p-3 min-w-[70px] rounded-md border transition-all duration-150 shrink-0
              ${isSelected 
                ? 'bg-ink text-parchment border-ink shadow-subtle' 
                : 'bg-bone text-charcoal border-mist hover:border-slate'}
              ${isDisabled ? 'opacity-40 cursor-not-allowed bg-parchment-dark' : 'cursor-pointer'}
            `}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-sage-light' : 'text-charcoal-subtle'}`}>
              {d.dayName}
            </span>
            <span className="text-lg font-serif my-0.5 font-normal">{d.dayNumber}</span>
            <span className="text-[10px] uppercase tracking-wider">{d.monthName}</span>
          </button>
        );
      })}
    </div>
  );
};

export interface TimeSlotOption {
  id: string;
  timeLabel: string; // e.g. "09:00 AM - 11:00 AM"
  period: 'MORNING' | 'AFTERNOON' | 'EVENING';
  isAvailable?: boolean;
}

export interface TimeSlotProps {
  slots: TimeSlotOption[];
  selectedSlotId: string;
  onSelectSlot: (slotId: string) => void;
  className?: string;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  className = '',
}) => {
  const periods = [
    { key: 'MORNING', label: 'Morning' },
    { key: 'AFTERNOON', label: 'Afternoon' },
    { key: 'EVENING', label: 'Evening' },
  ];

  return (
    <div className={`flex flex-col gap-4 font-sans ${className}`}>
      {periods.map((period) => {
        const periodSlots = slots.filter((s) => s.period === period.key);
        if (periodSlots.length === 0) return null;

        return (
          <div key={period.key} className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-subtle flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-mist-dark" />
              {period.label}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {periodSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isDisabled = slot.isAvailable === false;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => onSelectSlot(slot.id)}
                    className={`
                      py-2.5 px-3 text-xs font-medium rounded-md border text-center transition-all duration-150
                      ${isSelected 
                        ? 'bg-mineral text-white border-mineral shadow-subtle' 
                        : 'bg-bone text-charcoal border-mist hover:border-slate'}
                      ${isDisabled ? 'opacity-40 cursor-not-allowed bg-parchment-dark' : 'cursor-pointer'}
                    `}
                  >
                    {slot.timeLabel}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface CalendarPrimitiveProps {
  currentMonthName: string; // e.g. "August 2026"
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  children: React.ReactNode;
}

export const CalendarPrimitives: React.FC<CalendarPrimitiveProps> = ({
  currentMonthName,
  onPrevMonth,
  onNextMonth,
  children,
}) => {
  return (
    <div className="bg-bone rounded-lg border border-mist p-4 font-sans max-w-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist">
        <span className="font-serif font-normal text-lg text-ink flex items-center gap-2">
          <Calendar className="w-4 h-4 text-mineral" />
          {currentMonthName}
        </span>
        <div className="flex items-center gap-1">
          {onPrevMonth && (
            <button
              onClick={onPrevMonth}
              className="p-1 text-charcoal-subtle hover:text-ink rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNextMonth && (
            <button
              onClick={onNextMonth}
              className="p-1 text-charcoal-subtle hover:text-ink rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
