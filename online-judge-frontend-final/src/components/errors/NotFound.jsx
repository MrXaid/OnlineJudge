import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="text-center py-16">
    <h1 className="text-5xl font-bold text-gray-700 mb-4">404</h1>
    <p className="mb-4 text-lg">Page Not Found</p>
    <Link to="/" className="text-blue-500 underline hover:text-blue-700">
      Return Home
    </Link>
  </div>
);

export default NotFound;
