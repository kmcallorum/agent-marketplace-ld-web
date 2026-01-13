import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { UserProfile, UserAgents, UserReviews } from '@/components/users';
import { LoadingPage, Button } from '@/components/common';
import { usersService } from '@/services';

type Tab = 'agents' | 'reviews' | 'starred';

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('agents');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => usersService.getProfile(username!),
    enabled: !!username,
  });

  const { data: agentsData, isLoading: agentsLoading } = useQuery({
    queryKey: ['user-agents', username],
    queryFn: () => usersService.getAgents(username!),
    enabled: !!username && activeTab === 'agents',
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['user-reviews', username],
    queryFn: () => usersService.getReviews(username!),
    enabled: !!username && activeTab === 'reviews',
  });

  const { data: starredData, isLoading: starredLoading } = useQuery({
    queryKey: ['user-starred', username],
    queryFn: () => usersService.getStarredAgents(username!),
    enabled: !!username && activeTab === 'starred',
  });

  if (userLoading) {
    return (
      <Layout>
        <LoadingPage message="Loading profile..." />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">User Not Found</h1>
          <p className="text-neutral-600">The user you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'agents' as Tab, label: 'Agents', count: user.stats.agents_published },
    { id: 'reviews' as Tab, label: 'Reviews' },
    { id: 'starred' as Tab, label: 'Starred' },
  ];

  return (
    <Layout>
      <UserProfile user={user} />

      <div className="mt-8 border-b border-neutral-200">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-xs">({tab.count})</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'agents' && (
          <UserAgents
            agents={agentsData?.items || []}
            isLoading={agentsLoading}
          />
        )}
        {activeTab === 'reviews' && (
          <UserReviews
            reviews={reviewsData?.items || []}
            isLoading={reviewsLoading}
          />
        )}
        {activeTab === 'starred' && (
          <UserAgents
            agents={starredData?.items || []}
            isLoading={starredLoading}
          />
        )}
      </div>
    </Layout>
  );
}
