import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { Search, Shield, Truck, Headphones, ArrowRight, Star, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { products } from '../api/endpoints';
import type { Product, Category } from '../types';
import { categories } from '../api/endpoints';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    products.list({ limit: '8', sortBy: 'createdAt', sortOrder: 'desc' }).then(r => setFeatured(r.data.data)).catch(() => {});
    categories.list().then(r => setCats(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 via-white to-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              India's Trusted<br />
              <span className="text-brand-600">B2B Marketplace</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Connect with verified suppliers, source quality products, and grow your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Products <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register?role=seller">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Start Selling</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Verified Suppliers', desc: 'All suppliers are verified for authenticity' },
              { icon: Search, title: 'Easy Sourcing', desc: 'Find products across thousands of categories' },
              { icon: Truck, title: 'Pan India Delivery', desc: 'Connect with suppliers shipping across India' },
            ].map((f) => (
              <Card key={f.title} className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <Link to="/categories" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cats.map((cat) => (
                <Link key={cat.id} to={`/products?categoryId=${cat.id}`}>
                  <Card className="p-6 text-center hover:shadow-md transition-shadow">
                    <Package className="w-8 h-8 text-brand-600 mx-auto" />
                    <h3 className="mt-3 font-medium text-gray-900">{cat.name}</h3>
                    <p className="mt-1 text-sm text-gray-400">{cat._count?.products || 0} products</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-12 h-12 text-gray-300" />
          )}
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs text-gray-500">{product.company?.name}</p>
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{product.title}</h3>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-brand-600">₹{product.price.toLocaleString()}/{product.unit}</span>
            <span className="text-xs text-gray-400">MOQ: {product.minOrderQty}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
