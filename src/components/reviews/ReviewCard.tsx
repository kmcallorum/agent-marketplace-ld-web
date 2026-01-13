import { ThumbsUp } from 'lucide-react';
import { Avatar } from '@/components/common';
import { StarRating } from './StarRating';
import { formatRelativeTime } from '@/utils/format';
import { useMarkReviewHelpful } from '@/hooks';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { mutate: markHelpful, isPending } = useMarkReviewHelpful();

  return (
    <div className="border-b border-neutral-200 py-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <Avatar
          src={review.user.avatar_url}
          alt={review.user.username}
          size="md"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-neutral-900">
                {review.user.username}
              </span>
              <span className="mx-2 text-neutral-400">-</span>
              <span className="text-sm text-neutral-500">
                {formatRelativeTime(review.created_at)}
              </span>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>

          <p className="text-neutral-700 mb-4">{review.comment}</p>

          <button
            onClick={() => markHelpful(review.id)}
            disabled={isPending}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            Helpful ({review.helpful_count})
          </button>
        </div>
      </div>
    </div>
  );
}
