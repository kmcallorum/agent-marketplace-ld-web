import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { AgentDetail, AgentStats, VersionHistory, InstallButton } from '@/components/agents';
import { ReviewList } from '@/components/reviews';
import { LoadingPage, Card, CardBody, Avatar } from '@/components/common';
import { useAgent, useAgentStats, useAgentVersions } from '@/hooks';
import { Link } from 'react-router-dom';

export default function AgentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: agent, isLoading: agentLoading } = useAgent(slug!);
  const { data: stats } = useAgentStats(slug!);
  const { data: versionsData } = useAgentVersions(slug!);

  if (agentLoading) {
    return (
      <Layout>
        <LoadingPage message="Loading agent..." />
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Agent Not Found</h1>
          <p className="text-neutral-600">The agent you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AgentDetail agent={agent} />

          {versionsData && versionsData.versions.length > 0 && (
            <VersionHistory
              versions={versionsData.versions}
              currentVersion={agent.current_version}
            />
          )}

          <ReviewList agentSlug={slug!} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <InstallButton agent={agent} />

          {stats && <AgentStats stats={stats} />}

          {/* Author Card */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Author</h3>
              <Link
                to={`/users/${agent.author.username}`}
                className="flex items-center gap-3 hover:bg-neutral-50 p-2 -m-2 rounded-lg transition-colors"
              >
                <Avatar
                  src={agent.author.avatar_url}
                  alt={agent.author.username}
                  size="lg"
                />
                <div>
                  <p className="font-medium text-neutral-900">
                    {agent.author.username}
                  </p>
                  <p className="text-sm text-neutral-500">View profile</p>
                </div>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
