import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => (
  <div className="text-center py-16">
    <h1 className="text-4xl font-bold text-yellow-600 mb-4">403 - Forbidden</h1>
    <p className="mb-4">You don’t have permission to access this page.</p>
    <Link to="/" className="text-blue-500 underline hover:text-blue-700">
      Return Home
    </Link>
  </div>
);

export default Forbidden;
