// src/services/authService.js
import axios from '@/lib/axios';

const authService = {
  login: async (credentials) => {
    const res = await axios.post('/auth/login', credentials);
    return res.data; // JwtResponse
  },

  register: async (payload) => {
    const res = await axios.post('/auth/signup', payload);
    return res.data; // MessageResponse or JwtResponse
  },

  logout: async () => {
    const res = await axios.post('/auth/logout');
    return res.data; // MessageResponse
  }
};

export default authService;
