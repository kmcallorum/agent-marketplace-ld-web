export interface Review {
  id: number;
  user: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  updated_at?: string;
}

export interface ReviewCreate {
  rating: number;
  comment: string;
}

export interface ReviewUpdate {
  rating?: number;
  comment?: string;
}

export interface ReviewsResponse {
  items: Review[];
  total: number;
  average_rating: number;
}
