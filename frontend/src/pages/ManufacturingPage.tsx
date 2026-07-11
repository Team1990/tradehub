import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { manufacturing } from '../api/endpoints';
import type { BOM } from '../types';
import { Card, Button } from '../components/ui';
import { Plus, Package, Layers, ArrowRight } from 'lucide-react';

export function ManufacturingPage() {
  const navigate = useNavigate();
  const [boms, setBoms] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    manufacturing.list()
      .then(r => setBoms(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manufacturing</h1>
          <p className="text-sm text-gray-500">{boms.length} Bill of Materials</p>
        </div>
        <Link to="/seller/manufacturing/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Create BOM</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i} className="h-48 animate-pulse" />)}
        </div>
      ) : boms.length === 0 ? (
        <Card className="p-12 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No BOMs yet</h2>
          <p className="text-sm text-gray-500 mb-6">Create your first Bill of Materials to start manufacturing</p>
          <Link to="/seller/manufacturing/new"><Button><Plus className="w-4 h-4 mr-2" /> Create BOM</Button></Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boms.map((bom) => (
            <Card key={bom.id} className="p-0 overflow-hidden">
              <div className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/seller/manufacturing/${bom.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand-600" />
                    <h3 className="font-medium text-gray-900">{bom.name}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                {bom.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{bom.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {bom.product?.title || 'Unknown product'}
                  </span>
                  <span>x{bom.outputQty}</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {bom.items?.length || 0} components
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
