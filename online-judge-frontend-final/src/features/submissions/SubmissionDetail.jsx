import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import submissionService from '@/services/submissionService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await submissionService.getSubmissionById(id);
        setSubmission(data);
      } catch (err) {
        console.error('Error loading submission detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) return <p className="text-center p-6 text-gray-500">Loading submission detail...</p>;
  if (!submission) return <p className="text-center p-6 text-red-500">Submission not found.</p>;

  const isAccepted = submission.verdict === 'Accepted';
  const language = submission.language?.toLowerCase() || 'cpp';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Submission #{submission.id}</h1>

      {/* Submission Details */}
      <div className="bg-white border rounded-lg shadow p-6 space-y-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
          <div>
            <dt className="font-medium text-gray-500">Problem</dt>
            <dd className="text-gray-900">{submission.problemName}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Submitted By</dt>
            <dd className="text-gray-900">{submission.username}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Language</dt>
            <dd className="text-gray-900">{submission.language}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Verdict</dt>
            <dd>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  isAccepted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {submission.verdict}
              </span>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Submitted At</dt>
            <dd className="text-gray-900">
              {new Date(submission.createdAt || submission.date).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      {/* Code Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Submitted Code</h2>
        <div className="border rounded-lg overflow-hidden shadow">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            wrapLongLines
            customStyle={{
              fontSize: '0.875rem',
              padding: '1rem',
              margin: 0,
              background: '#282c34',
            }}
          >
            {submission.code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
