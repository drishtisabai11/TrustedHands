import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label className={`inline-flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex items-center mt-0.5">
        <input
          type="checkbox"
          ref={ref}
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div 
          className={`
            w-4 h-4 rounded-sm border transition-all duration-150 flex items-center justify-center
            ${checked ? 'bg-mineral border-mineral text-white' : 'bg-bone border-mist hover:border-slate'}
          `}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col text-sm font-sans">
          {label && <span className="font-medium text-charcoal">{label}</span>}
          {description && <span className="text-xs text-charcoal-subtle">{description}</span>}
        </div>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
  id,
  ...props
}, ref) => {
  const radioId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label className={`inline-flex items-start gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative flex items-center mt-0.5">
        <input
          type="radio"
          ref={ref}
          id={radioId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div 
          className={`
            w-4 h-4 rounded-full border transition-all duration-150 flex items-center justify-center
            ${checked ? 'border-mineral bg-bone' : 'bg-bone border-mist hover:border-slate'}
          `}
        >
          {checked && <div className="w-2 h-2 rounded-full bg-mineral" />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col text-sm font-sans">
          {label && <span className="font-medium text-charcoal">{label}</span>}
          {description && <span className="text-xs text-charcoal-subtle">{description}</span>}
        </div>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-between gap-4 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
    >
      {(label || description) && (
        <div className="flex flex-col font-sans">
          {label && <span className="text-sm font-medium text-charcoal">{label}</span>}
          {description && <span className="text-xs text-charcoal-subtle">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-mineral
          ${checked ? 'bg-mineral' : 'bg-mist-dark'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};
