"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('gharsathi_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        const userData = res.data.data;
        setProfile(userData);
        setUser(userData);
        localStorage.setItem('gharsathi_user', JSON.stringify(userData));
      }
    } catch {
      localStorage.removeItem('gharsathi_token');
      localStorage.removeItem('gharsathi_user');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('gharsathi_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setProfile(parsed);
        setUser(parsed);
      } catch {
        localStorage.removeItem('gharsathi_user');
      }
    }
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data.success) throw new Error(res.data.message || 'Login failed');
    const { user: userData, token } = res.data.data;
    localStorage.setItem('gharsathi_token', token);
    localStorage.setItem('gharsathi_user', JSON.stringify(userData));
    setProfile(userData);
    setUser(userData);
    return userData;
  };

  const register = async ({ name, email, phone, password, role }) => {
    const res = await api.post('/auth/register', { name, email, phone, password, role });
    if (!res.data.success) {
      const msg = res.data.errors?.[0]?.msg || res.data.message || 'Registration failed';
      throw new Error(msg);
    }
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('gharsathi_token');
    localStorage.removeItem('gharsathi_user');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const role = profile?.role;
    if (role === 'worker') {
      const res = await api.put('/workers/profile', updates);
      if (res.data.success) {
        setProfile(prev => ({ ...prev, ...res.data.data }));
        setUser(prev => ({ ...prev, ...res.data.data }));
      }
    } else {
      try {
        const res = await api.put('/auth/profile', updates);
        if (res.data.success) {
          setProfile(prev => ({ ...prev, ...res.data.data }));
          setUser(prev => ({ ...prev, ...res.data.data }));
          return;
        }
      } catch {
      }
      setProfile(prev => ({ ...prev, ...updates }));
      setUser(prev => ({ ...prev, ...updates }));
    }
  };

  const isCustomer = profile?.role === 'customer';
  const isWorker = profile?.role === 'worker';
  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, updateProfile, isCustomer, isWorker, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
