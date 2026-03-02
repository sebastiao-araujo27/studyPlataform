'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, CheckCircle, Clock, Target,
  Flame, TrendingUp, AlertTriangle, BarChart3
} from 'lucide-react';
import { useProgressStore } from '@/lib/store';
import { formatTime, formatPercent } from '@/lib/utils';
import { getAllTopics } from '@/data/syllabus';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function StatsCards() {
  const { topicProgress, currentStreak, longestStreak, exerciseAttempts } = useProgressStore();
  const allTopics = getAllTopics();
  const allProgress = Object.values(topicProgress);
  
  const completedTheory = allProgress.filter(p => p.theoryCompleted).length;
  const totalExercises = allProgress.reduce((s, p) => s + p.exercisesCompleted, 0);
  const correctExercises = allProgress.reduce((s, p) => s + p.exercisesCorrect, 0);
  const totalStudyTime = allProgress.reduce((s, p) => s + p.theoryReadTime, 0) +
    exerciseAttempts.reduce((s, a) => s + a.timeSpent, 0);
  const accuracy = totalExercises > 0 ? formatPercent(correctExercises, totalExercises) : 0;
  
  const weakCount = allProgress.filter(p => {
    if (p.exercisesTotal === 0) return false;
    return (p.exercisesCorrect / p.exercisesTotal) < 0.6;
  }).length;

  const stats = [
    {
      icon: <BookOpen size={20} />,
      label: 'Teoria Concluída',
      value: `${completedTheory}/${allTopics.length}`,
      percent: formatPercent(completedTheory, allTopics.length),
      color: 'var(--color-brand)',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      icon: <CheckCircle size={20} />,
      label: 'Exercícios Feitos',
      value: totalExercises.toString(),
      percent: accuracy,
      color: 'var(--color-success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      icon: <Target size={20} />,
      label: 'Taxa de Acerto',
      value: `${accuracy}%`,
      color: 'var(--color-accent)',
      bgColor: 'rgba(6, 182, 212, 0.1)',
    },
    {
      icon: <Clock size={20} />,
      label: 'Tempo de Estudo',
      value: formatTime(totalStudyTime),
      color: 'var(--color-purple)',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      icon: <Flame size={20} />,
      label: 'Streak Atual',
      value: `${currentStreak} dias`,
      subValue: `Recorde: ${longestStreak}`,
      color: 'var(--color-warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Progresso Geral',
      value: `${formatPercent(completedTheory, allTopics.length)}%`,
      color: 'var(--color-teal)',
      bgColor: 'rgba(20, 184, 166, 0.1)',
    },
    {
      icon: <AlertTriangle size={20} />,
      label: 'Pontos Fracos',
      value: weakCount.toString(),
      subValue: 'tópicos < 60%',
      color: 'var(--color-error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      icon: <BarChart3 size={20} />,
      label: 'Edital Coberto',
      value: `${formatPercent(completedTheory, allTopics.length)}%`,
      color: 'var(--color-brand-light)',
      bgColor: 'rgba(96, 165, 250, 0.1)',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={item}
          className="card-static p-4 hover:border-[var(--border-accent)] transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: stat.bgColor, color: stat.color }}
            >
              {stat.icon}
            </div>
            {stat.percent !== undefined && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                {stat.percent}%
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{stat.label}</p>
          {stat.subValue && (
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{stat.subValue}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
