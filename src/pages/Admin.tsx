import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Modal } from '@/components/common';
import { useAuth } from '@/hooks';
import { adminService, type Category, type CategoryCreate, type CategoryUpdate } from '@/services/admin';
import { Pencil, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for new category
  const [newCategory, setNewCategory] = useState<CategoryCreate>({
    name: '',
    slug: '',
    icon: '',
    description: '',
  });

  // Form state for editing
  const [editForm, setEditForm] = useState<CategoryUpdate>({
    name: '',
    icon: '',
    description: '',
  });

  const loadCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadCategories();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Name and slug are required');
      return;
    }

    setIsSaving(true);
    try {
      const created = await adminService.createCategory(newCategory);
      setCategories([...categories, created]);
      setNewCategory({ name: '', slug: '', icon: '', description: '' });
      toast.success('Category created');
    } catch (error: any) {
      const detail = error?.response?.data?.detail || 'Failed to create category';
      toast.error(detail);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      icon: category.icon || '',
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSaving(true);
    try {
      const updated = await adminService.updateCategory(editingCategory.slug, editForm);
      setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
      setIsModalOpen(false);
      setEditingCategory(null);
      toast.success('Category updated');
    } catch (error: any) {
      const detail = error?.response?.data?.detail || 'Failed to update category';
      toast.error(detail);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Delete category "${category.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteCategory(category.slug);
      setCategories(categories.filter((c) => c.id !== category.id));
      toast.success('Category deleted');
    } catch (error: any) {
      const detail = error?.response?.data?.detail || 'Failed to delete category';
      toast.error(detail);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="text-center py-16">Loading...</div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-neutral-600">Please log in to access admin.</p>
        </div>
      </Layout>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Access Denied
          </h1>
          <p className="text-neutral-600">You do not have admin privileges.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Admin Panel</h1>

        <div className="grid gap-8">
          {/* Add Category Form */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Add Category</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g. Data Processing"
                    value={newCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNewCategory({
                        ...newCategory,
                        name,
                        slug: generateSlug(name),
                      });
                    }}
                    required
                  />
                  <Input
                    label="Slug"
                    placeholder="e.g. data-processing"
                    value={newCategory.slug}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, slug: e.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  label="Icon (Lucide icon name)"
                  placeholder="e.g. database, code, shield"
                  value={newCategory.icon || ''}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, icon: e.target.value })
                  }
                />
                <Textarea
                  label="Description"
                  placeholder="Brief description of the category"
                  value={newCategory.description || ''}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                />
                <Button type="submit" isLoading={isSaving} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Category
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Categories List */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
            </CardHeader>
            <CardBody>
              {categories.length === 0 ? (
                <p className="text-neutral-500">No categories yet.</p>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="py-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900">
                            {category.name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            ({category.slug})
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-sm text-neutral-500 mt-1">
                            {category.description}
                          </p>
                        )}
                        <p className="text-xs text-neutral-400 mt-1">
                          {category.agent_count} agent{category.agent_count !== 1 ? 's' : ''}
                          {category.icon && ` | icon: ${category.icon}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit: ${editingCategory?.name}`}
          size="lg"
        >
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <Input
              label="Name"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              label="Icon (Lucide icon name)"
              value={editForm.icon || ''}
              onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
            />
            <Textarea
              label="Description"
              value={editForm.description || ''}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
