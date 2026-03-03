import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { habitAPI } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Trophy, Medal, Award, Flame, TrendingUp } from 'lucide-react';

const Rankings = () => {
  const [activeTab, setActiveTab] = useState('DAILY');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings(activeTab);
  }, [activeTab]);

  const fetchRankings = async (frequency) => {
    setLoading(true);
    try {
      const response = await habitAPI.getRankings(frequency);
      setRankings(response.data);
    } catch (error) {
      toast.error('Error al cargar rankings');
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  // Medallas por posición
  const getMedalIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-gray-500 font-bold">#{position}</span>;
    }
  };

  const getMedalColor = (position) => {
    switch (position) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-400/40';
      case 3:
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/40';
      default:
        return 'from-white/5 to-white/10 border-white/10';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Navbar />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Rankings
            </h1>
            <p className="text-gray-400">Los mejores hábitos por categoría</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <TabButton
          active={activeTab === 'DAILY'}
          onClick={() => setActiveTab('DAILY')}
          icon={<Flame className="w-4 h-4" />}
          label="Diario"
          color="from-green-500 to-emerald-600"
        />
        <TabButton
          active={activeTab === 'WEEKLY'}
          onClick={() => setActiveTab('WEEKLY')}
          icon={<TrendingUp className="w-4 h-4" />}
          label="Semanal"
          color="from-cyan-400 to-blue-500"
        />
        <TabButton
          active={activeTab === 'MONTHLY'}
          onClick={() => setActiveTab('MONTHLY')}
          icon={<Award className="w-4 h-4" />}
          label="Mensual"
          color="from-purple-500 to-pink-600"
        />
      </div>

      {/* Rankings Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.5, repeat: Infinity },
            }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      ) : rankings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card text-center py-16"
        >
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No hay hábitos en esta categoría
          </h3>
          <p className="text-gray-400">
            Sé el primero en crear un hábito {activeTab.toLowerCase()}
          </p>
        </motion.div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {rankings.map((entry, index) => {
            const position = index + 1;
            return (
              <motion.div
                key={entry.habitId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card bg-gradient-to-r ${getMedalColor(position)} border-2 transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-4">
                  {/* Posición */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    {getMedalIcon(position)}
                  </div>

                  {/* Info del hábito */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                      {entry.habitName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      por <span className="text-purple-400 font-semibold">{entry.username}</span>
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 items-center">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-2xl font-bold text-white">
                          {entry.currentStreak}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Racha Actual</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">
                          {entry.longestStreak}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Mejor Racha</p>
                    </div>
                  </div>
                </div>

                {/* Confetti effect for top 3 */}
                {position <= 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
      active
        ? `bg-gradient-to-r ${color} text-white shadow-lg`
        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
    }`}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

export default Rankings;