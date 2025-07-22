// src/services/problemService.js
import axios from '@/lib/axios';
import qs from 'qs';

const problemService = {
  getAllProblems: async (params = {}) => {
    const res = await axios.get('/problems', {
      params,
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      // This makes tags: ['math', 'dp'] → ?tags=math&tags=dp ✅
    });
    return res.data;
  },

  getProblemById: async (id) => {
    const res = await axios.get(`/problems/${id}`);
    return res.data;
  },

  // ADMIN endpoints
  createProblem: async (data) => {
    const res = await axios.post('/problems/create', data);
    return res.data;
  },

  updateProblem: async (id, payload) => {
    const res = await axios.put(`/problems/${id}`, payload);
    return res.data;
  },

  deleteProblem: async (id) => {
    const res = await axios.delete(`/problems/${id}`);
    return res.data;
  },
  searchByTags: async (tags) => {
    const res = await axios.get('/problems/search', { params: { tags } });
    return res.data;
  },

  sortProblems: async (sortBy, order) => {
    const res = await axios.get('/problems/sort', { params: { sortBy, order } });
    return res.data;
  },
};
 
export default problemService;
