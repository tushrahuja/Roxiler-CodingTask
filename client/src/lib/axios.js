import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || (window.__AUTH_TOKEN__ || null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

api.interceptors.response.use(r => r, err => {
  if (err.response) {
    const { status, data } = err.response;
    return Promise.reject({ status, data });
  }
  return Promise.reject({ message: err.message });
});

export default api;
