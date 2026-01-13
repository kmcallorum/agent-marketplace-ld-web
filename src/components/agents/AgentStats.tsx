import { Download, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/common';
import { formatNumber } from '@/utils/format';
import type { AgentStats as AgentStatsType } from '@/types';

interface AgentStatsProps {
  stats: AgentStatsType;
}

export function AgentStats({ stats }: AgentStatsProps) {
  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Statistics</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <Download className="w-5 h-5" />
              <span>Total Downloads</span>
            </div>
            <span className="font-semibold text-neutral-900">
              {formatNumber(stats.downloads.total)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <TrendingUp className="w-5 h-5" />
              <span>Last 30 Days</span>
            </div>
            <span className="font-semibold text-neutral-900">
              {formatNumber(stats.downloads.last_30_days)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <Star className="w-5 h-5" />
              <span>Total Stars</span>
            </div>
            <span className="font-semibold text-neutral-900">
              {formatNumber(stats.stars.total)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <MessageSquare className="w-5 h-5" />
              <span>Reviews</span>
            </div>
            <span className="font-semibold text-neutral-900">
              {stats.reviews.count} ({(typeof stats.reviews.average_rating === 'string' ? parseFloat(stats.reviews.average_rating) : stats.reviews.average_rating).toFixed(1)} avg)
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
