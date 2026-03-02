'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Target, BookOpen, CheckCircle } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProgressBar from '@/components/ui/ProgressBar';
import { useProgressStore } from '@/lib/store';
import { syllabus, blocoNumeral, getAllTopics, getTopicById } from '@/data/syllabus';
import { formatTime, formatPercent, getMasteryColor, getMasteryLabel, getMasteryColor as mc } from '@/lib/utils';

export default function ProgressPage() {
  const { topicProgress, exerciseAttempts, studySessions, currentStreak, longestStreak } = useProgressStore();
  const allTopics = getAllTopics();
  const allProgress = Object.values(topicProgress);

  // Overall stats
  const theoryDone = allProgress.filter(p => p.theoryCompleted).length;
  const totalExercises = allProgress.reduce((s, p) => s + p.exercisesCompleted, 0);
  const totalCorrect = allProgress.reduce((s, p) => s + p.exercisesCorrect, 0);
  const totalTime = allProgress.reduce((s, p) => s + p.theoryReadTime, 0) + exerciseAttempts.reduce((s, a) => s + a.timeSpent, 0);
  const overallAccuracy = totalExercises > 0 ? formatPercent(totalCorrect, totalExercises) : 0;

  // Mastery distribution
  const masteryDist = {
    not_started: allProgress.filter(p => p.masteryLevel === 'not_started').length,
    beginner: allProgress.filter(p => p.masteryLevel === 'beginner').length,
    intermediate: allProgress.filter(p => p.masteryLevel === 'intermediate').length,
    advanced: allProgress.filter(p => p.masteryLevel === 'advanced').length,
    mastered: allProgress.filter(p => p.masteryLevel === 'mastered').length,
  };

  // Weak topics
  const weakTopics = allProgress
    .filter(p => p.exercisesTotal > 0 && (p.exercisesCorrect / p.exercisesTotal) < 0.6)
    .sort((a, b) => (a.exercisesCorrect / a.exercisesTotal) - (b.exercisesCorrect / b.exercisesTotal))
    .slice(0, 10);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Breadcrumb items={[{ label: 'Progresso Detalhado' }]} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Progresso Detalhado</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Acompanhe sua evolução completa</p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <BookOpen size={20} />, label: 'Teoria Completa', value: `${theoryDone}/${allTopics.length}`, color: 'var(--color-brand)' },
          { icon: <Target size={20} />, label: 'Taxa de Acerto', value: `${overallAccuracy}%`, color: 'var(--color-success)' },
          { icon: <Clock size={20} />, label: 'Tempo Total', value: formatTime(totalTime), color: 'var(--color-purple)' },
          { icon: <TrendingUp size={20} />, label: 'Streak', value: `${currentStreak}d (max: ${longestStreak}d)`, color: 'var(--color-warning)' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-static p-4">
            <div className="p-2 rounded-lg w-fit mb-2" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
            <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bloco Progress */}
      <div className="card-static p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-[var(--color-brand)]" />
          Progresso por Bloco
        </h2>
        <div className="space-y-6">
          {syllabus.blocos.map(bloco => {
            const completed = bloco.topics.filter(t => topicProgress[t.id]?.theoryCompleted).length;
            const percent = formatPercent(completed, bloco.topics.length);
            const exercisesDone = bloco.topics.reduce((s, t) => s + (topicProgress[t.id]?.exercisesCompleted || 0), 0);
            const exercisesCorrect = bloco.topics.reduce((s, t) => s + (topicProgress[t.id]?.exercisesCorrect || 0), 0);
            const accuracy = exercisesDone > 0 ? formatPercent(exercisesCorrect, exercisesDone) : 0;

            return (
              <div key={bloco.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: bloco.color }}>
                      {blocoNumeral(bloco.number)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{bloco.title}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{completed}/{bloco.topics.length} tópicos · {exercisesDone} exercícios · {accuracy}% acerto</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: bloco.color }}>{percent}%</span>
                </div>
                <ProgressBar value={percent} size="sm" color={bloco.color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mastery Distribution */}
      <div className="card-static p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">📊 Distribuição de Domínio</h2>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(masteryDist).map(([level, count]) => (
            <div key={level} className="text-center p-3 rounded-lg bg-[var(--bg-surface)]">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: mc(level as Parameters<typeof mc>[0]) }} />
              <p className="text-lg font-bold text-[var(--text-primary)]">{count}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">{getMasteryLabel(level as Parameters<typeof getMasteryLabel>[0])}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="card-static p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">⚠️ Tópicos com Menor Desempenho</h2>
          <div className="space-y-2">
            {weakTopics.map(p => {
              const topic = getTopicById(p.topicId);
              if (!topic) return null;
              const accuracy = p.exercisesTotal > 0 ? formatPercent(p.exercisesCorrect, p.exercisesTotal) : 0;
              return (
                <div key={p.topicId} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)]">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{topic.title}</span>
                  </div>
                  <span className="text-xs font-medium text-[var(--color-error)]">{accuracy}% acerto</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Topics Detail */}
      <div className="card-static p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-[var(--color-success)]" />
          Todos os Tópicos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--text-tertiary)] border-b border-[var(--border-default)]">
                <th className="pb-2 pr-4">Tópico</th>
                <th className="pb-2 pr-4">Teoria</th>
                <th className="pb-2 pr-4">Exercícios</th>
                <th className="pb-2 pr-4">Acerto</th>
                <th className="pb-2">Domínio</th>
              </tr>
            </thead>
            <tbody>
              {allTopics.map(topic => {
                const p = topicProgress[topic.id];
                const accuracy = p?.exercisesTotal ? formatPercent(p.exercisesCorrect, p.exercisesTotal) : 0;
                const mastery = p?.masteryLevel || 'not_started';
                return (
                  <tr key={topic.id} className="border-b border-[var(--border-default)] last:border-0">
                    <td className="py-2 pr-4 text-[var(--text-secondary)]">{topic.title}</td>
                    <td className="py-2 pr-4">
                      {p?.theoryCompleted ? (
                        <span className="text-[var(--color-success)]">✓</span>
                      ) : (
                        <span className="text-[var(--text-tertiary)]">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-[var(--text-tertiary)]">{p?.exercisesCompleted || 0}</td>
                    <td className="py-2 pr-4 text-[var(--text-tertiary)]">{accuracy}%</td>
                    <td className="py-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${getMasteryColor(mastery)}20`, color: getMasteryColor(mastery) }}>
                        {getMasteryLabel(mastery)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
