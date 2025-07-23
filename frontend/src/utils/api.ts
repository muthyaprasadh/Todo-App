import axios from 'axios';
import { User, Task, AuthResponse, TaskFilters } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: 'user' | 'admin'; adminCode?: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (filters?: TaskFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await api.get<{ tasks: Task[] }>(`/tasks?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ task: Task }>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: { title: string; description?: string; dueDate?: string; priority?: string }) => {
    const response = await api.post<{ message: string; task: Task }>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Task>) => {
    const response = await api.put<{ message: string; task: Task }>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch<{ message: string; task: Task }>(`/tasks/${id}/toggle`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get<{ user: User }>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put<{ message: string; user: User }>('/users/profile', data);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete<{ message: string }>('/users/profile');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get<{
      totalUsers: number;
      totalAdmins: number;
      userStats: Array<{
        _id: string;
        name: string;
        email: string;
        role: 'user' | 'admin';
        taskCount: number;
      }>;
    }>('/users/statistics');
    return response.data;
  },

  deleteUserByAdmin: async (userId: string) => {
    const response = await api.delete<{ message: string }>(`/users/${userId}`);
    return response.data;
  },
};

export default api; 