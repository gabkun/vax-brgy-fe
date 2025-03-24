import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://vax-barangay-be.onrender.com/', // Replace with your actual backend URL
});

export default axiosInstance;