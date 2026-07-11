import { useEffect, useState } from 'react';
import { inventory as inventoryApi } from '../api/endpoints';
import type { InventoryItem, StockTransaction } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { Package, AlertTriangle, ArrowUpDown, Plus, X, Search } from 'lucide-react';

type Tab = 'all' | 'low' | 'transactions';

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Stock' },
  { key: 'low', label: 'Low Stock' },
  { key: 'transactions', label: 'Transactions' },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SellerInventoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowItems, setLowItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: '', productId: '', warehouseId: '', qty: '', direction: 'IN', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTab = (tab: Tab) => {
    setLoading(true);
    if (tab === 'all') {
      inventoryApi.all().then(r => setItems(r.data.data)).catch(() => {}).finally(() => setLoading(false));
    } else if (tab === 'low') {
      inventoryApi.lowStock().then(r => setLowItems(r.data.data)).catch(() => {}).finally(() => setLoading(false));
    } else {
      inventoryApi.transactions().then(r => setTransactions(r.data.data)).catch(() => {}).finally(() => setLoading(false));
    }
  };

  useEffect(() => { fetchTab(activeTab); }, [activeTab]);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inventoryApi.recordTransaction({
        type: form.type, productId: form.productId, warehouseId: form.warehouseId,
        qty: Number(form.qty), direction: form.direction, notes: form.notes || undefined,
      });
      setShowModal(false);
      setForm({ type: '', productId: '', warehouseId: '', qty: '', direction: 'IN', notes: '' });
      fetchTab(activeTab);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to record transaction');
    } finally { setSubmitting(false); }
  };

  const renderTable = () => {
    if (loading) return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
      </div>
    );

    const list = activeTab === 'all' ? items : lowItems;

    if (list.length === 0) return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No inventory items found</p>
      </div>
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Warehouse</th>
              <th className="pb-3 font-medium text-right">Available</th>
              <th className="pb-3 font-medium text-right">Reserved</th>
              <th className="pb-3 font-medium text-right">Min Stock</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              const isLow = item.availableQty <= (item.minStock ?? 0);
              return (
                <tr key={item.id} className={isLow ? 'bg-red-50' : ''}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900">{item.product?.title || item.productId}</p>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{item.warehouse?.name || item.warehouseId}</td>
                  <td className={`py-3 pr-4 text-right font-medium ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{item.availableQty}</td>
                  <td className="py-3 pr-4 text-right text-gray-600">{item.reservedQty}</td>
                  <td className="py-3 pr-4 text-right text-gray-600">{item.minStock ?? '-'}</td>
                  <td className="py-3">
                    {isLow ? <Badge variant="danger">Low Stock</Badge> : <Badge variant="success">In Stock</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTransactions = () => {
    if (loading) return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
      </div>
    );

    if (transactions.length === 0) return (
      <div className="text-center py-12">
        <ArrowUpDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No transactions yet</p>
      </div>
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Warehouse</th>
              <th className="pb-3 font-medium text-right">Qty</th>
              <th className="pb-3 font-medium">Direction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                <td className="py-3 pr-4 capitalize">{tx.type}</td>
                <td className="py-3 pr-4 font-medium text-gray-900">{tx.product?.title || tx.productId}</td>
                <td className="py-3 pr-4 text-gray-600">{tx.warehouse?.name || tx.warehouseId}</td>
                <td className="py-3 pr-4 text-right font-medium">{tx.qty}</td>
                <td className="py-3">
                  <Badge variant={tx.direction === 'IN' ? 'success' : 'danger'}>{tx.direction}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Record Transaction</Button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.key === 'low' && lowItems.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">{lowItems.length}</span>
            )}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {activeTab === 'transactions' ? renderTransactions() : renderTable()}
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Record Transaction</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type *</label>
                <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Select type</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="SALE">Sale</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="RETURN">Return</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
                <input type="text" value={form.productId} onChange={(e) => setForm(f => ({ ...f, productId: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter product ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse ID *</label>
                <input type="text" value={form.warehouseId} onChange={(e) => setForm(f => ({ ...f, warehouseId: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter warehouse ID" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input type="number" min={1} value={form.qty} onChange={(e) => setForm(f => ({ ...f, qty: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Direction *</label>
                  <select value={form.direction} onChange={(e) => setForm(f => ({ ...f, direction: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="IN">IN (Receive)</option>
                    <option value="OUT">OUT (Issue)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Optional notes" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={submitting} className="flex-1">Record</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
