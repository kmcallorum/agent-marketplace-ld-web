import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { AgentList } from '@/components/agents';
import { Button } from '@/components/common';
import { useTrendingAgents } from '@/hooks';

type Timeframe = 'hour' | 'day' | 'week' | 'month';

const timeframeOptions: { value: Timeframe; label: string }[] = [
  { value: 'hour', label: 'Past Hour' },
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function Trending() {
  const [timeframe, setTimeframe] = useState<Timeframe>('week');
  const { data, isLoading } = useTrendingAgents(timeframe, 20);

  const trendingAgents = data?.agents.map((t) => t.agent) || [];

  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-neutral-900">Trending Agents</h1>
      </div>

      <div className="flex gap-2 mb-8">
        {timeframeOptions.map((option) => (
          <Button
            key={option.value}
            variant={timeframe === option.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTimeframe(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <AgentList
        agents={trendingAgents}
        isLoading={isLoading}
        emptyMessage="No trending agents for this timeframe"
      />
    </Layout>
  );
}
