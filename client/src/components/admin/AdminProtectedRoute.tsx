import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-crimson border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-charcoal-muted">Authorizing Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center p-6 font-sans">
        <div className="bg-bone border border-mist rounded-xl p-8 max-w-md w-full shadow-modal text-center">
          <div className="w-14 h-14 rounded-full bg-crimson/10 text-crimson mx-auto flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-ink mb-2">Access Denied</h2>
          <p className="text-sm text-charcoal-muted mb-6">
            The Admin Operational Control Center requires administrator role permissions. Server-side authorization check failed for your current session.
          </p>
          <a href="/">
            <Button variant="cta" fullWidth size="md">
              Return to Marketplace
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
