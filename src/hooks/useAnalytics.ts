import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services';

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => analyticsService.getPlatformStats(),
    staleTime: 60000,
  });
}

export function useTrendingAgents(
  timeframe: 'hour' | 'day' | 'week' | 'month' = 'week',
  limit: number = 10
) {
  return useQuery({
    queryKey: ['trending-agents', timeframe, limit],
    queryFn: () => analyticsService.getTrending(timeframe, limit),
    staleTime: 300000,
  });
}

export function usePopularAgents(limit: number = 10) {
  return useQuery({
    queryKey: ['popular-agents', limit],
    queryFn: () => analyticsService.getPopular(limit),
    staleTime: 300000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => analyticsService.getCategories(),
    staleTime: 600000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => analyticsService.getCategory(slug),
    enabled: !!slug,
  });
}

export function useCategoryAgents(
  slug: string,
  params?: { limit?: number; offset?: number; sort?: string }
) {
  return useQuery({
    queryKey: ['category-agents', slug, params],
    queryFn: () => analyticsService.getCategoryAgents(slug, params),
    enabled: !!slug,
  });
}
