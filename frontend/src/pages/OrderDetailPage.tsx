import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders as ordersApi } from '../api/endpoints';
import type { Order } from '../types';
import { Card, Badge } from '../components/ui';
import { ArrowLeft, Package, FileText } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersApi.get(id)
      .then(r => setOrder(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-96 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center py-20 text-gray-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500">Subtotal</p>
            <p className="text-lg font-semibold text-gray-900">₹{order.subtotal?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tax</p>
            <p className="text-lg font-semibold text-gray-900">₹{order.taxAmount?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold text-brand-600">₹{order.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium text-gray-500">Product</th>
                <th className="text-right py-3 font-medium text-gray-500">Qty</th>
                <th className="text-right py-3 font-medium text-gray-500">Unit Price</th>
                <th className="text-right py-3 font-medium text-gray-500">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.product?.title || 'Product'}</td>
                  <td className="py-3 text-right text-gray-700">{item.qty}</td>
                  <td className="py-3 text-right text-gray-700">₹{item.unitPrice.toLocaleString()}</td>
                  <td className="py-3 text-right font-medium text-gray-900">₹{item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {order.buyer && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> <span className="text-gray-900">{order.buyer.name}</span></p>
            {order.buyer.email && <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{order.buyer.email}</span></p>}
          </div>
        </Card>
      )}

      {order.invoices && order.invoices.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h2>
          <div className="space-y-3">
            {order.invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">₹{inv.amount.toLocaleString()} · Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  inv.status === 'PAID' ? 'bg-green-100 text-green-800' : inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
