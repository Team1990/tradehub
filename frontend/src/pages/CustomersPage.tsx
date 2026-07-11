import { useEffect, useState } from 'react';
import { customers as customersApi } from '../api/endpoints';
import type { Customer } from '../types';
import { Card, Button, Input } from '../components/ui';
import { Plus, X, Users } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', companyName: '', city: '', state: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadCustomers = () => {
    setLoading(true);
    customersApi.list()
      .then(r => setCustomers(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      await customersApi.create(form);
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', companyName: '', city: '', state: '' });
      loadCustomers();
    } catch {}
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Customer</Button>
      </div>

      {loading ? (
        <Card className="h-64 animate-pulse" />
      ) : customers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h2>
          <p className="text-sm text-gray-500 mb-6">Customers who place orders will appear here</p>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Customer</Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">City</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Orders</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{c.name}</td>
                    <td className="py-3 px-4 text-gray-600">{c.email || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{c.phone || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{c.companyName || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{c.city || '-'}</td>
                    <td className="py-3 px-4 text-right text-gray-600">-</td>
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
              <h2 className="text-lg font-semibold text-gray-900">Add Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              <Input label="Company Name" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                <Input label="State" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" loading={submitting}>Add Customer</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
