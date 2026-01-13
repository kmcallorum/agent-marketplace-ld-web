import { Link } from 'react-router-dom';
import { StarRating } from '@/components/reviews';
import { formatRelativeTime } from '@/utils/format';
import type { Review } from '@/types';

interface ExtendedReview extends Review {
  agent_slug?: string;
  agent_name?: string;
}

interface UserReviewsProps {
  reviews: ExtendedReview[];
  isLoading?: boolean;
}

export function UserReviews({ reviews, isLoading }: UserReviewsProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        No reviews written yet
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-neutral-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              {review.agent_slug && review.agent_name && (
                <Link
                  to={`/agents/${review.agent_slug}`}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  {review.agent_name}
                </Link>
              )}
              <span className="text-sm text-neutral-500">
                {formatRelativeTime(review.created_at)}
              </span>
            </div>
            <StarRating rating={review.rating} size="sm" />
            <p className="text-neutral-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
