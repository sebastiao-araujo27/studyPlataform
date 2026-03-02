'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCards from '@/components/dashboard/StatsCards';
import BlocoCards from '@/components/dashboard/BlocoCards';
import ProgressRoadmap from '@/components/dashboard/ProgressRoadmap';
import HeatMap from '@/components/dashboard/HeatMap';
import { useProgressStore } from '@/lib/store';

export default function DashboardPage() {
  const { initializeProgress } = useProgressStore();

  useEffect(() => {
    initializeProgress();
  }, [initializeProgress]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Dashboard de Estudos
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Analista de Sistemas – Processos de Negócio
        </p>
      </motion.div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Blocos Overview */}
      <div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">
          📚 Blocos do Edital
        </h2>
        <BlocoCards />
      </div>

      {/* Two-column layout for roadmap + heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressRoadmap />
        <div className="space-y-6">
          <HeatMap />
          
          {/* Quick Tips */}
          <div className="card-static p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">
              💡 Dicas de Estudo
            </h2>
            <div className="space-y-3">
              {[
                { title: 'Revisão Espaçada', desc: 'Revise tópicos em intervalos de 1, 7, e 30 dias para fixação permanente.' },
                { title: 'Foco nos Pontos Fracos', desc: 'Priorize tópicos com taxa de acerto abaixo de 60% nos exercícios.' },
                { title: 'Simulado por Bloco', desc: 'Após concluir a teoria, faça simulados por bloco completo.' },
                { title: 'Flashcards Diários', desc: 'Reserve 15 minutos por dia para revisão rápida com flashcards.' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)]">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)] text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{tip.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
