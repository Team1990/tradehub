import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { warehouses as warehousesApi } from '../api/endpoints';
import type { Warehouse } from '../types';
import { Card, Button, Input } from '../components/ui';
import { Plus, Building2, MapPin, Package, X } from 'lucide-react';

export default function SellerWarehousesPage() {
  const [list, setList] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', pincode: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    warehousesApi.list().then(r => setList(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await warehousesApi.create(form);
      setShowModal(false);
      setForm({ name: '', address: '', city: '', state: '', pincode: '', contact: '' });
      load();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to create warehouse');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Warehouse</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i} className="h-48 animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No warehouses</h2>
          <p className="text-sm text-gray-500 mb-6">Add your first warehouse to manage inventory</p>
          <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Warehouse</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((w) => (
            <Link key={w.id} to={`/seller/warehouses/${w.id}`}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <Building2 className="w-10 h-10 text-brand-600 bg-brand-50 rounded-lg p-2" />
                  {!w.isActive && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Inactive</span>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{w.name}</h3>
                {w.address && <p className="text-sm text-gray-500 mb-1">{w.address}</p>}
                {w.city && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {w.city}{w.state ? `, ${w.state}` : ''}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {w._count?.locations ?? 0} locations</span>
                  <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {w._count?.inventory ?? 0} items</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Warehouse</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Warehouse Name *" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Main Warehouse" />
              <Input label="Address" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
                <Input label="State" value={form.state} onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))} placeholder="State" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Pincode" value={form.pincode} onChange={(e) => setForm(f => ({ ...f, pincode: e.target.value }))} placeholder="Pincode" />
                <Input label="Contact" value={form.contact} onChange={(e) => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="Phone number" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={submitting} className="flex-1">Create Warehouse</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
