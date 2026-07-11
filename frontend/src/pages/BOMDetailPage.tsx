import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { manufacturing } from '../api/endpoints';
import type { BOM } from '../types';
import { Card, Button, Input } from '../components/ui';
import { ArrowLeft, Package, Layers, Cpu } from 'lucide-react';

export function BOMDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bom, setBom] = useState<BOM | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [warehouseId, setWarehouseId] = useState('');
  const [assembling, setAssembling] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    manufacturing.get(id)
      .then(r => setBom(r.data.data))
      .catch(() => navigate('/seller/manufacturing'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAssemble = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssembling(true);
    setResult(null);
    try {
      const res = await manufacturing.assemble({ bomId: id!, quantity, warehouseId });
      setResult(`Assembly complete! Output: ${res.data.data.outputQty} units`);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Assembly failed');
    } finally {
      setAssembling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!bom) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/seller/manufacturing')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Manufacturing
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-brand-600" />
              <h1 className="text-xl font-bold text-gray-900">{bom.name}</h1>
            </div>
            {bom.description && <p className="text-sm text-gray-600 mb-4">{bom.description}</p>}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Output Product</span>
                <p className="font-medium text-gray-900">{bom.product?.title || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-gray-500">Output Quantity</span>
                <p className="font-medium text-gray-900">x{bom.outputQty}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Components ({bom.items?.length || 0})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Component</th>
                    <th className="px-6 py-3 text-right">Quantity</th>
                    <th className="px-6 py-3 text-right">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {bom.items?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-3 text-gray-900">{item.componentProduct?.title || item.componentId}</td>
                      <td className="px-6 py-3 text-right text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-3 text-right text-gray-500">{item.componentProduct?.unit || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4" /> Run Assembly
            </h2>
            <form onSubmit={handleAssemble} className="space-y-4">
              <Input label="Quantity *" type="number" min={1} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              <Input label="Warehouse ID *" required value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} placeholder="Enter warehouse ID" />
              <Button type="submit" loading={assembling} className="w-full">Run Assembly</Button>
            </form>
            {result && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                {result}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
