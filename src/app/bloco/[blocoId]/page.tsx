'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, FileQuestion, Brain, ArrowRight, Clock } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProgressBar from '@/components/ui/ProgressBar';
import { getBlocoById, blocoNumeral } from '@/data/syllabus';
import { useProgressStore } from '@/lib/store';
import { getMasteryColor, getMasteryLabel, formatPercent, formatTime } from '@/lib/utils';

export default function BlocoPage() {
  const params = useParams();
  const blocoId = params.blocoId as string;
  const bloco = getBlocoById(blocoId);
  const { topicProgress } = useProgressStore();

  if (!bloco) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Bloco não encontrado.</p>
      </div>
    );
  }

  const completedTopics = bloco.topics.filter(t => topicProgress[t.id]?.theoryCompleted).length;
  const totalPercent = formatPercent(completedTopics, bloco.topics.length);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[
        { label: `Bloco ${blocoNumeral(bloco.number)}` }
      ]} />

      {/* Bloco Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-static p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: bloco.color }}
          >
            {blocoNumeral(bloco.number)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Bloco {blocoNumeral(bloco.number)} — {bloco.title}
            </h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              {bloco.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-tertiary)]">
              <span>{bloco.topics.length} tópicos</span>
              <span>{completedTopics} concluídos</span>
              <span>{bloco.topics.reduce((s, t) => s + t.estimatedHours, 0)}h estimadas</span>
            </div>
            <div className="mt-3">
              <ProgressBar value={totalPercent} size="md" color={bloco.color} showLabel />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topics List */}
      <div className="space-y-3">
        {bloco.topics.map((topic, idx) => {
          const progress = topicProgress[topic.id];
          const mastery = progress?.masteryLevel || 'not_started';
          const exercisePercent = progress?.exercisesTotal
            ? formatPercent(progress.exercisesCorrect, progress.exercisesTotal)
            : 0;
          const readTime = progress?.theoryReadTime || 0;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                href={`/bloco/${blocoId}/${topic.slug}`}
                className="block card-base p-4 group"
              >
                <div className="flex items-center gap-4">
                  {/* Order Number */}
                  <span className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-xs font-bold text-[var(--text-tertiary)] shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-brand-light)] transition-colors truncate">
                        {topic.title}
                      </h3>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: `${getMasteryColor(mastery)}20`,
                          color: getMasteryColor(mastery)
                        }}
                      >
                        {getMasteryLabel(mastery)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <BookOpen size={10} />
                        {progress?.theoryCompleted ? 'Teoria concluída' : 'Teoria pendente'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileQuestion size={10} />
                        {progress?.exercisesCompleted || 0} exercícios ({exercisePercent}% acerto)
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(readTime)} estudado
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain size={10} />
                        ~{topic.estimatedHours}h estimadas
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--color-brand)] transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
