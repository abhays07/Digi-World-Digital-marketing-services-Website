import httpClient from './httpClient';

export const authService = {
  login: async (email, password) => {
    const response = await httpClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/'; // Hard redirect to ensure state clear
  },
  getCurrentUser: () => {
    return localStorage.getItem('userEmail');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
