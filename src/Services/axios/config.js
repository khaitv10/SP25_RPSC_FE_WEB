import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://opal.io.vn/',
   //baseURL: 'http://localhost:5262/',
});

axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = 'application/json';
    } else {
      console.warn('No token found in localStorage.');
    }

    // 🛠 Không đặt 'Content-Type' mặc định
    if (config.data instanceof FormData) {
      console.log("🚀 Sending FormData");
      // Để browser tự động set Content-Type
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.error('Request failed with status code', error.response?.status);
    return Promise.reject(error);
  }
);

export default axiosClient;
