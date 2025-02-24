import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://localhost:7159/',
  headers: {
    'Content-type': 'application/json',
  },
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
    console.error('Request failed with status code', error.response.status);
    return Promise.reject(error);
  }
);

export default axiosClient;
