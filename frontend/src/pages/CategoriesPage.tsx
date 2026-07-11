import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories as categoriesApi } from '../api/endpoints';
import type { Category } from '../types';
import { Card } from '../components/ui';
import { Package, ChevronRight } from 'lucide-react';

export function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi.list()
      .then(r => setCats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Browse Categories</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i} className="h-32 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <Card key={cat.id} className="p-6">
              <Link to={`/products?categoryId=${cat.id}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-brand-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-400">{cat._count?.products || 0} products</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </Link>
              {cat.children && cat.children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {cat.children.map((child) => (
                      <Link key={child.id} to={`/products?categoryId=${child.id}`} className="text-xs text-gray-500 hover:text-brand-600 bg-gray-50 px-2.5 py-1 rounded-full">
                        {child.name} ({child._count?.products || 0})
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
