export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TaskFilters {
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    // add more env variables here if needed
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
} 