import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    right: 'right-0 rounded-l-lg border-l',
    left: 'left-0 rounded-r-lg border-r',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/40 transition-opacity">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`
          fixed top-0 bottom-0 ${positionClasses[position]} w-full max-w-md bg-bone shadow-modal border-mist
          flex flex-col z-10 transition-transform duration-300 font-sans
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-mist bg-bone">
          {title && <h3 className="text-lg font-serif font-normal text-ink">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 text-charcoal-subtle hover:text-ink rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 text-sm text-charcoal">
          {children}
        </div>
      </div>
    </div>
  );
};
