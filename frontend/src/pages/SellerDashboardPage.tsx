import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products as productsApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import type { Product } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { Plus, Package, Edit, Trash2, MessageSquare, Warehouse, PackageOpen, ShoppingCart, User, ShoppingBag, Factory, BarChart3, BrainCircuit } from 'lucide-react';

export function SellerDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    productsApi.my()
      .then(r => setProductList(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(id);
      loadProducts();
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-sm text-gray-500">{productList.length} products listed</p>
        </div>
        <div className="flex gap-3">
          <Link to="/inquiries"><Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Inquiries</Button></Link>
          <Link to="/seller/products/new"><Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/seller/inventory" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-blue-50 rounded-lg"><PackageOpen className="w-5 h-5 text-blue-600" /></div>
          <span className="text-sm font-medium text-gray-700">Inventory</span>
        </Link>
        <Link to="/seller/warehouses" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-green-50 rounded-lg"><Warehouse className="w-5 h-5 text-green-600" /></div>
          <span className="text-sm font-medium text-gray-700">Warehouses</span>
        </Link>
        <Link to="/seller/orders" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-purple-50 rounded-lg"><ShoppingCart className="w-5 h-5 text-purple-600" /></div>
          <span className="text-sm font-medium text-gray-700">Orders</span>
        </Link>
        <Link to="/seller/customers" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-amber-50 rounded-lg"><User className="w-5 h-5 text-amber-600" /></div>
          <span className="text-sm font-medium text-gray-700">Customers</span>
        </Link>
        <Link to="/seller/invoices" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-pink-50 rounded-lg"><ShoppingBag className="w-5 h-5 text-pink-600" /></div>
          <span className="text-sm font-medium text-gray-700">Invoices</span>
        </Link>
        <Link to="/seller/manufacturing" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-indigo-50 rounded-lg"><Factory className="w-5 h-5 text-indigo-600" /></div>
          <span className="text-sm font-medium text-gray-700">Manufacturing</span>
        </Link>
        <Link to="/seller/analytics" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-teal-50 rounded-lg"><BarChart3 className="w-5 h-5 text-teal-600" /></div>
          <span className="text-sm font-medium text-gray-700">Analytics</span>
        </Link>
        <Link to="/seller/ai" className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all">
          <div className="p-2 bg-orange-50 rounded-lg"><BrainCircuit className="w-5 h-5 text-orange-600" /></div>
          <span className="text-sm font-medium text-gray-700">AI Insights</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i} className="h-64 animate-pulse" />)}
        </div>
      ) : productList.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h2>
          <p className="text-sm text-gray-500 mb-6">List your first product and start reaching buyers</p>
          <Link to="/seller/products/new"><Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button></Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{product.title}</h3>
                    <p className="text-xs text-gray-500">{product.category?.name}</p>
                  </div>
                  <Badge variant={product.status === 'ACTIVE' ? 'success' : product.status === 'DRAFT' ? 'warning' : 'danger'}>{product.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-brand-600">₹{product.price.toLocaleString()}/{product.unit}</span>
                  <span className="text-gray-400">MOQ: {product.minOrderQty}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link to={`/seller/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => deleteProduct(product.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
