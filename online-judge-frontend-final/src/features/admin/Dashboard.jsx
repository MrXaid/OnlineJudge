// src/features/admin/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, PlusSquare, FileText } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/users" className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 flex items-center gap-4 border border-gray-200 hover:border-blue-400">
          <Users className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-lg font-semibold text-gray-800">Manage Users</p>
            <p className="text-sm text-gray-500">View and control platform users</p>
          </div>
        </Link>

        <Link to="/admin/create-problem" className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 flex items-center gap-4 border border-gray-200 hover:border-green-400">
          <PlusSquare className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-lg font-semibold text-gray-800">Create Problem</p>
            <p className="text-sm text-gray-500">Add new coding problems</p>
          </div>
        </Link>

        <Link to="/admin/submissions" className="bg-white shadow-md hover:shadow-xl transition rounded-2xl p-6 flex items-center gap-4 border border-gray-200 hover:border-purple-400">
          <FileText className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-lg font-semibold text-gray-800">All Submissions</p>
            <p className="text-sm text-gray-500">Monitor recent user activity</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
