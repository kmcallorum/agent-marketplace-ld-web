import api from './api';
import type { Agent, Review, UserProfile, PaginatedResponse } from '@/types';

export const usersService = {
  getProfile: async (username: string): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(`/api/v1/users/${username}`);
    return response.data;
  },

  getAgents: async (
    username: string,
    params?: { limit?: number; offset?: number }
  ): Promise<PaginatedResponse<Agent>> => {
    const response = await api.get<PaginatedResponse<Agent>>(
      `/api/v1/users/${username}/agents`,
      { params }
    );
    return response.data;
  },

  getReviews: async (
    username: string,
    params?: { limit?: number; offset?: number }
  ): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>(
      `/api/v1/users/${username}/reviews`,
      { params }
    );
    return response.data;
  },

  getStarredAgents: async (
    username: string,
    params?: { limit?: number; offset?: number }
  ): Promise<PaginatedResponse<Agent>> => {
    const response = await api.get<PaginatedResponse<Agent>>(
      `/api/v1/users/${username}/starred`,
      { params }
    );
    return response.data;
  },
};
