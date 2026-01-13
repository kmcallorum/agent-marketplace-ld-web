import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsService } from '@/services';
import { useAppDispatch, useAppSelector } from '@/store';
import { addStarredAgent, removeStarredAgent } from '@/store/agentsSlice';
import toast from 'react-hot-toast';

interface UseAgentsParams {
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export function useAgents(params?: UseAgentsParams) {
  return useQuery({
    queryKey: ['agents', params],
    queryFn: () => agentsService.list(params),
  });
}

export function useAgent(slug: string) {
  return useQuery({
    queryKey: ['agent', slug],
    queryFn: () => agentsService.get(slug),
    enabled: !!slug,
  });
}

export function useAgentVersions(slug: string) {
  return useQuery({
    queryKey: ['agent-versions', slug],
    queryFn: () => agentsService.getVersions(slug),
    enabled: !!slug,
  });
}

export function useAgentStats(slug: string) {
  return useQuery({
    queryKey: ['agent-stats', slug],
    queryFn: () => agentsService.getStats(slug),
    enabled: !!slug,
  });
}

export function useStarAgent(slug: string) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const starredSlugs = useAppSelector((state) => state.agents.starredSlugs);
  const isStarred = starredSlugs.has(slug);

  const starMutation = useMutation({
    mutationFn: () => agentsService.star(slug),
    onSuccess: () => {
      dispatch(addStarredAgent(slug));
      queryClient.invalidateQueries({ queryKey: ['agent', slug] });
      toast.success('Agent starred!');
    },
    onError: () => {
      toast.error('Failed to star agent');
    },
  });

  const unstarMutation = useMutation({
    mutationFn: () => agentsService.unstar(slug),
    onSuccess: () => {
      dispatch(removeStarredAgent(slug));
      queryClient.invalidateQueries({ queryKey: ['agent', slug] });
      toast.success('Agent unstarred');
    },
    onError: () => {
      toast.error('Failed to unstar agent');
    },
  });

  const toggleStar = () => {
    if (isStarred) {
      unstarMutation.mutate();
    } else {
      starMutation.mutate();
    }
  };

  return {
    isStarred,
    toggleStar,
    isLoading: starMutation.isPending || unstarMutation.isPending,
  };
}

export function usePublishAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      onProgress,
    }: {
      data: Parameters<typeof agentsService.publish>[0];
      onProgress?: (progress: number) => void;
    }) => agentsService.publish(data, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent submitted for validation!');
    },
    onError: () => {
      toast.error('Failed to publish agent');
    },
  });
}
