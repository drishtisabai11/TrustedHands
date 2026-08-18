import { UserRole } from '../types';

export const getDashboardRoute = (role?: UserRole | string | null): string => {
  if (!role) return '/';
  
  const normalizedRole = String(role).toUpperCase();

  switch (normalizedRole) {
    case 'CUSTOMER':
      return '/dashboard';
    case 'PROVIDER':
    case 'SERVICE_PROVIDER':
      return '/provider/dashboard';
    case 'ADMIN':
      return '/admin';
    default:
      return '/';
  }
};
