export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.agent-marketplace.com';

export const CATEGORIES = [
  { slug: 'pm', name: 'Project Management', icon: '📋' },
  { slug: 'research', name: 'Research', icon: '🔬' },
  { slug: 'testing', name: 'Testing', icon: '🧪' },
  { slug: 'code-review', name: 'Code Review', icon: '👀' },
  { slug: 'documentation', name: 'Documentation', icon: '📝' },
  { slug: 'devops', name: 'DevOps', icon: '🚀' },
  { slug: 'security', name: 'Security', icon: '🔒' },
  { slug: 'data', name: 'Data & Analytics', icon: '📊' },
] as const;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'stars', label: 'Most Stars' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'created_at', label: 'Newest' },
] as const;

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
