import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';

const CreateHabitModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('DAILY');
  const [targetCount, setTargetCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await onCreate({
  name,
  description,
  frequency,
  targetCount,  
});

    // Reset form
    setName('');
    setDescription('');
    setFrequency('DAILY');
    setTargetCount(1);  
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nuevo Hábito</h2>
                  <p className="text-sm text-gray-400">Crea un hábito que cambiará tu vida</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Nombre del hábito *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Ej: Hacer ejercicio, Leer 30 minutos..."
                    required
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">{name.length}/50 caracteres</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Añade detalles sobre tu hábito..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500">{description.length}/200 caracteres</p>
                </div>

                {/* Frequency */}
                {/* Frequency */}
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-300">
    Frecuencia *
  </label>
  <div className="grid grid-cols-3 gap-3">
    {[
      { value: 'DAILY', label: 'Diario', color: 'from-green-500 to-emerald-600' },
      { value: 'WEEKLY', label: 'Semanal', color: 'from-cyan-400 to-blue-500' },
      { value: 'MONTHLY', label: 'Mensual', color: 'from-purple-500 to-pink-600' },
    ].map((freq) => (
      <motion.button
        key={freq.value}
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setFrequency(freq.value)}
        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
          frequency === freq.value
            ? `bg-gradient-to-r ${freq.color} text-white shadow-lg`
            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
        }`}
      >
        {freq.label}
      </motion.button>
    ))}
  </div>
</div>

{/* Target Count - NUEVO */}
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-300">
    {frequency === 'DAILY' ? '¿Cuántas veces al día?' : 
     frequency === 'WEEKLY' ? '¿Cuántas veces a la semana?' : 
     '¿Cuántas veces al mes?'} *
  </label>
  <input
    type="number"
    value={targetCount}
    onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
    className="input-field"
    min="1"
    max={frequency === 'MONTHLY' ? '31' : frequency === 'WEEKLY' ? '7' : '10'}
    required
  />
  <p className="text-xs text-gray-500">
    {frequency === 'DAILY' && 'Por defecto: 1 vez al día'}
    {frequency === 'WEEKLY' && 'Ejemplo: 3 veces a la semana'}
    {frequency === 'MONTHLY' && 'Ejemplo: 8 veces al mes'}
  </p>
</div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !name.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Crear Hábito
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Motivational message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
              >
                <p className="text-xs text-gray-400 text-center">
                  💪 <strong className="text-purple-400">Consejo:</strong> Los hábitos pequeños y
                  consistentes generan grandes cambios
                </p>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateHabitModal;