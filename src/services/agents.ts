import api from './api';
import type { Agent, AgentCreate, AgentStats, AgentVersion, PaginatedResponse } from '@/types';

interface ListAgentsParams {
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

export const agentsService = {
  list: async (params?: ListAgentsParams): Promise<PaginatedResponse<Agent>> => {
    const response = await api.get<PaginatedResponse<Agent>>('/api/v1/agents', { params });
    return response.data;
  },

  get: async (slug: string): Promise<Agent> => {
    const response = await api.get<Agent>(`/api/v1/agents/${slug}`);
    return response.data;
  },

  publish: async (
    data: AgentCreate,
    onProgress?: (progress: number) => void
  ): Promise<{ id: number; slug: string; validation_status: string }> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('version', data.version);
    formData.append('code', data.codeFile);

    const response = await api.post('/api/v1/agents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        }
      },
    });

    return response.data;
  },

  update: async (slug: string, data: Partial<Agent>): Promise<Agent> => {
    const response = await api.put<Agent>(`/api/v1/agents/${slug}`, data);
    return response.data;
  },

  delete: async (slug: string): Promise<void> => {
    await api.delete(`/api/v1/agents/${slug}`);
  },

  getVersions: async (slug: string): Promise<{ versions: AgentVersion[] }> => {
    const response = await api.get<{ versions: AgentVersion[] }>(
      `/api/v1/agents/${slug}/versions`
    );
    return response.data;
  },

  publishVersion: async (
    slug: string,
    data: { version: string; changelog: string; codeFile: File },
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('version', data.version);
    formData.append('changelog', data.changelog);
    formData.append('code', data.codeFile);

    await api.post(`/api/v1/agents/${slug}/versions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        }
      },
    });
  },

  getDownloadUrl: (slug: string, version: string): string => {
    return `${api.defaults.baseURL}/api/v1/agents/${slug}/download/${version}`;
  },

  star: async (slug: string): Promise<void> => {
    await api.post(`/api/v1/agents/${slug}/star`);
  },

  unstar: async (slug: string): Promise<void> => {
    await api.delete(`/api/v1/agents/${slug}/star`);
  },

  getStats: async (slug: string): Promise<AgentStats> => {
    const response = await api.get<AgentStats>(`/api/v1/agents/${slug}/stats`);
    return response.data;
  },
};
