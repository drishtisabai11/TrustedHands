import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import apiClient from '../services/api/client';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerCustomer: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  returnUrl: string | null;
  setReturnUrl: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('th_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('th_auth_token');
      const storedUser = localStorage.getItem('th_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch {
          localStorage.removeItem('th_auth_token');
          localStorage.removeItem('th_user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock/Real backend request
      const response = await apiClient.post('/auth/login', { email, password }).catch(() => {
        // Local simulation fallback
        return {
          token: `mock_jwt_token_${Date.now()}`,
          user: {
            id: 'usr-cust-mock-1',
            email,
            name: email.split('@')[0].replace('.', ' '),
            role: 'CUSTOMER',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      });

      const resData = response as any;
      const userObj = resData.user || resData.data?.user;
      const tokenStr = resData.token || resData.data?.token;

      setUser(userObj);
      setToken(tokenStr);
      localStorage.setItem('th_auth_token', tokenStr);
      localStorage.setItem('th_user', JSON.stringify(userObj));
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (email: string, password: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register/customer', { email, password, name, phone }).catch(() => {
        return {
          token: `mock_jwt_token_${Date.now()}`,
          user: {
            id: `usr-cust-${Date.now()}`,
            email,
            name,
            phone,
            role: 'CUSTOMER',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      });

      const resData = response as any;
      const userObj = resData.user || resData.data?.user;
      const tokenStr = resData.token || resData.data?.token;

      setUser(userObj);
      setToken(tokenStr);
      localStorage.setItem('th_auth_token', tokenStr);
      localStorage.setItem('th_user', JSON.stringify(userObj));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('th_auth_token');
    localStorage.removeItem('th_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerCustomer,
        logout,
        returnUrl,
        setReturnUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
