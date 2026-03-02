'use client';

import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import LoginScreen from '@/components/auth/LoginScreen';
import { useProgressStore, setCurrentUserId } from '@/lib/store';
import { Loader2 } from 'lucide-react';

function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { loadFromCloud, initializeProgress } = useProgressStore();

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
      // Load progress from cloud on login
      loadFromCloud(user.id).then(() => {
        initializeProgress();
      });
    } else {
      setCurrentUserId(null);
    }
  }, [user, loadFromCloud, initializeProgress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 size={32} className="text-[var(--color-brand)] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </AuthProvider>
  );
}
