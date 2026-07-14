"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gharsathi_token');
    const savedUser = localStorage.getItem('gharsathi_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('gharsathi_token');
        localStorage.removeItem('gharsathi_user');
      }
    }
    setLoading(false);
  }, []);

  const normalizePhone = (p) => {
    if (!p) return p;
    const cleaned = p.replace(/[\s\-\+\(\)]/g, '');
    return cleaned.startsWith('91') && cleaned.length === 12 ? cleaned.slice(2) : cleaned;
  };

  const login = async (phone, password) => {
    const res = await api.post('/auth/login', { phone: normalizePhone(phone), password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('gharsathi_token', token);
    localStorage.setItem('gharsathi_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', { ...data, phone: normalizePhone(data.phone) });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('gharsathi_token', token);
    localStorage.setItem('gharsathi_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('gharsathi_token');
    localStorage.removeItem('gharsathi_user');
    setUser(null);
  };

  const isCustomer = user?.role === 'customer';
  const isWorker = user?.role === 'worker';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isCustomer, isWorker, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
