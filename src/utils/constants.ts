// Use empty string for same-origin API calls (K3s ingress routes /api to backend)
// Only use fallback if VITE_API_URL is undefined (not just empty)
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.agent-marketplace.com';

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
