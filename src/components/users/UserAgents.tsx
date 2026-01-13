import { AgentList } from '@/components/agents';
import type { Agent } from '@/types';

interface UserAgentsProps {
  agents: Agent[];
  isLoading?: boolean;
}

export function UserAgents({ agents, isLoading }: UserAgentsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">
        Published Agents
      </h2>
      <AgentList
        agents={agents}
        isLoading={isLoading}
        emptyMessage="No agents published yet"
      />
    </div>
  );
}
