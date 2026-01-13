import { Calendar, Download, Star, Package } from 'lucide-react';
import { Avatar, Badge } from '@/components/common';
import { formatNumber, formatDate } from '@/utils/format';
import type { UserProfile as UserProfileType } from '@/types';

interface UserProfileProps {
  user: UserProfileType;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <Avatar src={user.avatar_url} alt={user.username} size="xl" />

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-neutral-900">{user.username}</h1>
          {user.reputation >= 100 && (
            <Badge color="purple">Top Contributor</Badge>
          )}
        </div>

        {user.bio && <p className="text-neutral-600 mb-4">{user.bio}</p>}

        <div className="flex flex-wrap gap-6 text-neutral-600">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <span>{user.stats.agents_published} agents</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>{formatNumber(user.stats.total_downloads)} downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span>{formatNumber(user.stats.total_stars)} stars</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Joined {formatDate(user.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
