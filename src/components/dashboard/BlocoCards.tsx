'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { syllabus, blocoNumeral } from '@/data/syllabus';
import { useProgressStore } from '@/lib/store';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatPercent } from '@/lib/utils';

export default function BlocoCards() {
  const { topicProgress } = useProgressStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {syllabus.blocos.map((bloco, idx) => {
        const completed = bloco.topics.filter(t => topicProgress[t.id]?.theoryCompleted).length;
        const percent = formatPercent(completed, bloco.topics.length);
        const exercisesDone = bloco.topics.reduce((s, t) => s + (topicProgress[t.id]?.exercisesCompleted || 0), 0);
        const exercisesCorrect = bloco.topics.reduce((s, t) => s + (topicProgress[t.id]?.exercisesCorrect || 0), 0);
        const accuracy = exercisesDone > 0 ? formatPercent(exercisesCorrect, exercisesDone) : 0;

        return (
          <motion.div
            key={bloco.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={`/bloco/${bloco.id}`}
              className="block card-base p-5 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: bloco.color }}
                >
                  {blocoNumeral(bloco.number)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--color-brand-light)] transition-colors">
                    Bloco {blocoNumeral(bloco.number)}
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)]">{bloco.title}</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-tertiary)] mb-4 line-clamp-2">
                {bloco.description}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-tertiary)]">Teoria</span>
                    <span className="text-[var(--text-secondary)]">{completed}/{bloco.topics.length}</span>
                  </div>
                  <ProgressBar value={percent} size="sm" color={bloco.color} />
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Exercícios</span>
                  <span className="text-[var(--text-secondary)]">{exercisesDone} feitos</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Taxa de acerto</span>
                  <span className="text-[var(--text-secondary)]">{accuracy}%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-default)]">
                <span className="text-xs font-medium text-[var(--color-brand-light)] group-hover:text-[var(--color-brand)] transition-colors">
                  Acessar Bloco →
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
