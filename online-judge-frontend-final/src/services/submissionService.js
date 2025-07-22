// src/services/submissionService.js
import axios from '@/lib/axios';

const submitCode = async (problemId, code, language) => {
  const res = await axios.post('/submissions', {
    problemId,
    code,
    language,
  });
  return res.data;
};

const getUserSubmissions = async () => {
  const res = await axios.get('/submissions/my');
  return res.data;
};

const getSubmissionsByProblem = async (problemId) => {
  const res = await axios.get(`/submissions/problem/${problemId}`);
  return res.data;
};

const getSubmissionById = async (id) => {
  const res = await axios.get(`/submissions/${id}`);
  return res.data;
};
const getAllSubmissions = async () => {
  const res = await axios.get('/submissions/all');
  return res.data;
};


export default {
  submitCode,
  getUserSubmissions,
  getSubmissionsByProblem,
  getSubmissionById,
  getAllSubmissions
};
