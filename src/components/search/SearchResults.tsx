import { AgentList } from '@/components/agents';
import type { Agent } from '@/types';

interface SearchResultsProps {
  results: Agent[];
  total: number;
  isLoading?: boolean;
}

export function SearchResults({ results, total, isLoading }: SearchResultsProps) {
  return (
    <div>
      {!isLoading && total > 0 && (
        <p className="text-neutral-600 mb-6">
          Found {total} agent{total !== 1 ? 's' : ''}
        </p>
      )}

      <AgentList
        agents={results}
        isLoading={isLoading}
        emptyMessage="No agents match your search criteria"
      />
    </div>
  );
}
