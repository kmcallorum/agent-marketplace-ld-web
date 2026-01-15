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

export interface AdminUser {
  id: number;
  github_id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  reputation: number;
  role: string;
  is_active: boolean;
  is_blocked: boolean;
  blocked_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserUpdate {
  role?: 'user' | 'admin';
  bio?: string;
  is_active?: boolean;
}

export interface AdminUserBlock {
  blocked_reason: string;
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

  // Agent management (admin endpoints)
  async getAgents(params?: { category?: string; limit?: number; offset?: number }): Promise<{ items: Agent[]; total: number }> {
    const response = await api.get<{ items: Agent[]; total: number }>('/api/v1/admin/agents', { params });
    return response.data;
  },

  async updateAgent(slug: string, data: AdminAgentUpdate): Promise<Agent> {
    const response = await api.put<Agent>(`/api/v1/admin/agents/${slug}`, data);
    return response.data;
  },

  async deleteAgent(slug: string): Promise<void> {
    await api.delete(`/api/v1/admin/agents/${slug}`);
  },

  async bulkUpdateCategory(data: BulkCategoryUpdate): Promise<{ updated: number }> {
    const response = await api.post<{ updated: number }>('/api/v1/admin/agents/bulk-category', data);
    return response.data;
  },

  // User management (admin endpoints)
  async getUsers(params?: { search?: string; limit?: number; offset?: number }): Promise<{ items: AdminUser[]; total: number }> {
    const response = await api.get<{ items: AdminUser[]; total: number }>('/api/v1/admin/users', { params });
    return response.data;
  },

  async getUser(userId: number): Promise<AdminUser> {
    const response = await api.get<AdminUser>(`/api/v1/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: number, data: AdminUserUpdate): Promise<AdminUser> {
    const response = await api.put<AdminUser>(`/api/v1/admin/users/${userId}`, data);
    return response.data;
  },

  async blockUser(userId: number, data: AdminUserBlock): Promise<AdminUser> {
    const response = await api.post<AdminUser>(`/api/v1/admin/users/${userId}/block`, data);
    return response.data;
  },

  async unblockUser(userId: number): Promise<AdminUser> {
    const response = await api.post<AdminUser>(`/api/v1/admin/users/${userId}/unblock`);
    return response.data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/api/v1/admin/users/${userId}`);
  },
};
