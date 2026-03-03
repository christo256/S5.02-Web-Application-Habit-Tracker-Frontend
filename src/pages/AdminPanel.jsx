import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Shield, Users, Activity, Trash2, AlertTriangle, TrendingUp, Target } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [allHabits, setAllHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'habits' | 'stats'

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, habitsRes, statsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllHabits(),
        adminAPI.getStats(),
      ]);
      setUsers(usersRes.data);
      setAllHabits(habitsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Error al cargar datos de administración');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`⚠️ ¿Seguro que quieres eliminar al usuario "${username}"? Esta acción NO se puede deshacer.`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('Usuario eliminado correctamente');
      await fetchAdminData(); // Recargar stats
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-gray-400">Control total del sistema</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Usuarios</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Hábitos</p>
                <p className="text-3xl font-bold text-white">{stats.totalHabits}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <TabButton
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
          icon={<Users className="w-4 h-4" />}
          label="Usuarios"
          count={users.length}
        />
        <TabButton
          active={activeTab === 'habits'}
          onClick={() => setActiveTab('habits')}
          icon={<Activity className="w-4 h-4" />}
          label="Hábitos"
          count={allHabits.length}
        />
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'users' && (
          <UsersTable users={users} onDelete={handleDeleteUser} />
        )}
        {activeTab === 'habits' && <HabitsTable habits={allHabits} />}
      </motion.div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label, count }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
    }`}
  >
    {icon}
    <span>{label}</span>
    <span className={`px-2 py-0.5 rounded-full text-xs ${
      active ? 'bg-white/20' : 'bg-white/10'
    }`}>
      {count}
    </span>
  </motion.button>
);

// Users Table Component
const UsersTable = ({ users, onDelete }) => (
  <div className="glass-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Usuario</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rol</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-400">#{user.id}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white">{user.username}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'ROLE_ADMIN'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {user.role === 'ROLE_ADMIN' ? '👑 Admin' : '👤 User'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {user.role !== 'ROLE_ADMIN' ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(user.id, user.username)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-semibold transition-all inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </motion.button>
                ) : (
                  <span className="text-xs text-gray-500 italic">Protegido</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Habits Table Component
const HabitsTable = ({ habits }) => (
  <div className="glass-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Hábito</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Usuario</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Frecuencia</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Racha Actual</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Mejor Racha</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, index) => (
            <motion.tr
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-white">{habit.name}</p>
                  <p className="text-sm text-white line-clamp-1">{habit.description}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-200">
                Usuario #{habit.userId}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  habit.frequency === 'DAILY'
                    ? 'bg-green-500/20 text-green-400'
                    : habit.frequency === 'WEEKLY'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {habit.frequency}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-lg font-bold text-white">{habit.currentStreak}</span>
                <span className="text-xs text-gray-400 ml-1">días</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-lg font-bold text-yellow-400">{habit.longestStreak}</span>
                <span className="text-xs text-gray-400 ml-1">días</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>

    {habits.length === 0 && (
      <div className="py-12 text-center">
        <p className="text-gray-400">No hay hábitos registrados aún</p>
      </div>
    )}
  </div>
);

export default AdminPanel;