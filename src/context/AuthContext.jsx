import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    const { token, id, username, role } = response.data;
    
    const userData = { id, username, role };
    
    setToken(token);
    setUser(userData);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    toast.success(`¡Bienvenido, ${username}! 🎉`, {
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#fff',
      },
    });
    
    return { success: true };
  } catch (error) {
    
    // Mostrar mensaje REAL del backend
    let message = 'Credenciales inválidas';
    
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    });
    return { success: false, error: message };
  }
};

  // Register
  const register = async (data) => {
    try {
      await authAPI.register(data);
      toast.success('¡Cuenta creada! Ahora inicia sesión 🚀', {
        duration: 3000,
        style: {
          background: '#8b5cf6',
          color: '#fff',
        },
      });
      return { success: true };
    } catch (error) {
      console.error('Error al registrar:', error);
      
      // Mostrar mensaje REAL del backend
      let message = 'Error al registrar';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.validationErrors) {
        // Si hay errores de validación, mostrar el primero
        const errors = error.response.data.validationErrors;
        message = Object.values(errors)[0];
      }
      
      toast.error(message, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Sesión cerrada 👋', {
      duration: 2000,
      style: {
        background: '#6366f1',
        color: '#fff',
      },
    });
  };

  // Verificar si es admin
  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;