import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/common';

export default function NotFound() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-neutral-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
              Search Agents
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
