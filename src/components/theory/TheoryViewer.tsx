'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, RefreshCw, CheckCircle, ChevronDown, ChevronRight,
  Bookmark, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { Topic, TheorySection } from '@/types';
import { generateTheory, regenerateContent, isApiKeyConfigured } from '@/lib/gemini';
import { useProgressStore, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { allTheory } from '@/data/content-index';
import StudyBuddy from '@/components/fun/StudyBuddy';

interface TheoryViewerProps {
  topic: Topic;
}

const sectionIcons: Record<string, React.ReactNode> = {
  introduction: <BookOpen size={16} />,
  fundamentals: <BookOpen size={16} />,
  definitions: <BookOpen size={16} />,
  technical: <BookOpen size={16} />,
  examples: <BookOpen size={16} />,
  comparisons: <BookOpen size={16} />,
  exam_tips: <AlertCircle size={16} />,
  gotchas: <AlertCircle size={16} />,
  summary: <Bookmark size={16} />,
  checklist: <CheckCircle size={16} />,
};

const sectionLabels: Record<string, string> = {
  introduction: 'Introdução',
  fundamentals: 'Fundamentação Teórica',
  definitions: 'Definições Formais',
  technical: 'Explicação Técnica',
  examples: 'Exemplos Práticos',
  comparisons: 'Comparações',
  exam_tips: 'Aplicação em Prova',
  gotchas: 'Pegadinhas Comuns',
  summary: 'Resumo Estratégico',
  checklist: 'Checklist de Revisão',
};

export default function TheoryViewer({ topic }: TheoryViewerProps) {
  const [sections, setSections] = useState<TheorySection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [readingStartTime] = useState(Date.now());
  
  const { markTheoryComplete, addTheoryReadTime, topicProgress } = useProgressStore();
  const { setIsGenerating } = useUIStore();
  const progress = topicProgress[topic.id];

  const loadTheory = useCallback(async () => {
    // Check for pre-built static content
    const staticContent = allTheory[topic.id];
    if (staticContent && staticContent.length > 0) {
      setSections(staticContent);
      setExpandedSections({ [staticContent[0].id]: true });
      return;
    }

    if (!isApiKeyConfigured()) {
      setError('Configure sua API Key do Gemini nas Configurações para gerar conteúdo teórico.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateTheory(topic.id, topic.title, topic.description, topic.references);
      setSections(result);
      // Auto-expand first section
      if (result.length > 0) {
        setExpandedSections({ [result[0].id]: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar conteúdo teórico');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  }, [topic, setIsGenerating]);

  useEffect(() => {
    loadTheory();
  }, [loadTheory]);

  // Track reading time on unmount
  useEffect(() => {
    return () => {
      const elapsed = Math.floor((Date.now() - readingStartTime) / 1000);
      if (elapsed > 10) { // Only count if read for more than 10s
        addTheoryReadTime(topic.id, elapsed);
      }
    };
  }, [topic.id, readingStartTime, addTheoryReadTime]);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    setIsGenerating(true);
    try {
      const result = await regenerateContent('theory', topic.id, topic.title, topic.description, topic.references);
      setSections(result as TheorySection[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao regenerar conteúdo');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleMarkComplete = () => {
    markTheoryComplete(topic.id);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach(s => { all[s.id] = true; });
    setExpandedSections(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="text-[var(--color-brand)] animate-spin mb-4" />
        <p className="text-sm text-[var(--text-secondary)]">Gerando conteúdo teórico com IA...</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">Isso pode levar alguns segundos</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-static p-8 text-center">
        <AlertCircle size={40} className="text-[var(--color-warning)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-secondary)] mb-4">{error}</p>
        <button
          onClick={loadTheory}
          className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white text-sm font-medium hover:bg-[var(--color-brand-dark)] transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)]"
          >
            Expandir Tudo
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)]"
          >
            Recolher Tudo
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)]"
          >
            <RefreshCw size={12} />
            Regenerar
          </button>
          {!progress?.theoryCompleted && (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[var(--color-success)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <CheckCircle size={12} />
              Marcar como Concluído
            </button>
          )}
          {progress?.theoryCompleted && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-success)] bg-[rgba(16,185,129,0.1)] font-medium">
              <CheckCircle size={12} />
              Concluído
            </span>
          )}
        </div>
      </div>

      {/* Reading time indicator */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
        <Clock size={12} />
        <span>Tempo estimado de leitura: ~{topic.estimatedHours * 6} min</span>
      </div>

      {/* Study Buddy */}
      <StudyBuddy context="theory" />

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card-static overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <span className="text-[var(--color-brand)]">
                {sectionIcons[section.type] || <BookOpen size={16} />}
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">
                {sectionLabels[section.type] || section.title}
              </span>
              {expandedSections[section.id] ? (
                <ChevronDown size={16} className="text-[var(--text-tertiary)]" />
              ) : (
                <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
              )}
            </button>

            {/* Section Content */}
            <AnimatePresence>
              {expandedSections[section.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-[var(--border-default)]">
                    <div
                      className="theory-content pt-4"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(section.content) }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Simple markdown to HTML converter
function formatMarkdown(text: string): string {
  let html = text
    // Remove section markers
    .replace(/\[SECTION:\w+\]/g, '')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Paragraphs (lines with content that aren't already wrapped)
    .replace(/^(?!<[hluob])(.+)$/gm, '<p>$1</p>')
    // Wrap consecutive li elements
    .replace(/(<li>[\s\S]*?<\/li>(\n)?)+/g, '<ul>$&</ul>');
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}
