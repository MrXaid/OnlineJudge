// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context; // { user, login, logout, loading, isAuthenticated }
};

export default useAuth;
