import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { SearchBar, SearchFilters, SearchResults } from '@/components/search';
import { useSearch } from '@/hooks';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useSearch();

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
          {query ? (
            <>
              <h1 className="text-3xl font-bold text-neutral-900 mb-6">
                Search Results for "{query}"
              </h1>
              <SearchResults
                results={data?.items || []}
                total={data?.total || 0}
                isLoading={isLoading}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-neutral-700 mb-2">
                Search for Agents
              </h2>
              <p className="text-neutral-500">
                Enter a search term above to find agents
              </p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
