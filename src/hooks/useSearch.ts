import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchService } from '@/services';

interface UseSearchParams {
  q?: string;
  category?: string;
  min_rating?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}

export function useSearch(params?: UseSearchParams) {
  const [searchParams] = useSearchParams();

  const query = params?.q ?? searchParams.get('q') ?? '';
  const category = params?.category ?? searchParams.get('category') ?? undefined;
  const sort = params?.sort ?? searchParams.get('sort') ?? undefined;
  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;

  return useQuery({
    queryKey: ['search', { q: query, category, sort, limit, offset }],
    queryFn: () =>
      searchService.searchAgents({
        q: query,
        category,
        sort,
        limit,
        offset,
      }),
    enabled: !!query || !!category,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => searchService.getSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 30000,
  });
}

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['global-search', query],
    queryFn: () => searchService.globalSearch(query),
    enabled: query.length >= 2,
  });
}
