import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { habitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import toast from 'react-hot-toast';
import { Plus, Flame, Target, TrendingUp, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Cargar hábitos y stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([
        habitAPI.getAll(),
        habitAPI.getStats(),
      ]);
      setHabits(habitsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Crear hábito
  const handleCreate = async (data) => {
    try {
      const response = await habitAPI.create(data);
      setHabits([...habits, response.data]);
      await fetchData(); // Recargar stats
      toast.success('¡Hábito creado! 🎉');
    } catch (error) {
      toast.error('Error al crear el hábito');
    }
  };

  // Completar hábito
  const handleComplete = async (id) => {
    try {
      const response = await habitAPI.complete(id);
      setHabits(habits.map((h) => (h.id === id ? response.data : h)));
      await fetchData(); // Recargar stats
      toast.success('¡Hábito completado! 🔥');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al completar';
      toast.error(message);
    }
  };

  // Eliminar hábito
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este hábito?')) return;

    try {
      await habitAPI.delete(id);
      setHabits(habits.filter((h) => h.id !== id));
      await fetchData(); // Recargar stats
      toast.success('Hábito eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Navbar />

      {/* Hero Section con Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              ¡Hola, {user?.username}! 👋
            </h2>
            <p className="text-gray-400">
              Sigue construyendo tus mejores hábitos cada día
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Hábito
          </motion.button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              icon={<Target className="w-6 h-6" />}
              label="Total Hábitos"
              value={stats.totalHabits}
              gradient="from-purple-500 to-indigo-600"
            />
            <StatsCard
              icon={<Flame className="w-6 h-6" />}
              label="Completados Hoy"
              value={stats.completedToday}
              gradient="from-orange-500 to-red-600"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Suma de Rachas"
              value={stats.totalCurrentStreakSum}
              gradient="from-green-500 to-emerald-600"
            />
            <StatsCard
              icon={<Sparkles className="w-6 h-6" />}
              label="Mejor Racha"
              value={stats.bestStreak}
              gradient="from-yellow-500 to-orange-600"
            />
          </div>
        )}
      </motion.div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <EmptyState onCreateClick={() => setIsModalOpen(true)} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create Modal */}
      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, label, value, gradient }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    className="glass-card"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <motion.p
          key={value}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-white"
        >
          {value}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

// Empty State Component
const EmptyState = ({ onCreateClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card text-center py-16"
  >
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="inline-block mb-6"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
    </motion.div>
    <h3 className="text-2xl font-bold text-white mb-2">
      ¡Comienza tu viaje!
    </h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">
      Aún no tienes hábitos. Crea tu primer hábito y comienza a construir la
      mejor versión de ti mismo.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onCreateClick}
      className="btn-primary inline-flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Crear Mi Primer Hábito
    </motion.button>
  </motion.div>
);

export default Dashboard;