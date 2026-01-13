import { Link } from 'react-router-dom';
import { Plus, Package, Download, Star, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { AgentList } from '@/components/agents';
import { Card, CardBody, Button, LoadingPage } from '@/components/common';
import { useAuth } from '@/hooks';
import { usersService } from '@/services';
import { formatNumber } from '@/utils/format';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', user?.username],
    queryFn: () => usersService.getProfile(user!.username),
    enabled: !!user?.username,
  });

  const { data: agentsData, isLoading: agentsLoading } = useQuery({
    queryKey: ['my-agents', user?.username],
    queryFn: () => usersService.getAgents(user!.username),
    enabled: !!user?.username,
  });

  if (authLoading) {
    return (
      <Layout>
        <LoadingPage message="Loading..." />
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-neutral-600">Please log in to access your dashboard.</p>
        </div>
      </Layout>
    );
  }

  const stats = profileData?.stats;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <Link to="/publish">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Publish Agent
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {stats && !profileLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {stats.agents_published}
                </p>
                <p className="text-sm text-neutral-500">Agents</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(stats.total_downloads)}
                </p>
                <p className="text-sm text-neutral-500">Downloads</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(stats.total_stars)}
                </p>
                <p className="text-sm text-neutral-500">Stars</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {profileData?.reputation || 0}
                </p>
                <p className="text-sm text-neutral-500">Reputation</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* My Agents */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">My Agents</h2>
        <AgentList
          agents={agentsData?.items || []}
          isLoading={agentsLoading}
          emptyMessage="You haven't published any agents yet. Click 'Publish Agent' to get started!"
        />
      </div>
    </Layout>
  );
}
