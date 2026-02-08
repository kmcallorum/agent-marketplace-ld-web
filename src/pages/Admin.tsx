import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Modal } from '@/components/common';
import { useAuth } from '@/hooks';
import { adminService, type Category, type CategoryCreate, type CategoryUpdate, type AdminAgentUpdate, type AdminUser, type AdminUserUpdate } from '@/services/admin';
import { Pencil, Trash2, Plus, FolderInput, Check, Ban, UserCheck, Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Agent } from '@/types';

function extractErrorMessage(error: any, fallback: string): string {
  const detail = error?.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d: any) => d.msg || String(d)).join(', ');
  return fallback;
}

type AdminTab = 'categories' | 'agents' | 'users';

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('categories');

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Agents state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkTargetCategory, setBulkTargetCategory] = useState<string>('');

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockingUser, setBlockingUser] = useState<AdminUser | null>(null);
  const [blockReason, setBlockReason] = useState('');

  // Form state for new category
  const [newCategory, setNewCategory] = useState<CategoryCreate>({
    name: '',
    slug: '',
    icon: '',
    description: '',
  });

  // Form state for editing category
  const [editCategoryForm, setEditCategoryForm] = useState<CategoryUpdate>({
    name: '',
    icon: '',
    description: '',
  });

  // Form state for editing agent
  const [editAgentForm, setEditAgentForm] = useState<AdminAgentUpdate>({
    name: '',
    description: '',
    category: '',
    is_public: true,
    is_validated: false,
  });

  // Form state for editing user
  const [editUserForm, setEditUserForm] = useState<AdminUserUpdate>({
    role: 'user',
    bio: '',
    is_active: true,
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

  const loadAgents = async (category?: string) => {
    setAgentsLoading(true);
    try {
      const data = await adminService.getAgents({ category: category || undefined, limit: 100 });
      setAgents(data.items);
    } catch {
      toast.error('Failed to load agents');
    } finally {
      setAgentsLoading(false);
    }
  };

  const loadUsers = async (search?: string) => {
    setUsersLoading(true);
    try {
      const data = await adminService.getUsers({ search: search || undefined, limit: 100 });
      setUsers(data.items);
      setUsersTotal(data.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadCategories();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (activeTab === 'agents' && isAuthenticated && user?.role === 'admin') {
      loadAgents(categoryFilter);
    }
  }, [activeTab, categoryFilter, isAuthenticated, user?.role]);

  useEffect(() => {
    if (activeTab === 'users' && isAuthenticated && user?.role === 'admin') {
      loadUsers(userSearch);
    }
  }, [activeTab, userSearch, isAuthenticated, user?.role]);

  // Category handlers
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
      toast.error(extractErrorMessage(error, 'Failed to create category'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryForm({
      name: category.name,
      icon: category.icon || '',
      description: category.description || '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSaving(true);
    try {
      const updated = await adminService.updateCategory(editingCategory.slug, editCategoryForm);
      setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      toast.success('Category updated');
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to update category'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.agent_count > 0) {
      toast.error(`Cannot delete "${category.name}" - it has ${category.agent_count} agent(s). Move them first.`);
      return;
    }

    if (!confirm(`Delete category "${category.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteCategory(category.slug);
      setCategories(categories.filter((c) => c.id !== category.id));
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to delete category'));
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

  // Agent handlers
  const handleEditAgentClick = (agent: Agent) => {
    setEditingAgent(agent);
    setEditAgentForm({
      name: agent.name,
      description: agent.description,
      category: agent.category,
      is_public: agent.is_public,
      is_validated: agent.is_validated,
    });
    setIsAgentModalOpen(true);
  };

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setIsSaving(true);
    try {
      const updated = await adminService.updateAgent(editingAgent.slug, editAgentForm);
      setAgents(agents.map((a) => (a.id === updated.id ? updated : a)));
      setIsAgentModalOpen(false);
      setEditingAgent(null);
      toast.success('Agent updated');
      // Refresh categories to update agent counts
      loadCategories();
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to update agent'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (!confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteAgent(agent.slug);
      setAgents(agents.filter((a) => a.id !== agent.id));
      toast.success('Agent deleted');
      loadCategories(); // Refresh counts
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to delete agent'));
    }
  };

  const toggleAgentSelection = (slug: string) => {
    const newSelection = new Set(selectedAgents);
    if (newSelection.has(slug)) {
      newSelection.delete(slug);
    } else {
      newSelection.add(slug);
    }
    setSelectedAgents(newSelection);
  };

  const selectAllAgents = () => {
    if (selectedAgents.size === agents.length) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(agents.map(a => a.slug)));
    }
  };

  const handleBulkMove = async () => {
    if (selectedAgents.size === 0 || !bulkTargetCategory) {
      toast.error('Select agents and target category');
      return;
    }

    setIsSaving(true);
    try {
      const result = await adminService.bulkUpdateCategory({
        agent_slugs: Array.from(selectedAgents),
        new_category: bulkTargetCategory,
      });
      toast.success(`Moved ${result.updated} agent(s) to ${bulkTargetCategory}`);
      setIsBulkModalOpen(false);
      setSelectedAgents(new Set());
      setBulkTargetCategory('');
      loadAgents(categoryFilter);
      loadCategories();
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to move agents'));
    } finally {
      setIsSaving(false);
    }
  };

  // User handlers
  const handleEditUserClick = (u: AdminUser) => {
    setEditingUser(u);
    setEditUserForm({
      role: u.role as 'user' | 'admin',
      bio: u.bio || '',
      is_active: u.is_active,
    });
    setIsUserModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);
    try {
      const updated = await adminService.updateUser(editingUser.id, editUserForm);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setIsUserModalOpen(false);
      setEditingUser(null);
      toast.success('User updated');
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to update user'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockUserClick = (u: AdminUser) => {
    setBlockingUser(u);
    setBlockReason('');
    setIsBlockModalOpen(true);
  };

  const handleBlockUser = async () => {
    if (!blockingUser || blockReason.length < 10) {
      toast.error('Please provide a reason (min 10 characters)');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await adminService.blockUser(blockingUser.id, { blocked_reason: blockReason });
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setIsBlockModalOpen(false);
      setBlockingUser(null);
      setBlockReason('');
      toast.success('User blocked');
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to block user'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnblockUser = async (u: AdminUser) => {
    if (!confirm(`Unblock user "${u.username}"?`)) return;

    try {
      const updated = await adminService.unblockUser(u.id);
      setUsers(users.map((usr) => (usr.id === updated.id ? updated : usr)));
      toast.success('User unblocked');
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to unblock user'));
    }
  };

  const handleDeleteUser = async (u: AdminUser) => {
    if (!confirm(`Delete user "${u.username}"? This will also delete all their agents, reviews, and stars. This cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteUser(u.id);
      setUsers(users.filter((usr) => usr.id !== u.id));
      toast.success('User deleted');
    } catch (error: any) {
      toast.error(extractErrorMessage(error, 'Failed to delete user'));
    }
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-2">
          <Button
            variant={activeTab === 'categories' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('categories')}
          >
            Categories ({categories.length})
          </Button>
          <Button
            variant={activeTab === 'agents' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('agents')}
          >
            Agents
          </Button>
          <Button
            variant={activeTab === 'users' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('users')}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Users
          </Button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
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
                          {category.agent_count > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setActiveTab('agents');
                                setCategoryFilter(category.slug);
                              }}
                              title="View agents in this category"
                            >
                              <FolderInput className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategoryClick(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                            title={category.agent_count > 0 ? 'Move agents first' : 'Delete category'}
                          >
                            <Trash2 className={`w-4 h-4 ${category.agent_count > 0 ? 'text-neutral-300' : 'text-red-500'}`} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="grid gap-6">
            {/* Filters and Actions */}
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Filter by Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name} ({cat.agent_count})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedAgents.size > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600">
                        {selectedAgents.size} selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsBulkModalOpen(true)}
                        leftIcon={<FolderInput className="w-4 h-4" />}
                      >
                        Move to Category
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Agents List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Agents {categoryFilter && `in "${categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}"`}
                    {' '}({agents.length})
                  </h2>
                  {agents.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={selectAllAgents}>
                      {selectedAgents.size === agents.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {agentsLoading ? (
                  <p className="text-neutral-500">Loading agents...</p>
                ) : agents.length === 0 ? (
                  <p className="text-neutral-500">No agents found.</p>
                ) : (
                  <div className="divide-y divide-neutral-200">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`py-4 flex items-center gap-4 ${selectedAgents.has(agent.slug) ? 'bg-primary-50' : ''}`}
                      >
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleAgentSelection(agent.slug)}
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedAgents.has(agent.slug)
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'border-neutral-300 hover:border-primary-500'
                          }`}
                        >
                          {selectedAgents.has(agent.slug) && <Check className="w-3 h-3" />}
                        </button>

                        {/* Agent Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900">
                              {agent.name}
                            </span>
                            <span className="text-xs text-neutral-400">
                              ({agent.slug})
                            </span>
                            {agent.is_validated && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                Validated
                              </span>
                            )}
                            {!agent.is_public && (
                              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
                            {agent.description}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            Category: {agent.category} | Author: {agent.author?.username || 'Unknown'} | v{agent.current_version}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAgentClick(agent)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAgent(agent)}
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
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid gap-6">
            {/* Search */}
            <Card>
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search users by username or email..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-neutral-500">
                    {usersTotal} user{usersTotal !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Users</h2>
              </CardHeader>
              <CardBody>
                {usersLoading ? (
                  <p className="text-neutral-500">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-neutral-500">No users found.</p>
                ) : (
                  <div className="divide-y divide-neutral-200">
                    {users.map((u) => (
                      <div key={u.id} className="py-4 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900">{u.username}</span>
                            {u.role === 'admin' && (
                              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                Admin
                              </span>
                            )}
                            {u.is_blocked && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                                Blocked
                              </span>
                            )}
                            {!u.is_active && (
                              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500">{u.email}</p>
                          <p className="text-xs text-neutral-400 mt-1">
                            GitHub ID: {u.github_id} | Joined: {new Date(u.created_at).toLocaleDateString()}
                            {u.is_blocked && u.blocked_reason && (
                              <span className="text-red-500"> | Blocked: {u.blocked_reason}</span>
                            )}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUserClick(u)}
                            title="Edit user"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {u.is_blocked ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnblockUser(u)}
                              title="Unblock user"
                            >
                              <UserCheck className="w-4 h-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBlockUserClick(u)}
                              title="Block user"
                              disabled={u.role === 'admin'}
                            >
                              <Ban className={`w-4 h-4 ${u.role === 'admin' ? 'text-neutral-300' : 'text-orange-500'}`} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(u)}
                            title={u.role === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                            disabled={u.role === 'admin'}
                          >
                            <Trash2 className={`w-4 h-4 ${u.role === 'admin' ? 'text-neutral-300' : 'text-red-500'}`} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {/* Edit Category Modal */}
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title={`Edit: ${editingCategory?.name}`}
          size="lg"
        >
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <Input
              label="Name"
              value={editCategoryForm.name || ''}
              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
            />
            <Input
              label="Icon (Lucide icon name)"
              value={editCategoryForm.icon || ''}
              onChange={(e) => setEditCategoryForm({ ...editCategoryForm, icon: e.target.value })}
            />
            <Textarea
              label="Description"
              value={editCategoryForm.description || ''}
              onChange={(e) =>
                setEditCategoryForm({ ...editCategoryForm, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Agent Modal */}
        <Modal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          title={`Edit Agent: ${editingAgent?.name}`}
          size="lg"
        >
          <form onSubmit={handleUpdateAgent} className="space-y-4">
            <Input
              label="Name"
              value={editAgentForm.name || ''}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, name: e.target.value })}
            />
            <Textarea
              label="Description"
              value={editAgentForm.description || ''}
              onChange={(e) => setEditAgentForm({ ...editAgentForm, description: e.target.value })}
              rows={4}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={editAgentForm.category || ''}
                onChange={(e) => setEditAgentForm({ ...editAgentForm, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAgentForm.is_public ?? true}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, is_public: e.target.checked })}
                  className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Public</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAgentForm.is_validated ?? false}
                  onChange={(e) => setEditAgentForm({ ...editAgentForm, is_validated: e.target.checked })}
                  className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Validated</span>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAgentModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Bulk Move Modal */}
        <Modal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title={`Move ${selectedAgents.size} Agent(s)`}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-neutral-600">
              Select a category to move the selected agents to:
            </p>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Target Category
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={bulkTargetCategory}
                onChange={(e) => setBulkTargetCategory(e.target.value)}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.agent_count} agents)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBulkModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkMove}
                isLoading={isSaving}
                disabled={!bulkTargetCategory}
              >
                Move Agents
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          title={`Edit User: ${editingUser?.username}`}
          size="md"
        >
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={editUserForm.role || 'user'}
                onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value as 'user' | 'admin' })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Textarea
              label="Bio"
              value={editUserForm.bio || ''}
              onChange={(e) => setEditUserForm({ ...editUserForm, bio: e.target.value })}
              rows={3}
              placeholder="User biography..."
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editUserForm.is_active ?? true}
                onChange={(e) => setEditUserForm({ ...editUserForm, is_active: e.target.checked })}
                className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Active</span>
            </label>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Block User Modal */}
        <Modal
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          title={`Block User: ${blockingUser?.username}`}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-neutral-600">
              This will prevent the user from logging in. They will see the block reason when they try to access the site.
            </p>
            <Textarea
              label="Block Reason"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              rows={3}
              placeholder="Reason for blocking this user (min 10 characters)..."
              required
            />
            <p className="text-xs text-neutral-500">
              The user will be shown this message: "Your account has been blocked by the administration team. If you wish to discuss this, please email admin or submit a support ticket."
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBlockModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBlockUser}
                isLoading={isSaving}
                disabled={blockReason.length < 10}
                className="bg-red-600 hover:bg-red-700"
              >
                Block User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
