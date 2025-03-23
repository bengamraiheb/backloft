import axios from 'axios';
import { toast } from "sonner";

const API_URL = 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Refresh token logic - if 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        
        if (response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, log out user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show error message
        toast.error("Your session has expired. Please log in again.");
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Show error message for server errors
    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } 
    // Show error message for client errors
    else if (error.response?.status >= 400) {
      const errorMessage = error.response.data.message || "An error occurred";
      toast.error(errorMessage);
    }
    // Network errors
    else if (error.request) {
      toast.error("Network error. Please check your connection.");
    }
    // Other errors
    else {
      toast.error("An unexpected error occurred.");
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },
  
  resetPasswordRequest: async (email: string) => {
    const response = await api.post('/auth/reset-password-request', { email });
    return response.data;
  },
  
  resetPassword: async (password: string, token: string) => {
    const response = await api.post('/auth/reset-password', { password, token });
    return response.data;
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

// User services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post('/users/update-password', data);
    return response.data;
  }
};

// Task services
export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getTaskById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  createTask: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  
  updateTask: async (id: string, data: any) => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },
  
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  addComment: async (taskId: string, content: string) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  }
};

// Notification services
export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
  
  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default api;
