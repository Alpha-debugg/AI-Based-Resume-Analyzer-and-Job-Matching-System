// api/api.js
// Central place for all backend REST calls, so pages/components never call
// axios directly. Makes it trivial to change the backend base URL later.

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// ---- Resume ----
export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getResumes = () => api.get('/resume');
export const getResumeById = (id) => api.get(`/resume/${id}`);

// ---- Jobs ----
export const createJob = (data) => api.post('/jobs', data);
export const getJobs = () => api.get('/jobs');

// ---- Analyze / Match ----
export const analyzeMatch = (data) => api.post('/analyze', data);
export const getAnalysisById = (id) => api.get(`/analyze/${id}`);

export default api;
