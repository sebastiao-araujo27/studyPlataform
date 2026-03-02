// ===== UTILITY FUNCTIONS =====

import { MasteryLevel, Difficulty } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}min`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatPercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getMasteryColor(level: MasteryLevel): string {
  const colors: Record<MasteryLevel, string> = {
    not_started: '#6e7681',
    beginner: '#f59e0b',
    intermediate: '#3b82f6',
    advanced: '#8b5cf6',
    mastered: '#10b981'
  };
  return colors[level];
}

export function getMasteryLabel(level: MasteryLevel): string {
  const labels: Record<MasteryLevel, string> = {
    not_started: 'Não iniciado',
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
    mastered: 'Dominado'
  };
  return labels[level];
}

export function getDifficultyColor(difficulty: Difficulty | string): string {
  const colors: Record<string, string> = {
    facil: '#10b981',
    easy: '#10b981',
    medio: '#f59e0b',
    medium: '#f59e0b',
    dificil: '#ef4444',
    hard: '#ef4444'
  };
  return colors[difficulty] || '#8b949e';
}

export function getDifficultyLabel(difficulty: Difficulty | string): string {
  const labels: Record<string, string> = {
    facil: 'Fácil',
    easy: 'Fácil',
    medio: 'Médio',
    medium: 'Médio',
    dificil: 'Difícil',
    hard: 'Difícil'
  };
  return labels[difficulty] || difficulty;
}

// Spaced repetition intervals (days)
export function getNextReviewDate(correctCount: number): Date {
  const intervals = [1, 3, 7, 14, 30, 60, 90];
  const index = Math.min(correctCount, intervals.length - 1);
  const days = intervals[index];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
