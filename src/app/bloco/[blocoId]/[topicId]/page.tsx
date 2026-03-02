'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, FileQuestion, Brain, Star, Heart } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TheoryViewer from '@/components/theory/TheoryViewer';
import ExerciseModule from '@/components/exercises/ExerciseModule';
import FlashcardModule from '@/components/flashcards/FlashcardModule';
import { getBlocoById, getTopicBySlug, blocoNumeral } from '@/data/syllabus';
import { useProgressStore } from '@/lib/store';
import { cn, getMasteryColor, getMasteryLabel } from '@/lib/utils';

type Tab = 'theory' | 'exercises' | 'flashcards';

export default function TopicPage() {
  const params = useParams();
  const blocoId = params.blocoId as string;
  const topicSlug = params.topicId as string;
  const [activeTab, setActiveTab] = useState<Tab>('theory');

  const bloco = getBlocoById(blocoId);
  const topic = getTopicBySlug(blocoId, topicSlug);
  const { topicProgress, toggleFavorite } = useProgressStore();

  if (!bloco || !topic) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Tópico não encontrado.</p>
      </div>
    );
  }

  const progress = topicProgress[topic.id];
  const mastery = progress?.masteryLevel || 'not_started';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: 'Teoria', icon: <BookOpen size={16} /> },
    { id: 'exercises', label: 'Exercícios', icon: <FileQuestion size={16} /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Brain size={16} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: `Bloco ${blocoNumeral(bloco.number)}`, href: `/bloco/${blocoId}` },
        { label: topic.title }
      ]} />

      {/* Topic Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-static p-5 mb-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                {topic.title}
              </h1>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${getMasteryColor(mastery)}20`,
                  color: getMasteryColor(mastery)
                }}
              >
                {getMasteryLabel(mastery)}
              </span>
            </div>
            <p className="text-sm text-[var(--text-tertiary)]">{topic.description}</p>
            
            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {topic.keywords.map(kw => (
                <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-default)]">
                  {kw}
                </span>
              ))}
            </div>

            {/* References */}
            {topic.references.length > 0 && (
              <div className="mt-3 text-[10px] text-[var(--text-tertiary)]">
                <span className="font-semibold">Referências:</span> {topic.references.join(' · ')}
              </div>
            )}
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(topic.id)}
            className={cn(
              "p-2 rounded-lg transition-all",
              progress?.isFavorite
                ? "text-[var(--color-warning)] bg-[rgba(245,158,11,0.1)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--color-warning)] hover:bg-[var(--bg-surface)]"
            )}
          >
            {progress?.isFavorite ? <Star size={20} fill="currentColor" /> : <Heart size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-[var(--color-brand)] text-white shadow-lg"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'theory' && <TheoryViewer topic={topic} />}
        {activeTab === 'exercises' && <ExerciseModule topic={topic} />}
        {activeTab === 'flashcards' && <FlashcardModule topic={topic} />}
      </motion.div>
    </div>
  );
}
