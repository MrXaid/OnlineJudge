import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import submissionService from '@/services/submissionService';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await submissionService.getUserSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-6">Loading your submissions...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Your Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-gray-500">You haven't submitted any solutions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Problem</th>
                <th className="p-3 text-left">Language</th>
                <th className="p-3 text-left">Verdict</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, index) => (
                <tr key={sub.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <Link
                      to={`/problems/${sub.problemId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {sub.problemName || sub.problemTitle}
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
                  <td className="p-3">{new Date(sub.createdAt || sub.date).toLocaleString()}</td>
                  <td className="p-3">
                    <Link
                      to={`/submissions/${sub.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
