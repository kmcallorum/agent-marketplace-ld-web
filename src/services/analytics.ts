import api from './api';
import type { Agent, Category, PlatformStats, TrendingAgent } from '@/types';

export const analyticsService = {
  getPlatformStats: async (): Promise<PlatformStats> => {
    const response = await api.get<PlatformStats>('/api/v1/stats');
    return response.data;
  },

  getTrending: async (
    timeframe: 'hour' | 'day' | 'week' | 'month' = 'week',
    limit: number = 10
  ): Promise<{ agents: TrendingAgent[] }> => {
    const response = await api.get<{ agents: TrendingAgent[] }>('/api/v1/trending', {
      params: { timeframe, limit },
    });
    return response.data;
  },

  getPopular: async (limit: number = 10): Promise<{ items: Agent[] }> => {
    const response = await api.get<{ items: Agent[] }>('/api/v1/popular', {
      params: { limit },
    });
    return response.data;
  },

  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get<{ categories: Category[] }>('/api/v1/categories');
    return response.data;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const response = await api.get<Category>(`/api/v1/categories/${slug}`);
    return response.data;
  },

  getCategoryAgents: async (
    slug: string,
    params?: { limit?: number; offset?: number; sort?: string }
  ): Promise<{ items: Agent[]; total: number }> => {
    const response = await api.get<{ items: Agent[]; total: number }>(
      `/api/v1/categories/${slug}/agents`,
      { params }
    );
    return response.data;
  },
};
