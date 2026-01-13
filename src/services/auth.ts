import api from './api';
import type { AuthResponse, AuthUser } from '@/types';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants';

export const authService = {
  login: async (githubCode: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/github', {
      code: githubCode,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await api.post<{ access_token: string }>('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/api/v1/auth/me');
    return response.data;
  },

  saveTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
