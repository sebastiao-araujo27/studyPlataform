'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── GIF URLs ──────────────────────────────────────────────────────────
const CORRECT_GIFS = [
  'https://media1.tenor.com/m/tTcvQk0Aoe0AAAAd/imagination-redirection.gif',
  'https://media1.tenor.com/m/L2pY9Js5HkMAAAAd/excited-spongebobsquarepants.gif',
  'https://media1.tenor.com/m/e37DXq7hP5IAAAAd/yay-yasss.gif',
];

const WRONG_GIFS = [
  'https://media1.tenor.com/m/39T9aiREjKIAAAAd/spongebob-spongebob-meme.gif',
  'https://media1.tenor.com/m/Fi9FJPmE8GIAAAAd/bob-esponja.gif',
];

const CORRECT_MESSAGES = [
  'Mandou bem demais! 🎉',
  'Acertou na mosca! 🎯',
  'É isso aí, craque! 🏆',
  'Show de bola! ⭐',
  'Arrasou!! 🔥',
  'Tá voando! ✈️',
];

const WRONG_MESSAGES = [
  'Não desanima! Faz parte do processo 💪',
  'Erra quem tenta! Bora pra próxima 🚀',
  'Aprendeu com o erro, já valeu! 📝',
  'Calma, cada errinho é um acerto futuro 🧠',
  'Relaxa, revisar é o segredo! 🔑',
];

// ── Confetti Particle ─────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocityX: number;
  velocityY: number;
  shape: 'circle' | 'square' | 'star';
  delay: number;
}

const CONFETTI_COLORS = [
  '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1',
  '#96E6A1', '#DDA0DD', '#FF9F43', '#EE5A24',
  '#0ABDE3', '#F368E0', '#FF6348', '#7BED9F',
];

function generateConfetti(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 30, // Start near center
    y: 40 + (Math.random() - 0.5) * 20,
    size: 6 + Math.random() * 10,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 120, // spread in %
    velocityY: -(20 + Math.random() * 60),   // fly up first
    shape: (['circle', 'square', 'star'] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 0.3,
  }));
}

function ConfettiParticle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      initial={{
        x: `${particle.x}vw`,
        y: `${particle.y}vh`,
        scale: 0,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        x: `${particle.x + particle.velocityX}vw`,
        y: `${particle.y - particle.velocityY}vh`,
        scale: [0, 1.5, 1, 0.5],
        rotate: particle.rotation + Math.random() * 720,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2 + Math.random(),
        delay: particle.delay,
        ease: 'easeOut',
      }}
      className="absolute pointer-events-none"
      style={{
        width: particle.size,
        height: particle.size,
      }}
    >
      {particle.shape === 'circle' && (
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      )}
      {particle.shape === 'square' && (
        <div
          className="w-full h-full rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      )}
      {particle.shape === 'star' && (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <polygon
            points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"
            fill={particle.color}
          />
        </svg>
      )}
    </motion.div>
  );
}

// ── Balloon Component ──────────────────────────────────────────────────
function Balloon({ color, delay, x }: { color: string; delay: number; x: number }) {
  return (
    <motion.div
      initial={{ y: '110vh', x: `${x}vw`, scale: 0.3, opacity: 0 }}
      animate={{
        y: '-20vh',
        x: `${x + (Math.random() - 0.5) * 15}vw`,
        scale: [0.3, 1, 0.9, 1],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random(),
        delay,
        ease: 'easeOut',
      }}
      className="absolute pointer-events-none"
    >
      <div className="relative">
        <div
          className="w-8 h-10 rounded-full shadow-lg"
          style={{
            backgroundColor: color,
            background: `radial-gradient(circle at 30% 30%, ${color}ee, ${color}88)`,
          }}
        />
        {/* String */}
        <div
          className="w-px h-8 mx-auto"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
interface AnswerFeedbackProps {
  isCorrect: boolean;
  visible: boolean;
  onDismiss: () => void;
}

export default function AnswerFeedback({ isCorrect, visible, onDismiss }: AnswerFeedbackProps) {
  const [gifUrl, setGifUrl] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const confetti = useMemo(() => (isCorrect ? generateConfetti(50) : []), [isCorrect, visible]);
  
  const balloonColors = useMemo(
    () => CONFETTI_COLORS.slice(0, 8).sort(() => Math.random() - 0.5),
    [visible]
  );

  useEffect(() => {
    if (visible) {
      if (isCorrect) {
        setGifUrl(CORRECT_GIFS[Math.floor(Math.random() * CORRECT_GIFS.length)]);
        setFeedbackMessage(CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)]);
      } else {
        setGifUrl(WRONG_GIFS[Math.floor(Math.random() * WRONG_GIFS.length)]);
        setFeedbackMessage(WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]);
      }
    }
  }, [visible, isCorrect]);

  // Auto-dismiss after 3.5s
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timeout);
    }
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Confetti (correct only) */}
          {isCorrect && confetti.map(p => (
            <ConfettiParticle key={p.id} particle={p} />
          ))}

          {/* Balloons (correct only) */}
          {isCorrect && balloonColors.map((color, i) => (
            <Balloon
              key={i}
              color={color}
              delay={0.1 + i * 0.15}
              x={10 + (i / balloonColors.length) * 80}
            />
          ))}

          {/* Central Card */}
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 flex flex-col items-center gap-4 p-6 rounded-2xl shadow-2xl max-w-sm mx-4"
            style={{
              backgroundColor: isCorrect
                ? 'rgba(16, 185, 129, 0.95)'
                : 'rgba(239, 68, 68, 0.92)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* GIF */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
              className="w-40 h-40 rounded-xl overflow-hidden shadow-lg border-4 border-white/30"
            >
              <img
                src={gifUrl}
                alt={isCorrect ? 'Correto!' : 'Errou!'}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-lg font-bold text-center drop-shadow-md"
            >
              {feedbackMessage}
            </motion.p>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.5 }}
              className="text-white/60 text-xs"
            >
              toque para fechar
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
