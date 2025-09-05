import React, { createContext, useContext, useMemo, useState } from 'react';
import { authStore } from '../services/auth';

export type AuthUser = {
  username: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('wms.auth.user');
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  });

  const login = async (username: string, password: string) => {
    if (!username || !password) throw new Error('Username and password are required');
    const ok = authStore.validate(username, password);
    if (!ok) throw new Error('Invalid credentials');
    const u = { username };
    setUser(u);
    localStorage.setItem('wms.auth.user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wms.auth.user');
  };

  const register = async (username: string, password: string) => {
    if (!username || !password) throw new Error('Username and password are required');
    if (authStore.exists(username)) throw new Error('Username already exists');
    authStore.add({ username, password });
  };

  const value = useMemo(() => ({ user, login, logout, register }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
