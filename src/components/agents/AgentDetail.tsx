import { Download, Star, CheckCircle, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge, Avatar } from '@/components/common';
import { StarRating } from '@/components/reviews';
import { formatNumber, formatDate } from '@/utils/format';
import type { Agent } from '@/types';
import { Link } from 'react-router-dom';

interface AgentDetailProps {
  agent: Agent;
}

export function AgentDetail({ agent }: AgentDetailProps) {
  return (
    <div>
      <div className="border-b border-neutral-200 pb-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold text-neutral-900">{agent.name}</h1>
          {agent.is_validated && (
            <Badge color="green">
              <CheckCircle className="w-4 h-4" />
              Validated
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center text-neutral-600">
          <Badge color="blue">{agent.category}</Badge>
          <StarRating rating={agent.rating} showValue />
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {formatNumber(agent.downloads)} downloads
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {formatNumber(agent.stars)} stars
          </span>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Link
            to={`/users/${agent.author.username}`}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-600"
          >
            <Avatar
              src={agent.author.avatar_url}
              alt={agent.author.username}
              size="sm"
            />
            <span>{agent.author.username}</span>
          </Link>
          <span className="flex items-center gap-1 text-neutral-500 text-sm">
            <Calendar className="w-4 h-4" />
            Published {formatDate(agent.created_at)}
          </span>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        <ReactMarkdown>{agent.description}</ReactMarkdown>
      </div>
    </div>
  );
}
