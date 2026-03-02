'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Shield, Lock, ChevronDown, ChevronRight,
  Home, BookOpen, Settings, X, Flame, BarChart3
} from 'lucide-react';
import { syllabus, blocoNumeral } from '@/data/syllabus';
import { useProgressStore, useUIStore } from '@/lib/store';
import { cn, getMasteryColor } from '@/lib/utils';

const blocoIcons: Record<string, React.ReactNode> = {
  'Database': <Database size={18} />,
  'Shield': <Shield size={18} />,
  'Lock': <Lock size={18} />,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { topicProgress, currentStreak, initializeProgress } = useProgressStore();
  const [expandedBlocos, setExpandedBlocos] = React.useState<Record<string, boolean>>({
    'bloco-1': true,
    'bloco-2': false,
    'bloco-3': false,
  });

  useEffect(() => {
    initializeProgress();
  }, [initializeProgress]);

  const toggleBloco = (blocoId: string) => {
    setExpandedBlocos(prev => ({ ...prev, [blocoId]: !prev[blocoId] }));
  };

  const getBlocoCompletionPercent = (blocoId: string) => {
    const bloco = syllabus.blocos.find(b => b.id === blocoId);
    if (!bloco) return 0;
    const completed = bloco.topics.filter(t => topicProgress[t.id]?.theoryCompleted).length;
    return Math.round((completed / bloco.topics.length) * 100);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col",
          "bg-[var(--bg-secondary)] border-r border-[var(--border-default)]",
          "md:relative md:translate-x-0"
        )}
        style={{ willChange: 'transform' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
              PS
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--color-brand-light)] transition-colors">
                Study Platform
              </h1>
              <p className="text-[10px] text-[var(--text-tertiary)]">Ênfase 6 · Processos de Negócio</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Streak */}
        {currentStreak > 0 && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center gap-2 streak-active">
            <Flame size={16} className="text-[var(--color-warning)]" />
            <span className="text-xs font-medium text-[var(--color-warning)]">
              {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'} consecutivos
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              pathname === '/'
                ? "bg-[var(--color-brand)]/10 text-[var(--color-brand-light)] font-medium"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            )}
          >
            <Home size={16} />
            Dashboard
          </Link>

          <Link
            href="/progresso"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              pathname === '/progresso'
                ? "bg-[var(--color-brand)]/10 text-[var(--color-brand-light)] font-medium"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            )}
          >
            <BarChart3 size={16} />
            Progresso Detalhado
          </Link>

          {/* Divider */}
          <div className="pt-2 pb-1">
            <p className="px-3 text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-semibold">
              Blocos do Edital
            </p>
          </div>

          {/* Blocos */}
          {syllabus.blocos.map(bloco => (
            <div key={bloco.id} className="space-y-0.5">
              {/* Bloco Header */}
              <button
                onClick={() => toggleBloco(bloco.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                )}
              >
                <span style={{ color: bloco.color }}>
                  {blocoIcons[bloco.icon]}
                </span>
                <span className="flex-1 text-left font-medium text-xs">
                  Bloco {blocoNumeral(bloco.number)}
                </span>
                {/* Mini progress */}
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  {getBlocoCompletionPercent(bloco.id)}%
                </span>
                {expandedBlocos[bloco.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {/* Bloco Topics */}
              <AnimatePresence>
                {expandedBlocos[bloco.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 pl-3 border-l border-[var(--border-default)] space-y-0.5">
                      {bloco.topics.map(topic => {
                        const progress = topicProgress[topic.id];
                        const mastery = progress?.masteryLevel || 'not_started';
                        const isActive = pathname === `/bloco/${bloco.id}/${topic.slug}`;
                        
                        return (
                          <Link
                            key={topic.id}
                            href={`/bloco/${bloco.id}/${topic.slug}`}
                            className={cn(
                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all group",
                              isActive
                                ? "bg-[var(--color-brand)]/10 text-[var(--color-brand-light)]"
                                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                            )}
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: getMasteryColor(mastery) }}
                            />
                            <span className="truncate">{topic.title}</span>
                            {progress?.isFavorite && (
                              <BookOpen size={10} className="text-[var(--color-warning)] shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border-default)]">
          <Link
            href="/configuracoes"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all"
          >
            <Settings size={14} />
            Configurações
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
