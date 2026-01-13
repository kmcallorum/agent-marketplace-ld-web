export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface ApiError {
  error: string;
  detail: string | ValidationError[];
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  agent_count: number;
}

export interface PlatformStats {
  agents: {
    total: number;
    validated: number;
    pending: number;
  };
  users: {
    total: number;
    active_this_month: number;
  };
  downloads: {
    total: number;
    last_30_days: number;
  };
}

export interface TrendingAgent {
  agent: import('./agent').Agent;
  trend_score: number;
  downloads_change: string;
}

export interface SearchSuggestion {
  suggestions: string[];
}
