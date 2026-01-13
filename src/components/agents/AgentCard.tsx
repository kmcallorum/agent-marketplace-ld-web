import { Link } from 'react-router-dom';
import { Download, Star, CheckCircle } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { StarRating } from '@/components/reviews';
import { formatNumber } from '@/utils/format';
import type { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card hover>
      <Link to={`/agents/${agent.slug}`} className="block p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
            {agent.name}
          </h3>
          {agent.is_validated && (
            <Badge color="green" size="sm">
              <CheckCircle className="w-3 h-3" />
              Validated
            </Badge>
          )}
        </div>

        <p className="text-neutral-600 mb-4 line-clamp-2">{agent.description}</p>

        <div className="flex gap-4 text-sm text-neutral-500 mb-4">
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {formatNumber(agent.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {formatNumber(agent.stars)}
          </span>
          <StarRating rating={agent.rating} size="sm" />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <Badge color="blue">{agent.category}</Badge>
          <span className="text-sm text-neutral-500">v{agent.current_version}</span>
        </div>
      </Link>
    </Card>
  );
}
