import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-px self-stretch bg-mist ${className}`} aria-hidden="true" />;
  }

  if (label) {
    return (
      <div className={`relative flex items-center w-full my-4 ${className}`}>
        <div className="flex-grow border-t border-mist" />
        <span className="px-3 text-xs font-medium uppercase tracking-wider text-charcoal-subtle font-sans bg-parchment">
          {label}
        </span>
        <div className="flex-grow border-t border-mist" />
      </div>
    );
  }

  return <hr className={`w-full border-0 border-t border-mist my-4 ${className}`} />;
};
