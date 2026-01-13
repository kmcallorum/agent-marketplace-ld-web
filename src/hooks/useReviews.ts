import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '@/services';
import type { ReviewCreate } from '@/types';
import toast from 'react-hot-toast';

interface UseReviewsParams {
  limit?: number;
  offset?: number;
  sort?: 'helpful' | 'recent' | 'rating';
}

export function useReviews(agentSlug: string, params?: UseReviewsParams) {
  return useQuery({
    queryKey: ['reviews', agentSlug, params],
    queryFn: () => reviewsService.list(agentSlug, params),
    enabled: !!agentSlug,
  });
}

export function useCreateReview(agentSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewCreate) => reviewsService.create(agentSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', agentSlug] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentSlug] });
      toast.success('Review posted successfully!');
    },
    onError: () => {
      toast.error('Failed to post review');
    },
  });
}

export function useUpdateReview(agentSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: Partial<ReviewCreate>;
    }) => reviewsService.update(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', agentSlug] });
      toast.success('Review updated!');
    },
    onError: () => {
      toast.error('Failed to update review');
    },
  });
}

export function useDeleteReview(agentSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => reviewsService.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', agentSlug] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentSlug] });
      toast.success('Review deleted');
    },
    onError: () => {
      toast.error('Failed to delete review');
    },
  });
}

export function useMarkReviewHelpful() {
  return useMutation({
    mutationFn: (reviewId: number) => reviewsService.markHelpful(reviewId),
    onSuccess: () => {
      toast.success('Marked as helpful');
    },
    onError: () => {
      toast.error('Failed to mark as helpful');
    },
  });
}
