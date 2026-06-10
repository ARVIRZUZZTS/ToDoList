import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { apiClient } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth usa el  AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.getSession();
        if (response) {
          setUser(response.user); 
          apiClient.setAccessToken(response.accessToken);
        }
      } catch (error) {
        console.log('no hay sesion activa');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    apiClient.setAccessToken(response.accessToken);
  };

  const register = async (name: string, email: string, password: string) => {
    await authService.register(name, email, password);
    await login(email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    apiClient.setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};