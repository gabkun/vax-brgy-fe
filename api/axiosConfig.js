import axios from 'axios';
//'https://vax-barangay-be.onrender.com/'
//'http://localhost:8080/'
const axiosInstance = axios.create({
  baseURL: 'https://vax-barangay-be.onrender.com/', // Replace with your actual backend URL
});

export default axiosInstance;