import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { StarRating } from './StarRating';
import { LoadingPage } from '@/components/common';
import { useReviews, useAuth } from '@/hooks';

interface ReviewListProps {
  agentSlug: string;
}

export function ReviewList({ agentSlug }: ReviewListProps) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useReviews(agentSlug);

  if (isLoading) {
    return <LoadingPage message="Loading reviews..." />;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">Reviews</h3>
        {data && data.total > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={data.average_rating} size="md" />
            <span className="text-neutral-600">
              {(typeof data.average_rating === 'string' ? parseFloat(data.average_rating) : data.average_rating).toFixed(1)} ({data.total} review{data.total !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="mb-8">
          <ReviewForm agentSlug={agentSlug} />
        </div>
      )}

      {data && data.items.length > 0 ? (
        <div>
          {data.items.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500 text-center py-8">
          No reviews yet. Be the first to review this agent!
        </p>
      )}
    </div>
  );
}
