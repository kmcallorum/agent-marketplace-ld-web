import { Link } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, Package } from 'lucide-react';
import { Layout } from '@/components/layout';
import { AgentList } from '@/components/agents';
import { SearchBar } from '@/components/search';
import { Button, Card, CardBody } from '@/components/common';
import { useTrendingAgents, usePopularAgents, usePlatformStats, useCategories } from '@/hooks';
import { formatNumber } from '@/utils/format';

export default function Home() {
  const { data: trendingData, isLoading: trendingLoading } = useTrendingAgents('week', 6);
  const { data: popularData, isLoading: popularLoading } = usePopularAgents(6);
  const { data: statsData } = usePlatformStats();
  const { data: categoriesData } = useCategories();

  const trendingAgents = trendingData?.agents.map((t) => t.agent) || [];
  const popularAgents = popularData?.items || [];
  const categories = categoriesData?.categories || [];

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover AI Agents
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            The marketplace for pytest-agents. Find, install, and share AI agents
            that supercharge your development workflow.
          </p>
          <div className="max-w-lg mx-auto mb-8">
            <SearchBar placeholder="Search for agents..." />
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/search">
              <Button variant="secondary" size="lg" leftIcon={<Search className="w-5 h-5" />}>
                Browse Agents
              </Button>
            </Link>
            <Link to="/publish">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Publish Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {statsData && (
        <section className="bg-white border-b border-neutral-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-neutral-900">
                  {formatNumber(statsData.agents.total)}
                </div>
                <div className="text-neutral-600">Agents</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">
                  {formatNumber(statsData.users.total)}
                </div>
                <div className="text-neutral-600">Developers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">
                  {formatNumber(statsData.downloads.total)}
                </div>
                <div className="text-neutral-600">Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">
                  {statsData.agents.validated}
                </div>
                <div className="text-neutral-600">Validated</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">Trending This Week</h2>
            </div>
            <Link to="/trending" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <AgentList agents={trendingAgents} isLoading={trendingLoading} />
        </section>

        {/* Popular Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900">Popular Agents</h2>
            </div>
            <Link to="/search?sort=downloads" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <AgentList agents={popularAgents} isLoading={popularLoading} />
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Browse by Category</h2>
            <Link to="/categories" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
              All categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.slug} to={`/categories/${category.slug}`}>
                <Card hover className="p-4 text-center">
                  <CardBody>
                    <span className="text-3xl mb-2 block">{category.icon}</span>
                    <h3 className="font-semibold text-neutral-900">{category.name}</h3>
                    <p className="text-sm text-neutral-500">{category.agent_count} agent{category.agent_count !== 1 ? 's' : ''}</p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
