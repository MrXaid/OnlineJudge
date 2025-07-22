// src/services/userService.js
import axios from '@/lib/axios';

const userService = {
  getProfile: async () => {
    const res = await axios.get('/users/me', {
      withCredentials: true, // include JWT cookie if using cookies
    });
    return res.data; // returns UserProfileResponse
  },

  updateProfile: async (formData) => {
    const res = await axios.post('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    return res.data; // returns APIResponse
  },

  // Optional: split file upload if needed elsewhere
  uploadProfilePicture: async (file) => {
    const form = new FormData();
    form.append('image', file);
    const res = await axios.post('/users/me', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    });
    return res.data;
  }
};

export default userService;
