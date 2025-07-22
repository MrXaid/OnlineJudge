import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import submissionService from '@/services/submissionService';

const AllSubmissionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/unauthorized');
      return;
    }

    const fetchAllSubmissions = async () => {
      try {
        const data = await submissionService.getAllSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubmissions();
  }, [user, navigate]);

  if (loading) return <div className="text-center p-6">Loading submissions...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">All Submissions</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Problem</th>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Verdict</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((sub, index) => (
                <tr key={sub.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{sub.username}</td>
                  {/* <td className="p-3">{sub.problemName}</td> */}
                  <td className="p-3">
                    <Link
                      to={`/problems/${sub.problemId}`}
                        className="text-blue-600 hover:underline"
                    >
                    {sub.problemName}
                    </Link>
                  </td>
                  <td className="p-3">{sub.language}</td>
                  <td
                    className={`p-3 font-semibold ${
                      sub.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {sub.verdict}
                  </td>
                  <td className="p-3">
                    {new Date(sub.createdAt || sub.date).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <Link to={`/submissions/${sub.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSubmissionsPage;
