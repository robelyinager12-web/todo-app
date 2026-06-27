import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore session from localStorage if present
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    const response = await loginUser(credentials);
    const { user: userData, token } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  async function register(formData) {
    const response = await registerUser(formData);
    const { user: userData, token } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }

  function updateStoredUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateStoredUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}