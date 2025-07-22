// src/features/submissions/SubmissionForm.jsx
import React, { useState } from 'react';
import submissionService from '@/services/submissionService';

const SubmissionForm = ({ problemId, code, language, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);

  const handleSubmit = async () => {
    if (!code.trim()) return alert("Code cannot be empty!");
    setLoading(true);
    try {
      const response = await submissionService.submitCode(problemId, code, language);
      setVerdict(response.verdict); // Optional: show quick result
      if (onSubmit) onSubmit(response); // Allow parent to react
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <button
        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Code'}
      </button>

      {verdict && (
        <div className="text-sm mt-2">
          Last verdict: <span className="font-semibold">{verdict}</span>
        </div>
      )}
    </div>
  );
};

export default SubmissionForm;
