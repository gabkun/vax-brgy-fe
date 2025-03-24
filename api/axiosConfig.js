import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8087', // Replace with your actual backend URL
});

export default axiosInstance;