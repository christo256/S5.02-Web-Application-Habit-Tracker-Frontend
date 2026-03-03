import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Trash2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const HabitCard = ({ habit, onComplete, onDelete }) => {
  const { id, name, description, frequency, currentStreak, longestStreak, lastCompleted } = habit;

  // Verificar si ya se completó hoy
  const today = new Date().toISOString().split('T')[0];
  const completedToday = lastCompleted === today;

  // Calcular progreso circular (para el círculo animado)
  const maxStreak = 30; // Meta de 30 días
  const progress = Math.min((currentStreak / maxStreak) * 100, 100);
  const circumference = 2 * Math.PI * 40; // radio = 40
  const offset = circumference - (progress / 100) * circumference;

  // Colores según frecuencia
  const frequencyColors = {
  DAILY:   'from-green-400 to-green-600',
  WEEKLY:  'from-cyan-300  to-indigo-500',
  MONTHLY: 'from-purple-400 to-pink-600',
};

  const handleComplete = async () => {
    await onComplete(id);

    // Confetti si la racha es múltiplo de 7
    if ((currentStreak + 1) % 7 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#6366f1', '#10b981'],
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="habit-card group relative"
    >
      {/* Frequency Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${frequencyColors[frequency]} rounded-full`}>
        <span className="text-xs font-bold text-white">{frequency}</span>
      </div>

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-white/10"
            />
            {/* Progress circle */}
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{currentStreak}</p>
              <p className="text-xs text-gray-400">días</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1 truncate">{name}</h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">
                <strong className="text-white">{currentStreak}</strong> racha
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">
                <strong className="text-white">{longestStreak}</strong> mejor
              </span>
            </div>
            {lastCompleted && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-xs">{lastCompleted}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleComplete}
          disabled={completedToday}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            completedToday
              ? 'bg-green-500/20 border border-green-500/30 text-green-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          <Check className="w-4 h-4" />
          {completedToday ? '✓ Completado hoy' : 'Completar hoy'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(id)}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </motion.button>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default HabitCard;