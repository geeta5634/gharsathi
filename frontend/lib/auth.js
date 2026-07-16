"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from './supabase/client';

const AuthContext = createContext(null);

function getClient() {
  const supabase = createClient();
  if (!supabase) {
    console.warn('Supabase not configured - auth disabled');
    return null;
  }
  return supabase;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const supabase = getClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data);
      setUser({ ...data, id: data.id, email: data.email });
    }
  }, []);

  useEffect(() => {
    const supabase = getClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = async (email, password) => {
    const supabase = getClient();
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchProfile(data.user.id);
    return { ...profile, id: data.user.id };
  };

  const register = async ({ email, password, name, phone, role }) => {
    const supabase = getClient();
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: role || 'customer' },
      },
    });
    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    const supabase = getClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const supabase = getClient();
    if (!supabase || !profile) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);
    if (error) throw error;
    setProfile(prev => ({ ...prev, ...updates }));
    setUser(prev => ({ ...prev, ...updates }));
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
