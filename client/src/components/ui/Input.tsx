import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-charcoal-subtle pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full px-3.5 py-2.5 text-sm bg-bone text-charcoal placeholder-charcoal-subtle
            border ${error ? 'border-clay focus:ring-clay' : 'border-mist focus:border-mineral focus:ring-mineral'} 
            rounded-md transition-colors duration-150
            focus:outline-none focus:ring-1 
            disabled:bg-parchment-dark disabled:cursor-not-allowed disabled:opacity-70
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-charcoal-subtle flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <span className="text-xs text-clay font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-charcoal-subtle">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  placeholder = "Search services, professionals, or location...",
  ...props
}) => {
  return (
    <Input
      leftIcon={<Search className="w-4 h-4" />}
      rightIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="p-1 hover:text-ink transition-colors rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : undefined
      }
      value={value}
      placeholder={placeholder}
      {...props}
    />
  );
};
