import axios from 'axios';

import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    console.log('API: Sending registration request to:', API_BASE_URL + '/auth/register');
    console.log('API: Request data:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('API: Registration response:', response.data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.get('/auth/me', { headers });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
};

export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/profile/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  deactivateAccount: async (password: string) => {
    const response = await api.post('/profile/deactivate', { password });
    return response.data;
  },

  // Admin endpoints
  getAllUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    const response = await api.get('/profile/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(`/profile/admin/users/${userId}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/profile/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean) => {
    const response = await api.put(`/profile/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/profile/admin/stats');
    return response.data;
  },

  getActivityLog: async (userId?: string) => {
    const response = await api.get('/profile/activity-log', { params: { userId } });
    return response.data;
  },
};

export const policyAPI = {
  searchPolicies: async (params: { type?: string; insurer?: string; minPremium?: number | string; maxPremium?: number | string }) => {
    const response = await api.get('/policies/search', { params });
    return response.data;
  },
  comparePolicies: async (policyIds: string[]) => {
    const response = await api.post('/policies/compare', { policyIds });
    return response.data;
  },
  getPolicyById: async (policyId: string) => {
    const response = await api.get(`/policies/${policyId}`);
    return response.data;
  },
};

export const purchaseAPI = {
  initiate: async (policyId: string) => {
    const response = await api.post('/purchase/initiate', { policyId });
    return response.data;
  },
  complete: async (purchaseId: string) => {
    const response = await api.post('/purchase/complete', { purchaseId });
    return response.data;
  },
  get: async (purchaseId: string) => {
    const response = await api.get(`/purchase/${purchaseId}`);
    return response.data;
  },
  download: async (purchaseId: string) => {
    // returns blob
    const response = await api.get(`/purchase/${purchaseId}/download`, { responseType: 'blob' });
    return response.data;
  }
};

export default api;
