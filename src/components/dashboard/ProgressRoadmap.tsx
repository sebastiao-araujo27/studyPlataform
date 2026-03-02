'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { syllabus, blocoNumeral } from '@/data/syllabus';
import { useProgressStore } from '@/lib/store';
import { getMasteryColor, getMasteryLabel } from '@/lib/utils';

export default function ProgressRoadmap() {
  const { topicProgress } = useProgressStore();

  return (
    <div className="card-static p-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">
        🗺️ Roadmap do Edital
      </h2>
      
      <div className="space-y-8">
        {syllabus.blocos.map((bloco, blocoIdx) => {
          const completedCount = bloco.topics.filter(t => topicProgress[t.id]?.theoryCompleted).length;
          const percent = Math.round((completedCount / bloco.topics.length) * 100);
          
          return (
            <div key={bloco.id}>
              {/* Bloco Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: bloco.color }}
                >
                  {blocoNumeral(bloco.number)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{bloco.title}</h3>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {completedCount}/{bloco.topics.length} tópicos · {percent}%
                  </p>
                </div>
                {/* Mini bar */}
                <div className="w-20 h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: bloco.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: blocoIdx * 0.2 }}
                  />
                </div>
              </div>

              {/* Metro Line */}
              <div className="metro-line space-y-2 ml-2">
                {bloco.topics.map((topic, topicIdx) => {
                  const progress = topicProgress[topic.id];
                  const mastery = progress?.masteryLevel || 'not_started';
                  const isCompleted = progress?.theoryCompleted;
                  
                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: blocoIdx * 0.1 + topicIdx * 0.03 }}
                    >
                      <Link
                        href={`/bloco/${bloco.id}/${topic.slug}`}
                        className={`metro-station ${isCompleted ? 'completed' : mastery !== 'not_started' ? 'active' : ''} block py-2 group`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
                              {topic.title}
                            </p>
                          </div>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-2 shrink-0"
                            style={{
                              backgroundColor: `${getMasteryColor(mastery)}20`,
                              color: getMasteryColor(mastery)
                            }}
                          >
                            {getMasteryLabel(mastery)}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
