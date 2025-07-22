import React from 'react';
import AuthForm from './AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/" />; // ✅ Already logged in

  return <AuthForm type="register" />;
};

export default Register;
