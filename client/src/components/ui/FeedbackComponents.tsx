import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) => {
  const styles = {
    info: {
      bg: 'bg-bone border-mist text-charcoal',
      icon: <Info className="w-5 h-5 text-slate shrink-0" />,
    },
    success: {
      bg: 'bg-sage-subtle border-sage/50 text-slate',
      icon: <CheckCircle2 className="w-5 h-5 text-mineral shrink-0" />,
    },
    warning: {
      bg: 'bg-parchment-dark border-mist-dark text-charcoal',
      icon: <AlertTriangle className="w-5 h-5 text-clay shrink-0" />,
    },
    error: {
      bg: 'bg-clay/10 border-clay/30 text-charcoal',
      icon: <AlertCircle className="w-5 h-5 text-clay shrink-0" />,
    },
  };

  const { bg, icon } = styles[variant];

  return (
    <div className={`p-4 rounded-md border ${bg} flex items-start gap-3 font-sans text-sm ${className}`} role="alert">
      {icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5 text-ink">{title}</h4>}
        <div className="text-xs text-charcoal-muted leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:opacity-75 rounded transition-opacity"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export interface ToastProps {
  message: string;
  description?: string;
  variant?: 'info' | 'success' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  description,
  variant = 'info',
  onClose,
}) => {
  const icons = {
    info: <Info className="w-4 h-4 text-mineral" />,
    success: <CheckCircle2 className="w-4 h-4 text-mineral" />,
    error: <AlertCircle className="w-4 h-4 text-clay" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-ink text-parchment p-4 rounded-md shadow-modal border border-slate flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200 font-sans">
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
        {description && <p className="text-xs text-sage-light mt-0.5">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-sage-light hover:text-white">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
