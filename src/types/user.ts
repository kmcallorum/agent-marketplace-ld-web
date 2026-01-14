export interface User {
  id: number;
  github_id?: number;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  reputation: number;
  is_active: boolean;
  role?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  stats: {
    agents_published: number;
    total_downloads: number;
    total_stars: number;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  reputation?: number;
  role?: string;
}
