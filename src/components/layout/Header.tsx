'use client';

import React from 'react';
import { Menu, Search, Bell, LogOut } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery } = useUIStore();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-[var(--header-height)] flex items-center px-4 md:px-6 border-b border-[var(--border-default)] glass-strong">
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all mr-3"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Buscar tópicos, conceitos..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        {/* User email */}
        {user && (
          <span className="hidden md:block text-xs text-[var(--text-tertiary)] truncate max-w-[180px]">
            {user.email}
          </span>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-brand)] rounded-full" />
        </button>

        {/* Logout */}
        {user && (
          <button
            onClick={signOut}
            title="Sair"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--bg-surface)] transition-all"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
