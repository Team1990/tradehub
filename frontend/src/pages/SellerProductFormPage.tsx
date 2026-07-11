import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products as productsApi, categories as categoriesApi } from '../api/endpoints';
import type { Category } from '../types';
import { Card, Button, Input } from '../components/ui';
import { ArrowLeft, Upload } from 'lucide-react';

export function SellerProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', price: '', moqPrice: '',
    minOrderQty: '1', unit: 'Piece', categoryId: '', tags: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesApi.list().then(r => setCats(r.data.data)).catch(() => {});
    if (isEdit) {
      productsApi.get(id!).then(r => {
        const p = r.data.data;
        setForm({
          title: p.title, description: p.description || '', price: String(p.price),
          moqPrice: p.moqPrice ? String(p.moqPrice) : '',
          minOrderQty: String(p.minOrderQty), unit: p.unit,
          categoryId: p.categoryId, tags: p.tags.join(', '),
        });
      }).catch(() => navigate('/seller'));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('minOrderQty', form.minOrderQty);
      fd.append('unit', form.unit);
      fd.append('categoryId', form.categoryId);
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (form.moqPrice) fd.append('moqPrice', form.moqPrice);
      if (files) for (const f of Array.from(files)) fd.append('images', f);

      if (isEdit) {
        await productsApi.update(id!, fd);
      } else {
        await productsApi.create(fd);
      }
      navigate('/seller');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/seller')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <Card className="p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Product Title *" required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Industrial Grade Steel Bolts M12" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Product description, specifications, etc." />
            </div>
            <Input label="Price (per unit) *" type="number" required min={0} step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 15.50" />
            <Input label="MOQ Price (optional)" type="number" min={0} step="0.01" value={form.moqPrice} onChange={(e) => setForm(f => ({ ...f, moqPrice: e.target.value }))} placeholder="Price for bulk orders" />
            <Input label="Min Order Quantity *" type="number" required min={1} value={form.minOrderQty} onChange={(e) => setForm(f => ({ ...f, minOrderQty: e.target.value }))} />
            <Input label="Unit *" required value={form.unit} onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="Piece, Kg, Meter, etc." />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Select category</option>
                {cats.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. industrial, steel, hardware" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="w-full sm:w-auto">{isEdit ? 'Update Product' : 'Create Product'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/seller')} className="w-full sm:w-auto">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
