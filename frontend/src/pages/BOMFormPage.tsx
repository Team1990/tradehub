import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { manufacturing } from '../api/endpoints';
import { Card, Button, Input } from '../components/ui';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface ComponentRow {
  componentId: string;
  quantity: number;
}

export function BOMFormPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [description, setDescription] = useState('');
  const [outputQty, setOutputQty] = useState(1);
  const [components, setComponents] = useState<ComponentRow[]>([{ componentId: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  const addComponent = () => {
    setComponents(prev => [...prev, { componentId: '', quantity: 1 }]);
  };

  const removeComponent = (index: number) => {
    setComponents(prev => prev.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: keyof ComponentRow, value: string) => {
    setComponents(prev => prev.map((c, i) =>
      i === index ? { ...c, [field]: field === 'quantity' ? Number(value) : value } : c
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await manufacturing.create({
        name, productId, description: description || undefined,
        outputQty: Number(outputQty),
        items: components.filter(c => c.componentId.trim()),
      });
      navigate('/seller/manufacturing');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to create BOM');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/seller/manufacturing')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Manufacturing
      </button>

      <Card className="p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Create Bill of Materials</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="BOM Name *" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Assembly A - Main Board" />
            </div>
            <Input label="Product ID *" required value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="ID of the finished product" />
            <Input label="Output Quantity" type="number" min={1} value={outputQty} onChange={(e) => setOutputQty(Number(e.target.value))} />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Optional description" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Components</h2>
              <Button type="button" variant="outline" size="sm" onClick={addComponent}><Plus className="w-3.5 h-3.5 mr-1" /> Add Component</Button>
            </div>
            <div className="space-y-3">
              {components.map((comp, idx) => (
                <div key={idx} className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label={idx === 0 ? 'Component ID *' : undefined}
                      placeholder="Component product ID"
                      value={comp.componentId}
                      onChange={(e) => updateComponent(idx, 'componentId', e.target.value)}
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      label={idx === 0 ? 'Qty *' : undefined}
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={comp.quantity}
                      onChange={(e) => updateComponent(idx, 'quantity', e.target.value)}
                    />
                  </div>
                  {components.length > 1 && (
                    <button type="button" onClick={() => removeComponent(idx)} className="pb-2 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="w-full sm:w-auto">Create BOM</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/seller/manufacturing')} className="w-full sm:w-auto">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
