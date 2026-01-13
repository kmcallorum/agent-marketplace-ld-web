import { useSearchParams } from 'react-router-dom';
import { Select } from '@/components/common';
import { CATEGORIES, SORT_OPTIONS } from '@/utils/constants';

export function SearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const minRating = searchParams.get('min_rating') || '';

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const sortOptions = SORT_OPTIONS.map((s) => ({
    value: s.value,
    label: s.label,
  }));

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-900">Filters</h3>

      <Select
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={(e) => updateParam('category', e.target.value)}
      />

      <Select
        label="Sort By"
        options={sortOptions}
        value={sort}
        onChange={(e) => updateParam('sort', e.target.value)}
      />

      <Select
        label="Minimum Rating"
        options={ratingOptions}
        value={minRating}
        onChange={(e) => updateParam('min_rating', e.target.value)}
      />

      <button
        onClick={() => setSearchParams({})}
        className="text-sm text-primary-600 hover:text-primary-700"
      >
        Clear all filters
      </button>
    </div>
  );
}
