import { AgentCard } from './AgentCard';
import { LoadingPage } from '@/components/common';
import type { Agent } from '@/types';

interface AgentListProps {
  agents: Agent[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function AgentList({
  agents,
  isLoading,
  emptyMessage = 'No agents found',
}: AgentListProps) {
  if (isLoading) {
    return <LoadingPage message="Loading agents..." />;
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
