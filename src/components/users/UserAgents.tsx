import { AgentList } from '@/components/agents';
import type { Agent } from '@/types';

interface UserAgentsProps {
  agents: Agent[];
  isLoading?: boolean;
  title?: string;
  emptyMessage?: string;
}

export function UserAgents({
  agents,
  isLoading,
  title = 'Published Agents',
  emptyMessage = 'No agents published yet',
}: UserAgentsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">{title}</h2>
      <AgentList agents={agents} isLoading={isLoading} emptyMessage={emptyMessage} />
    </div>
  );
}
