'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const STUDY_BUDDY_GIF = 'https://media1.tenor.com/m/WFS1hDHD4ykAAAAd/zaunvi-caitvitwt.gif';

const encouragements = [
  'Você tá mandando bem! 💪',
  'Foco no concurso! 🎯',
  'Cada questão conta! 📝',
  'Bora dominar esse assunto! 🚀',
  'Confia no processo! ✨',
  'Tá ficando craque! 🧠',
  'Não desiste não! 🔥',
  'Orgulho de você! 🌟',
  'Estuda que a aprovação vem! 📚',
  'Mais um pouco, tá quase lá! ⏳',
];

interface StudyBuddyProps {
  context?: 'theory' | 'exercises' | 'flashcards';
}

export default function StudyBuddy({ context = 'theory' }: StudyBuddyProps) {
  const [visible, setVisible] = useState(true);
  const [showBubble, setShowBubble] = useState(false);
  const [message, setMessage] = useState('');
  const [minimized, setMinimized] = useState(false);

  // Show random encouragement periodically
  useEffect(() => {
    // Initial greeting after 3s
    const initialTimeout = setTimeout(() => {
      const greetings: Record<string, string> = {
        theory: 'Bora estudar! Lê com calma 📖',
        exercises: 'Hora de praticar! Vai com tudo! 💪',
        flashcards: 'Revisão é a chave! Memoriza aí 🧠',
      };
      setMessage(greetings[context] || 'Bora estudar! 📖');
      setShowBubble(true);
    }, 3000);

    // Random encouragement every 60-90s
    const interval = setInterval(() => {
      const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
      setMessage(randomMsg);
      setShowBubble(true);
      // Hide bubble after 5s
      setTimeout(() => setShowBubble(false), 5000);
    }, 60000 + Math.random() * 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [context]);

  // Auto-hide initial bubble after 5s
  useEffect(() => {
    if (showBubble) {
      const timeout = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showBubble]);

  if (!visible) return null;

  if (minimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-brand)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        onClick={() => setMinimized(false)}
        title="Abrir companheiro de estudos"
      >
        <MessageCircle size={20} />
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="relative bg-white dark:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-xs font-medium px-3 py-2 rounded-xl shadow-lg max-w-[180px] border border-[var(--border-default)]"
          >
            {message}
            {/* Tail */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[var(--bg-surface-elevated)] border-r border-b border-[var(--border-default)] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* GIF Container */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
        className="relative group"
      >
        {/* Close / Minimize buttons */}
        <div className="absolute -top-2 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => setMinimized(true)}
            className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-tertiary)] flex items-center justify-center text-[10px] hover:bg-[var(--bg-surface-hover)]"
            title="Minimizar"
          >
            −
          </button>
          <button
            onClick={() => setVisible(false)}
            className="w-5 h-5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-tertiary)] flex items-center justify-center hover:bg-red-100 hover:text-red-500 hover:border-red-300"
            title="Fechar"
          >
            <X size={10} />
          </button>
        </div>

        {/* Bouncing GIF */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="cursor-pointer"
          onClick={() => {
            const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
            setMessage(randomMsg);
            setShowBubble(true);
          }}
        >
          <img
            src={STUDY_BUDDY_GIF}
            alt="Study Buddy"
            className="w-20 h-20 rounded-2xl shadow-lg border-2 border-[var(--border-default)] object-cover"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
