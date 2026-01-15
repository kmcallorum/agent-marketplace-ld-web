import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { SearchBar, SearchFilters, SearchResults } from '@/components/search';
import { useSearch } from '@/hooks';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useSearch();

  const getTitle = () => {
    if (query && category) {
      return `Search Results for "${query}" in ${category}`;
    }
    if (query) {
      return `Search Results for "${query}"`;
    }
    if (category) {
      return `Browse ${category}`;
    }
    return 'All Agents';
  };

  return (
    <Layout>
      <div className="mb-8">
        <SearchBar initialValue={query} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1">
          <SearchFilters />
        </aside>

        {/* Results */}
        <main className="md:col-span-3">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">
            {getTitle()}
          </h1>
          <SearchResults
            results={data?.items || []}
            total={data?.total || 0}
            isLoading={isLoading}
          />
        </main>
      </div>
    </Layout>
  );
}
