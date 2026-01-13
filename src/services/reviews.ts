import api from './api';
import type { Review, ReviewCreate, ReviewUpdate, ReviewsResponse } from '@/types';

interface ListReviewsParams {
  limit?: number;
  offset?: number;
  sort?: 'helpful' | 'recent' | 'rating';
}

export const reviewsService = {
  list: async (agentSlug: string, params?: ListReviewsParams): Promise<ReviewsResponse> => {
    const response = await api.get<ReviewsResponse>(
      `/api/v1/agents/${agentSlug}/reviews`,
      { params }
    );
    return response.data;
  },

  create: async (agentSlug: string, data: ReviewCreate): Promise<Review> => {
    const response = await api.post<Review>(
      `/api/v1/agents/${agentSlug}/reviews`,
      data
    );
    return response.data;
  },

  update: async (reviewId: number, data: ReviewUpdate): Promise<Review> => {
    const response = await api.put<Review>(`/api/v1/reviews/${reviewId}`, data);
    return response.data;
  },

  delete: async (reviewId: number): Promise<void> => {
    await api.delete(`/api/v1/reviews/${reviewId}`);
  },

  markHelpful: async (reviewId: number): Promise<void> => {
    await api.post(`/api/v1/reviews/${reviewId}/helpful`);
  },
};
