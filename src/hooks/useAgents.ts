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
  const isStarred = starredSlugs.includes(slug);

  const invalidateStarQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['agent', slug] });
    queryClient.invalidateQueries({ queryKey: ['user-starred'] });
  };

  const starMutation = useMutation({
    mutationFn: () => agentsService.star(slug),
    onSuccess: () => {
      dispatch(addStarredAgent(slug));
      invalidateStarQueries();
      toast.success('Agent starred!');
    },
    onError: (error: any) => {
      const status = error?.response?.status || error?.status || 'no-status';
      // 409 means already starred - just update local state
      if (status === 409) {
        dispatch(addStarredAgent(slug));
        invalidateStarQueries();
        toast.success('Agent already starred');
        return;
      }
      toast.error(`Failed to star (${status}: ${error?.message || 'unknown'})`);
    },
  });

  const unstarMutation = useMutation({
    mutationFn: () => agentsService.unstar(slug),
    onSuccess: () => {
      dispatch(removeStarredAgent(slug));
      invalidateStarQueries();
      toast.success('Agent unstarred');
    },
    onError: (error: any) => {
      const status = error?.response?.status || error?.status || 'no-status';
      // 404 "Agent not starred" means already unstarred - just update local state
      if (status === 404) {
        dispatch(removeStarredAgent(slug));
        invalidateStarQueries();
        toast.success('Agent already unstarred');
        return;
      }
      toast.error(`Failed to unstar (${status}: ${error?.message || 'unknown'})`);
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
