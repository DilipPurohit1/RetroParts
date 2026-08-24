import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser } from '../types/index.js';
import { authService } from '../services/authService.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  demoLogin: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<IUser>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('retroparts_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const refreshUser = async () => {
    try {
      if (token) {
        const data = await authService.getMe();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Failed to refresh user auth state:', err);
      localStorage.removeItem('retroparts_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authService.login(credentials);
      localStorage.setItem('retroparts_token', res.token);
      setToken(res.token);
      setUser(res.user);
      success(`Welcome back, ${res.user.name}!`, 'Logged in');
      return true;
    } catch (err: any) {
      error(err.response?.data?.message || 'Invalid email or password.', 'Login Failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email: string): Promise<boolean> => {
    return login({ email, password: 'password123' });
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authService.register(userData);
      localStorage.setItem('retroparts_token', res.token);
      setToken(res.token);
      setUser(res.user);
      success(`Account created successfully! Welcome to RetroParts, ${res.user.name}.`, 'Welcome Aboard');
      return true;
    } catch (err: any) {
      error(err.response?.data?.message || 'Registration failed.', 'Error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('retroparts_token');
    setToken(null);
    setUser(null);
    success('You have been logged out safely.', 'Logged Out');
  };

  const updateUser = (updated: Partial<IUser>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const isSeller = user?.role === 'seller' || user?.role === 'both' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
