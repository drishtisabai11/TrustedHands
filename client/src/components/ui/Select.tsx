import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  placeholder,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label 
          htmlFor={selectId} 
          className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`
            w-full px-3.5 py-2.5 text-sm bg-bone text-charcoal appearance-none
            border ${error ? 'border-clay focus:ring-clay' : 'border-mist focus:border-mineral focus:ring-mineral'} 
            rounded-md transition-colors duration-150 pr-10
            focus:outline-none focus:ring-1 
            disabled:bg-parchment-dark disabled:cursor-not-allowed disabled:opacity-70
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-charcoal-subtle">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <span className="text-xs text-clay font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-charcoal-subtle">{helperText}</span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
