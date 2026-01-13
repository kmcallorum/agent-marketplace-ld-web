export interface Agent {
  id: number;
  name: string;
  slug: string;
  description: string;
  author: User;
  current_version: string;
  downloads: number;
  stars: number;
  rating: number;
  category: string;
  is_public: boolean;
  is_validated: boolean;
  versions?: AgentVersion[];
  created_at: string;
  updated_at: string;
}

export interface AgentVersion {
  id: number;
  version: string;
  changelog: string;
  size_bytes: number;
  tested: boolean;
  security_scan_passed: boolean;
  quality_score?: number;
  published_at: string;
}

export interface AgentCreate {
  name: string;
  description: string;
  category: string;
  version: string;
  codeFile: File;
}

export interface AgentUpdate {
  description?: string;
  category?: string;
}

export interface AgentStats {
  downloads: {
    total: number;
    last_30_days: number;
    daily: { date: string; count: number }[];
  };
  stars: {
    total: number;
    last_30_days: number;
  };
  reviews: {
    count: number;
    average_rating: number;
  };
}

export interface User {
  id: number;
  username: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  reputation?: number;
  created_at?: string;
}
