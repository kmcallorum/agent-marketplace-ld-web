import api from './api';
import type { AuthResponse, AuthUser } from '@/types';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants';

export const authService = {
  login: async (githubCode: string): Promise<AuthResponse> => {
    console.log('[AuthService] Calling POST /api/v1/auth/github with code:', githubCode.substring(0, 8) + '...');
    console.log('[AuthService] API_BASE_URL:', api.defaults.baseURL);
    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/github', {
        code: githubCode,
      });
      console.log('[AuthService] Response status:', response.status);
      console.log('[AuthService] Response data:', response.data);
      return response.data;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: unknown }; message?: string };
        console.error('[AuthService] API error response:', {
          status: axiosErr.response?.status,
          data: axiosErr.response?.data,
          message: axiosErr.message,
        });
      } else if (err && typeof err === 'object' && 'request' in err) {
        console.error('[AuthService] No response received - network error');
      } else {
        console.error('[AuthService] Error setting up request:', err);
      }
      throw err;
    }
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

  getStarredAgents: async (): Promise<string[]> => {
    const response = await api.get<{ starred: string[] }>('/api/v1/auth/me/starred');
    return response.data.starred;
  },

  saveTokens: (accessToken: string, refreshToken: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (e) {
      console.error('Failed to save tokens to localStorage:', e);
      // Storage might be full or blocked - tokens won't persist but login can continue
    }
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
