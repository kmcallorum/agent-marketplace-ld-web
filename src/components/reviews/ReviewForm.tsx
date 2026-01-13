import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Textarea } from '@/components/common';
import { StarRating } from './StarRating';
import { useCreateReview } from '@/hooks';
import { reviewCreateSchema, ReviewCreateInput } from '@/utils/validation';

interface ReviewFormProps {
  agentSlug: string;
  onSuccess?: () => void;
}

export function ReviewForm({ agentSlug, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const { mutate: createReview, isPending } = useCreateReview(agentSlug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewCreateInput>({
    resolver: zodResolver(reviewCreateSchema),
  });

  const onSubmit = (data: ReviewCreateInput) => {
    createReview(
      { ...data, rating },
      {
        onSuccess: () => {
          reset();
          setRating(0);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Rating
        </label>
        <StarRating
          rating={rating}
          onChange={setRating}
          interactive
          size="lg"
        />
        {rating === 0 && (
          <p className="text-sm text-neutral-500 mt-1">Click to rate</p>
        )}
      </div>

      <Textarea
        label="Review"
        placeholder="Share your experience with this agent..."
        error={errors.comment?.message}
        {...register('comment')}
        rows={4}
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isPending}
        disabled={rating === 0}
      >
        Post Review
      </Button>
    </form>
  );
}
