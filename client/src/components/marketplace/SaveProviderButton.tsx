import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Toast } from '../ui/FeedbackComponents';

export interface SaveProviderButtonProps {
  providerId: string;
  providerName: string;
  className?: string;
}

export const SaveProviderButton: React.FC<SaveProviderButtonProps> = ({
  providerId,
  providerName,
  className = '',
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    setShowToast(true);
  };

  return (
    <>
      <button
        type="button"
        data-provider-id={providerId}
        onClick={handleClick}
        className={`
          p-2.5 rounded-md border transition-all duration-200 flex items-center justify-center gap-1.5 font-sans text-xs font-semibold
          ${isSaved
            ? 'bg-clay/10 text-clay border-clay/40'
            : 'bg-bone text-charcoal hover:text-ink border-mist hover:border-slate'}
          ${className}
        `}
        title={isSaved ? "Saved to Favorites" : "Save Provider"}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-clay text-clay' : ''}`} />
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      </button>

      {showToast && (
        <Toast
          message={isSaved ? `Saved ${providerName} to your favorites.` : `Removed from favorites.`}
          description="Sign in to sync your saved professionals across devices."
          variant="info"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};
