"use client";

import { AuthProvider } from '@/lib/auth';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', background: '#1f2937', color: '#fff' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}
