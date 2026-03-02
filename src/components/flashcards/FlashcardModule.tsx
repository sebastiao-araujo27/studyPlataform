'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ThumbsUp, ThumbsDown, Loader2, AlertCircle } from 'lucide-react';
import { Topic, Flashcard } from '@/types';
import { generateFlashcards, isApiKeyConfigured } from '@/lib/gemini';
import { cn, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import { allFlashcards } from '@/data/content-index';

interface FlashcardModuleProps {
  topic: Topic;
}

export default function FlashcardModule({ topic }: FlashcardModuleProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  const loadFlashcards = useCallback(async () => {
    // Check for pre-built static flashcards
    const staticFlashcards = allFlashcards[topic.id];
    if (staticFlashcards && staticFlashcards.length > 0) {
      setFlashcards(staticFlashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStats({ correct: 0, incorrect: 0 });
      return;
    }

    if (!isApiKeyConfigured()) {
      setError('Configure sua API Key do Gemini nas Configurações.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateFlashcards(topic.id, topic.title, topic.description);
      setFlashcards(result);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStats({ correct: 0, incorrect: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar flashcards');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleResponse = (correct: boolean) => {
    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1)
    }));

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="text-[var(--color-purple)] animate-spin mb-4" />
        <p className="text-sm text-[var(--text-secondary)]">Gerando flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-static p-8 text-center">
        <AlertCircle size={40} className="text-[var(--color-warning)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-secondary)] mb-4">{error}</p>
        <button onClick={loadFlashcards} className="px-4 py-2 rounded-lg bg-[var(--color-purple)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          Tentar Novamente
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  if (!currentCard) return null;

  const isCompleted = currentIndex >= flashcards.length - 1 && stats.correct + stats.incorrect >= flashcards.length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-tertiary)]">
          Card {currentIndex + 1} de {flashcards.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[var(--color-success)]">
            <ThumbsUp size={12} /> {stats.correct}
          </span>
          <span className="flex items-center gap-1 text-[var(--color-error)]">
            <ThumbsDown size={12} /> {stats.incorrect}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[var(--color-purple)]"
          animate={{ width: `${((currentIndex + (isCompleted ? 1 : 0)) / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="flashcard-container w-full max-w-lg mx-auto" style={{ minHeight: '280px' }}>
        <div
          className={cn("flashcard-inner cursor-pointer", isFlipped && "flipped")}
          onClick={handleFlip}
          style={{ minHeight: '280px' }}
        >
          {/* Front */}
          <div className="flashcard-front card-static p-8 flex flex-col items-center justify-center text-center" style={{ minHeight: '280px' }}>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full mb-4"
              style={{
                backgroundColor: `${getDifficultyColor(currentCard.difficulty)}20`,
                color: getDifficultyColor(currentCard.difficulty)
              }}
            >
              {getDifficultyLabel(currentCard.difficulty)}
            </span>
            <p className="text-base text-[var(--text-primary)] leading-relaxed font-medium">
              {currentCard.front}
            </p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-4">Clique para virar</p>
          </div>

          {/* Back */}
          <div className="flashcard-back card-static p-8 flex flex-col items-center justify-center text-center border-[var(--color-purple)]" style={{ minHeight: '280px', borderColor: 'var(--color-purple)' }}>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isFlipped && !isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={() => handleResponse(false)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] text-sm font-medium hover:bg-[rgba(239,68,68,0.2)] transition-colors border border-[var(--color-error)]/30"
          >
            <ThumbsDown size={16} />
            Não sabia
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] text-sm font-medium hover:bg-[rgba(16,185,129,0.2)] transition-colors border border-[var(--color-success)]/30"
          >
            <ThumbsUp size={16} />
            Sabia
          </button>
        </motion.div>
      )}

      {/* Completed */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-3"
        >
          <p className="text-sm font-medium text-[var(--text-primary)]">Revisão Completa!</p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Acertou {stats.correct} de {flashcards.length}
          </p>
          <button
            onClick={loadFlashcards}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-purple)] text-white text-sm font-medium mx-auto hover:opacity-90 transition-opacity"
          >
            <RotateCcw size={14} />
            Recomeçar
          </button>
        </motion.div>
      )}
    </div>
  );
}
