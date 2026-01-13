import api from './api';
import type { Agent, PaginatedResponse, SearchSuggestion } from '@/types';

interface SearchParams {
  q: string;
  category?: string;
  min_rating?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}

interface GlobalSearchResult {
  agents: Agent[];
  users: { id: number; username: string; avatar_url?: string }[];
  total: number;
}

export const searchService = {
  searchAgents: async (params: SearchParams): Promise<PaginatedResponse<Agent>> => {
    const response = await api.get<PaginatedResponse<Agent>>('/api/v1/search/agents', {
      params,
    });
    return response.data;
  },

  globalSearch: async (
    q: string,
    type?: 'agents' | 'users',
    limit?: number
  ): Promise<GlobalSearchResult> => {
    const response = await api.get<GlobalSearchResult>('/api/v1/search', {
      params: { q, type, limit },
    });
    return response.data;
  },

  getSuggestions: async (q: string): Promise<SearchSuggestion> => {
    const response = await api.get<SearchSuggestion>('/api/v1/search/suggestions', {
      params: { q },
    });
    return response.data;
  },
};
