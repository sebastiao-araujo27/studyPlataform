'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  size = 'md',
  color = 'var(--color-brand)',
  showLabel = false,
  animated = true,
  className
}: ProgressBarProps) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[var(--text-tertiary)]">Progresso</span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">{clampedValue}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-[var(--bg-surface)] overflow-hidden", heights[size])}>
        <motion.div
          className={cn("h-full rounded-full progress-shimmer", heights[size])}
          style={{ backgroundColor: color }}
          initial={animated ? { width: 0 } : { width: `${clampedValue}%` }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
