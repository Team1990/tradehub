import { useEffect, useState } from 'react';
import { analytics } from '../api/endpoints';
import type { DashboardStats, ProductAnalytics, TopCustomer, MonthlySales } from '../types';
import { Card, Badge } from '../components/ui';
import { Package, Warehouse, ShoppingCart, MessageSquare, Users, AlertTriangle, DollarSign } from 'lucide-react';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [sales, setSales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analytics.dashboard(),
      analytics.products(),
      analytics.customers(10),
      analytics.sales(),
    ]).then(([d, p, c, s]) => {
      setStats(d.data.data);
      setProducts(p.data.data);
      setCustomers(c.data.data);
      setSales(s.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Products', value: stats.stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Inventory', value: stats.stats.inventory, icon: Warehouse, color: 'bg-green-500' },
    { label: 'Orders', value: stats.stats.orders, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Inquiries', value: stats.stats.inquiries, icon: MessageSquare, color: 'bg-orange-500' },
    { label: 'Customers', value: stats.stats.customers, icon: Users, color: 'bg-red-500' },
    { label: 'Low Stock', value: stats.stats.lowStock, icon: AlertTriangle, color: 'bg-teal-500' },
    { label: 'Revenue', value: `₹${(stats.stats.revenue / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-amber-500' },
  ] : [];

  const maxSale = sales.length > 0 ? Math.max(...sales.map(s => s.sales)) : 1;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[...Array(7)].map((_, i) => <Card key={i} className="h-24 animate-pulse" />)}
        </div>
        <Card className="h-64 animate-pulse mb-8" />
        <Card className="h-48 animate-pulse mb-8" />
        <Card className="h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {statCards.map((card) => (
          <Card key={card.label} className="p-4">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Order #</th>
                  <th className="pb-2 font-medium">Buyer</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                  <th className="pb-2 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2.5 text-gray-900 font-medium">{order.orderNumber}</td>
                    <td className="py-2.5 text-gray-600">{order.buyer?.name || '-'}</td>
                    <td className="py-2.5"><Badge variant={order.status === 'DELIVERED' ? 'success' : order.status === 'SHIPPED' ? 'warning' : 'default'}>{order.status}</Badge></td>
                    <td className="py-2.5 text-right text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h2>
          <div className="flex items-end gap-2 h-48">
            {sales.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(m.sales / maxSale) * 100}%`, minHeight: m.sales > 0 ? '4px' : '0' }} />
                <span className="text-xs text-gray-500">{monthNames[Number(m.month) - 1] || m.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Analytics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Inquiries</th>
                <th className="pb-2 font-medium text-right">Orders</th>
                <th className="pb-2 font-medium text-right">Reviews</th>
                <th className="pb-2 font-medium text-right">Avg Rating</th>
                <th className="pb-2 font-medium text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2.5 text-gray-900 font-medium">{p.title}</td>
                  <td className="py-2.5 text-right text-gray-600">{p.totalInquiries}</td>
                  <td className="py-2.5 text-right text-gray-600">{p.totalOrders}</td>
                  <td className="py-2.5 text-right text-gray-600">{p.totalReviews}</td>
                  <td className="py-2.5 text-right text-gray-600">{p.avgRating.toFixed(1)}</td>
                  <td className="py-2.5 text-right text-gray-600">{p.totalStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium text-right">Orders</th>
                <th className="pb-2 font-medium text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2.5 text-gray-900 font-medium">{c.name}</td>
                  <td className="py-2.5 text-gray-500">{c.email}</td>
                  <td className="py-2.5 text-right text-gray-600">{c.orders}</td>
                  <td className="py-2.5 text-right text-gray-900">₹{c.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
