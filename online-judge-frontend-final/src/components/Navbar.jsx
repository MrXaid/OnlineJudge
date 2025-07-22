import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return null;

  const isAdmin = user?.role === 'ADMIN';

  const imageUrl =
    user?.photoUrl && user.photoUrl !== 'default.png'
      ? `http://localhost:8080${user.photoUrl}`
      : `http://localhost:8080/uploads/default.png`;

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          OnlineJudge
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/problems" className="hover:text-primary">Problems</Link>
          <Link to="/submissions" className="hover:text-primary">Submissions</Link>
          <Link to="/users" className="hover:text-primary">Users</Link>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hover:text-primary">Admin</Link>
              )}
              <Link to="/profile">
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-400"
                />
              </Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">Login</Link>
              <Link to="/register">
                <Button variant="default">Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
