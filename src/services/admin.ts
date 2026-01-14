import api from './api';

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
};
