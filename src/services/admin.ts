import api from './api';
import type { Agent } from '@/types';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  agent_count: number;
}

export interface CategoryCreate {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  icon?: string;
  description?: string;
}

export interface AdminAgentUpdate {
  name?: string;
  description?: string;
  category?: string;
  is_public?: boolean;
  is_validated?: boolean;
}

export interface BulkCategoryUpdate {
  agent_slugs: string[];
  new_category: string;
}

export const adminService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ categories: Category[] }>('/api/v1/categories');
    return response.data.categories;
  },

  async createCategory(data: CategoryCreate): Promise<Category> {
    const response = await api.post<Category>('/api/v1/admin/categories', data);
    return response.data;
  },

  async updateCategory(slug: string, data: CategoryUpdate): Promise<Category> {
    const response = await api.put<Category>(`/api/v1/admin/categories/${slug}`, data);
    return response.data;
  },

  async deleteCategory(slug: string): Promise<void> {
    await api.delete(`/api/v1/admin/categories/${slug}`);
  },

  // Agent management
  async getAgents(params?: { category?: string; limit?: number; offset?: number }): Promise<{ items: Agent[]; total: number }> {
    const response = await api.get<{ items: Agent[]; total: number }>('/api/v1/agents', { params });
    return response.data;
  },

  async updateAgent(slug: string, data: AdminAgentUpdate): Promise<Agent> {
    const response = await api.put<Agent>(`/api/v1/agents/${slug}`, data);
    return response.data;
  },

  async deleteAgent(slug: string): Promise<void> {
    await api.delete(`/api/v1/agents/${slug}`);
  },

  async bulkUpdateCategory(data: BulkCategoryUpdate): Promise<{ updated: number }> {
    const response = await api.post<{ updated: number }>('/api/v1/admin/agents/bulk-category', data);
    return response.data;
  },
};
