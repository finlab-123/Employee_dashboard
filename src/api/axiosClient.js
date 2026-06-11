import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://bynd-backend-owi6.onrender.com/api', // Update this to your backend server URL if different
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
