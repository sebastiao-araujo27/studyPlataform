'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { syllabus } from '@/data/syllabus';
import { useProgressStore } from '@/lib/store';

export default function HeatMap() {
  const { topicProgress } = useProgressStore();

  // Build heatmap data: each cell = one topic, intensity = mastery level
  const intensityMap: Record<string, number> = {
    not_started: 0,
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    mastered: 4
  };

  const colorScale = [
    'rgba(139, 148, 158, 0.1)',  // not started
    'rgba(245, 158, 11, 0.4)',   // beginner
    'rgba(59, 130, 246, 0.5)',   // intermediate
    'rgba(139, 92, 246, 0.6)',   // advanced
    'rgba(16, 185, 129, 0.8)'   // mastered
  ];

  return (
    <div className="card-static p-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
        🔥 Mapa de Calor de Domínio
      </h2>
      <p className="text-xs text-[var(--text-tertiary)] mb-4">
        Cada quadrado representa um tópico. Cores mais intensas indicam maior domínio.
      </p>

      {syllabus.blocos.map(bloco => (
        <div key={bloco.id} className="mb-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
            Bloco {bloco.number} — {bloco.title}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {bloco.topics.map((topic, i) => {
              const mastery = topicProgress[topic.id]?.masteryLevel || 'not_started';
              const intensity = intensityMap[mastery];
              
              return (
                <motion.div
                  key={topic.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="heatmap-cell w-8 h-8 rounded cursor-pointer relative group"
                  style={{ backgroundColor: colorScale[intensity] }}
                  title={topic.title}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[var(--bg-surface-elevated)] text-[10px] text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg border border-[var(--border-default)]">
                    {topic.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--border-default)]">
        <span className="text-[10px] text-[var(--text-tertiary)]">Legenda:</span>
        {['Não iniciado', 'Iniciante', 'Intermediário', 'Avançado', 'Dominado'].map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colorScale[i] }} />
            <span className="text-[10px] text-[var(--text-tertiary)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
