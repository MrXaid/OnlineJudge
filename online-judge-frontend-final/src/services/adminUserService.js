import axios from '@/lib/axios';

const getAllUsers = async () => {
  const res = await axios.get('/users/all');
  return res.data;
};

export default {
  getAllUsers,
};
