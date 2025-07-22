import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="text-center py-16">
    <h1 className="text-4xl font-bold text-red-600 mb-4">401 - Unauthorized</h1>
    <p className="mb-4">You need to log in to access this page.</p>
    <Link to="/login" className="text-blue-500 underline hover:text-blue-700">
      Go to Login
    </Link>
  </div>
);

export default Unauthorized;
