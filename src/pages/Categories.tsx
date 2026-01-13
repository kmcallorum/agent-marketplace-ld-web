import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { AgentList } from '@/components/agents';
import { Card, CardBody, LoadingPage } from '@/components/common';
import { useCategories, useCategoryAgents, useCategory } from '@/hooks';

export default function Categories() {
  const { slug } = useParams<{ slug: string }>();

  if (slug) {
    return <CategoryDetail slug={slug} />;
  }

  return <CategoriesList />;
}

function CategoriesList() {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <Layout>
        <LoadingPage message="Loading categories..." />
      </Layout>
    );
  }

  const categories = data?.categories || [];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.slug} to={`/categories/${category.slug}`}>
            <Card hover className="h-full">
              <CardBody className="text-center py-8">
                <span className="text-4xl mb-4 block">{category.icon}</span>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-neutral-600 text-sm mb-3">
                    {category.description}
                  </p>
                )}
                <p className="text-primary-600 font-medium">
                  {category.agent_count} agent{category.agent_count !== 1 ? 's' : ''}
                </p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

function CategoryDetail({ slug }: { slug: string }) {
  const { data: category, isLoading: categoryLoading } = useCategory(slug);
  const { data: agentsData, isLoading: agentsLoading } = useCategoryAgents(slug);

  if (categoryLoading) {
    return (
      <Layout>
        <LoadingPage message="Loading category..." />
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-neutral-600">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{category.name}</h1>
            {category.description && (
              <p className="text-neutral-600">{category.description}</p>
            )}
          </div>
        </div>
        <p className="text-neutral-500">{category.agent_count} agent{category.agent_count !== 1 ? 's' : ''} in this category</p>
      </div>

      <AgentList
        agents={agentsData?.items || []}
        isLoading={agentsLoading}
        emptyMessage="No agents in this category yet"
      />
    </Layout>
  );
}
