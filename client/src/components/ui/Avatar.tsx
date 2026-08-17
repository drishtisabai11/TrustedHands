import React from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline,
  className = '',
}) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'TH';
  };

  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl font-serif",
  };

  const statusSizeMap = {
    sm: "w-2.5 h-2.5 border-2",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4.5 h-4.5 border-2",
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover border border-mist`}
        />
      ) : (
        <div 
          className={`
            ${sizeMap[size]} rounded-full bg-slate text-parchment font-semibold
            flex items-center justify-center border border-mist select-none
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {isOnline !== undefined && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-bone
            ${isOnline ? 'bg-mineral' : 'bg-charcoal-subtle'}
            ${statusSizeMap[size]}
          `}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
};
