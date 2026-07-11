import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products as productsApi, categories as categoriesApi } from '../api/endpoints';
import type { Product, Category } from '../types';
import { ProductCard } from './HomePage';
import { Card } from '../components/ui';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productList, setProductList] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect(() => {
    categoriesApi.list().then(r => setCats(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {
      page: String(page),
      limit: '20',
      sortBy,
      sortOrder,
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    productsApi.list(params)
      .then(r => { setProductList(r.data.data); setTotal(r.data.pagination.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, categoryId, minPrice, maxPrice, sortBy, sortOrder, page]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const hasFilters = search || categoryId || minPrice || maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} products found</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-6">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-1"><SlidersHorizontal className="w-4 h-4" /> Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => updateParam('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {cats.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split(':');
                  updateParam('sortBy', s);
                  updateParam('sortOrder', o);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="title:asc">Name: A-Z</option>
              </select>
            </div>
          </Card>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="aspect-square animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : productList.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {total > 20 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === Math.ceil(total / 20))
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {idx > 0 && arr[idx-1] !== p - 1 && <span className="text-gray-400">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >{p}</button>
                      </span>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
