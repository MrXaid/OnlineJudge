// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import userService from '@/services/userService';
import authService from '@/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await userService.getProfile();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

 const logout = async () => {
    try {
      await authService.logout(); // make backend call
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      document.cookie = 'jwt=; Max-Age=0'; // clear frontend cookie just in case
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
