// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Core pages
import HomePage from '@/features/home/HomePage';
import ProblemsPage from '@/features/problems/ProblemsPage';
import ProblemDetailPage from '@/features/problems/ProblemDetail';
import SubmissionsPage from '@/features/submissions/SubmissionsPage';
import SubmissionDetailPage from '@/features/submissions/SubmissionDetail';
import ProfilePage from '@/features/profile/ProfilePage';
import Dashboard from '@/features/admin/Dashboard';
import UserList from '@/features/admin/UserList'; // ✅ ADD THIS
import LoginPage from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import CreateProblemPage from '@/features/admin/CreateProblemPage';
import AllSubmissionsPage from '@/features/admin/AllSubmissionsPage';
import UserPublicProfile from '@/features/profile/UserPublicProfile';

// Error pages
import NotFound from '@/components/errors/NotFound';
import Unauthorized from '@/components/errors/Unauthorized';
import Forbidden from '@/components/errors/Forbidden';
import ServerError from '@/components/errors/ServerError';

// Route guards
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Home */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Problems */}
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/problems/:id" element={<ProblemDetailPage />} />

      {/* 3. Submissions (auth required) */}
      <Route
        path="/submissions"
        element={
          <ProtectedRoute>
            <SubmissionsPage />
          </ProtectedRoute>
        }
        
      />
      <Route
        path="/submissions/:id"
        element={
          <ProtectedRoute>
          <SubmissionDetailPage />
          </ProtectedRoute>
        }
      />

      {/* 4. Profile (auth required) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 5. Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* 6. Admin User List */}
      <Route
        path="/users"
        element={
            <UserList />
        }
      />
      <Route
        path="/admin/create-problem"
        element={
          <AdminRoute>
            <CreateProblemPage />
          </AdminRoute>
        }
      />
      <Route path="/admin/submissions" 
        element={
          <AdminRoute>
            <AllSubmissionsPage />
          </AdminRoute>
        } 
      />
      <Route path="/users/:username" element={<UserPublicProfile />} />

      {/* 7. Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* 8. Error Pages */}
      <Route path="/401" element={<Unauthorized />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
