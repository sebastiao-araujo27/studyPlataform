'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, ArrowRight, RefreshCw,
  AlertCircle, Loader2, Star, Clock, BookOpen
} from 'lucide-react';
import { Topic, Exercise, ExerciseAttempt } from '@/types';
import { generateExercises, isApiKeyConfigured } from '@/lib/gemini';
import { useProgressStore, useUIStore } from '@/lib/store';
import { cn, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { allExercises } from '@/data/content-index';
import StudyBuddy from '@/components/fun/StudyBuddy';
import AnswerFeedback from '@/components/fun/AnswerFeedback';

interface ExerciseModuleProps {
  topic: Topic;
}

export default function ExerciseModule({ topic }: ExerciseModuleProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);

  const { recordExerciseAttempt } = useProgressStore();
  const { setIsGenerating } = useUIStore();

  const loadExercises = useCallback(async () => {
    // Check for pre-built static exercises
    const staticExercises = allExercises[topic.id];
    if (staticExercises && staticExercises.length > 0) {
      setExercises(staticExercises);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setStartTime(Date.now());
      return;
    }

    if (!isApiKeyConfigured()) {
      setError('Configure sua API Key do Gemini nas Configurações para gerar exercícios.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateExercises(topic.id, topic.title, topic.description);
      setExercises(result);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setStartTime(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar exercícios');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  }, [topic, setIsGenerating]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const currentExercise = exercises[currentIndex];

  const handleSelectOption = (letter: string) => {
    if (selectedOption) return; // Already answered
    
    setSelectedOption(letter);
    setShowExplanation(true);

    const isCorrect = currentExercise.options.find(o => o.letter === letter)?.isCorrect || false;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Show GIF feedback
    setFeedbackIsCorrect(isCorrect);
    setFeedbackVisible(true);

    if (isCorrect) setSessionCorrect(prev => prev + 1);
    setSessionTotal(prev => prev + 1);

    const attempt: ExerciseAttempt = {
      id: uuidv4(),
      exerciseId: currentExercise.id,
      topicId: topic.id,
      selectedOption: letter,
      isCorrect,
      timeSpent,
      timestamp: new Date().toISOString()
    };

    recordExerciseAttempt(attempt);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setStartTime(Date.now());
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setStartTime(Date.now());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="text-[var(--color-accent)] animate-spin mb-4" />
        <p className="text-sm text-[var(--text-secondary)]">Gerando exercícios com IA...</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">Criando questões no padrão CESGRANRIO</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-static p-8 text-center">
        <AlertCircle size={40} className="text-[var(--color-warning)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-secondary)] mb-4">{error}</p>
        <button
          onClick={loadExercises}
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="card-static p-8 text-center">
        <BookOpen size={40} className="text-[var(--text-tertiary)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">Nenhum exercício disponível.</p>
        <button
          onClick={loadExercises}
          className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Gerar Exercícios
        </button>
      </div>
    );
  }

  // Session completed
  if (currentIndex >= exercises.length - 1 && selectedOption) {
    const isLastAnswered = true;
    const finalAccuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    
    if (isLastAnswered && showExplanation) {
      // Show result after explanation
    }
  }

  return (
    <div className="space-y-4">
      {/* Study Buddy */}
      <StudyBuddy context="exercises" />

      {/* Answer Feedback Overlay */}
      <AnswerFeedback
        isCorrect={feedbackIsCorrect}
        visible={feedbackVisible}
        onDismiss={() => setFeedbackVisible(false)}
      />

      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[var(--text-tertiary)]">
            Questão {currentIndex + 1} de {exercises.length}
          </span>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${getDifficultyColor(currentExercise.difficulty)}20`,
              color: getDifficultyColor(currentExercise.difficulty)
            }}
          >
            {getDifficultyLabel(currentExercise.difficulty)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1">
            <CheckCircle size={12} className="text-[var(--color-success)]" />
            {sessionCorrect}/{sessionTotal}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {Math.round((sessionTotal > 0 ? (sessionCorrect / sessionTotal) : 0) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[var(--color-accent)]"
          animate={{ width: `${((currentIndex + (selectedOption ? 1 : 0)) / exercises.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card-static p-6"
      >
        {/* Source badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-tertiary)]">
            {currentExercise.source === 'cesgranrio' ? `CESGRANRIO ${currentExercise.year || ''}` : 'Questão Autoral'}
          </span>
        </div>

        {/* Question Text */}
        <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-6">
          {currentExercise.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {currentExercise.options.map(option => {
            const isSelected = selectedOption === option.letter;
            const isCorrect = option.isCorrect;
            const isRevealed = showExplanation;

            let borderColor = 'var(--border-default)';
            let bgColor = 'transparent';

            if (isRevealed) {
              if (isCorrect) {
                borderColor = 'var(--color-success)';
                bgColor = 'rgba(16, 185, 129, 0.08)';
              } else if (isSelected && !isCorrect) {
                borderColor = 'var(--color-error)';
                bgColor = 'rgba(239, 68, 68, 0.08)';
              }
            } else if (isSelected) {
              borderColor = 'var(--color-brand)';
              bgColor = 'rgba(59, 130, 246, 0.08)';
            }

            return (
              <button
                key={option.letter}
                onClick={() => handleSelectOption(option.letter)}
                disabled={!!selectedOption}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                  !selectedOption && "hover:border-[var(--color-brand)] hover:bg-[rgba(59,130,246,0.05)] cursor-pointer",
                  selectedOption && "cursor-default"
                )}
                style={{ borderColor, backgroundColor: bgColor }}
              >
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                    isRevealed && isCorrect && "bg-[var(--color-success)] border-[var(--color-success)] text-white",
                    isRevealed && isSelected && !isCorrect && "bg-[var(--color-error)] border-[var(--color-error)] text-white",
                    !isRevealed && !isSelected && "border-[var(--border-default)] text-[var(--text-tertiary)]",
                    !isRevealed && isSelected && "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                  )}
                >
                  {isRevealed && isCorrect ? <CheckCircle size={14} /> :
                   isRevealed && isSelected && !isCorrect ? <XCircle size={14} /> :
                   option.letter}
                </span>
                <span className="text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
                {/* Correct answer highlight */}
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-success)]">
                  <CheckCircle size={16} />
                  Resposta correta: {currentExercise.options.find(o => o.isCorrect)?.letter}
                </div>

                {/* Detailed Explanation */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                    Explicação Detalhada
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {currentExercise.detailedExplanation}
                  </p>
                </div>

                {/* Technical Justification */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                    Justificativa Técnica
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {currentExercise.technicalJustification}
                  </p>
                </div>

                {/* Individual option explanations */}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                    Análise das Alternativas
                  </h4>
                  <div className="space-y-2">
                    {currentExercise.options.map(opt => (
                      <div key={opt.letter} className="flex items-start gap-2">
                        <span className={cn(
                          "text-xs font-bold shrink-0 mt-0.5",
                          opt.isCorrect ? "text-[var(--color-success)]" : "text-[var(--text-tertiary)]"
                        )}>
                          {opt.letter})
                        </span>
                        <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                          {opt.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Concepts */}
                {currentExercise.relatedConcepts.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[var(--border-default)]">
                    <span className="text-[10px] text-[var(--text-tertiary)]">Conceitos:</span>
                    {currentExercise.relatedConcepts.map((concept, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]">
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-4">
                {currentIndex < exercises.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white text-sm font-medium hover:bg-[var(--color-brand-dark)] transition-colors ml-auto"
                  >
                    Próxima Questão
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <div className="w-full text-center space-y-3">
                    <div className="p-4 rounded-lg bg-[var(--bg-surface)]">
                      <Star size={24} className="text-[var(--color-warning)] mx-auto mb-2" />
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Sessão Concluída!
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Acertou {sessionCorrect} de {sessionTotal} ({sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0}%)
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleRestart}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] text-sm border border-[var(--border-default)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <RefreshCw size={14} />
                        Refazer
                      </button>
                      <button
                        onClick={loadExercises}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <RefreshCw size={14} />
                        Gerar Novas Questões
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
