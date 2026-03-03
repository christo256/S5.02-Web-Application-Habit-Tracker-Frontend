import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Shield, Sparkles, User, Target, Trophy } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card mb-8 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
          }}
          className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Habit Tracker
          </h1>
          <p className="text-xs text-gray-400">Tu camino al éxito</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
  {/* User Info */}
  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
      <User className="w-4 h-4 text-white" />
    </div>
    <div className="text-left">
      <p className="text-sm font-semibold text-white">{user?.username}</p>
      <p className="text-xs text-gray-400">
        {user?.role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}
      </p>
    </div>
  </div>

  {/* Dashboard Button - siempre visible */}
  <Link to="/dashboard">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn-secondary flex items-center gap-2"
    >
      <Target className="w-4 h-4" />
      <span className="hidden sm:inline">Mis Hábitos</span>
    </motion.button>
  </Link>

  {/* Rankings Button - NUEVO */}
  <Link to="/rankings">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn-secondary flex items-center gap-2"
    >
      <Trophy className="w-4 h-4" />
      <span className="hidden sm:inline">Rankings</span>
    </motion.button>
  </Link>

  {/* Admin Panel Button - solo si es admin */}
  {isAdmin() && (
    <Link to="/admin">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn-secondary flex items-center gap-2"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden sm:inline">Admin Panel</span>
      </motion.button>
    </Link>
  )}

  {/* Logout Button */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleLogout}
    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center gap-2 transition-all"
  >
    <LogOut className="w-4 h-4 text-red-400" />
    <span className="hidden sm:inline text-red-400 font-semibold">Salir</span>
  </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;