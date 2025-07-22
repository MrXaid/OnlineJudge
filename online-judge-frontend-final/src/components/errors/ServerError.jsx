import React from 'react';
import { Link } from 'react-router-dom';

const ServerError = () => (
  <div className="text-center py-16">
    <h1 className="text-4xl font-bold text-red-700 mb-4">500 - Server Error</h1>
    <p className="mb-4">Something went wrong on our end. Please try again later.</p>
    <Link to="/" className="text-blue-500 underline hover:text-blue-700">
      Go Back Home
    </Link>
  </div>
);

export default ServerError;
