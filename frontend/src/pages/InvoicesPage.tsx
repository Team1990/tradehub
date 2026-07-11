import { useEffect, useState } from 'react';
import { invoices as invoicesApi } from '../api/endpoints';
import type { Invoice } from '../types';
import { Card, Button, Input } from '../components/ui';
import { Plus, X, FileText } from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  SENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ orderId: '', dueDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadInvoices = () => {
    setLoading(true);
    invoicesApi.list()
      .then(r => setInvoices(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadInvoices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orderId.trim()) return;
    setSubmitting(true);
    try {
      await invoicesApi.create({
        orderId: form.orderId.trim(),
        dueDate: form.dueDate || undefined,
        notes: form.notes || undefined,
      });
      setShowModal(false);
      setForm({ orderId: '', dueDate: '', notes: '' });
      loadInvoices();
    } catch {}
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Create Invoice</Button>
      </div>

      {loading ? (
        <Card className="h-64 animate-pulse" />
      ) : invoices.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h2>
          <p className="text-sm text-gray-500 mb-6">Invoices will appear here once created</p>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Create Invoice</Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Order #</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{inv.order?.orderNumber || inv.orderId}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">₹{inv.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[inv.status] || 'bg-gray-100 text-gray-800'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create Invoice</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Order ID *" value={form.orderId} onChange={e => setForm(p => ({ ...p, orderId: e.target.value }))} required placeholder="Enter order ID" />
              <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-gray-400"
                  placeholder="Optional notes..."
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" loading={submitting}>Create Invoice</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
