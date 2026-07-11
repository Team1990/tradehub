import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { warehouses as warehousesApi, inventory as inventoryApi } from '../api/endpoints';
import type { Warehouse, InventoryItem } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { ArrowLeft, Building2, MapPin, Package, Barcode } from 'lucide-react';

export default function SellerWarehouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      warehousesApi.get(id),
      inventoryApi.byWarehouse(id),
    ])
      .then(([w, inv]) => {
        setWarehouse(w.data.data);
        setInventory(inv.data.data);
      })
      .catch(() => navigate('/seller/warehouses'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
      <Card className="h-48 animate-pulse" />
      <Card className="h-64 animate-pulse" />
    </div>
  );

  if (!warehouse) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/seller/warehouses')} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Warehouses
      </button>

      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <Building2 className="w-12 h-12 text-brand-600 bg-brand-50 rounded-lg p-2 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{warehouse.name}</h1>
              <Badge variant={warehouse.isActive ? 'success' : 'danger'}>{warehouse.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
            {warehouse.address && <p className="text-sm text-gray-500">{warehouse.address}</p>}
            {warehouse.city && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {warehouse.city}{warehouse.state ? `, ${warehouse.state}` : ''} {warehouse.pincode ? `- ${warehouse.pincode}` : ''}
              </p>
            )}
            {warehouse.contact && <p className="text-sm text-gray-500 mt-1">Contact: {warehouse.contact}</p>}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Barcode className="w-5 h-5 text-gray-400" /> Locations
          </h2>
          {warehouse.locations && warehouse.locations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-medium">Rack</th>
                    <th className="pb-2 font-medium">Shelf</th>
                    <th className="pb-2 font-medium">Bin</th>
                    <th className="pb-2 font-medium">Barcode</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouse.locations.map((loc) => (
                    <tr key={loc.id} className="border-b border-gray-50">
                      <td className="py-2 text-gray-900">{loc.rack || '-'}</td>
                      <td className="py-2 text-gray-600">{loc.shelf || '-'}</td>
                      <td className="py-2 text-gray-600">{loc.bin || '-'}</td>
                      <td className="py-2 text-gray-600 font-mono text-xs">{loc.barcode || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Barcode className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No locations defined</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" /> Inventory at this Warehouse
          </h2>
          {inventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium text-right">Available</th>
                    <th className="pb-2 font-medium text-right">Reserved</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const isLow = item.availableQty <= (item.minStock ?? 0);
                    return (
                      <tr key={item.id} className={isLow ? 'bg-red-50' : ''}>
                        <td className="py-2 pr-4">
                          <p className="font-medium text-gray-900">{item.product?.title || item.productId}</p>
                        </td>
                        <td className={`py-2 pr-4 text-right font-medium ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{item.availableQty}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{item.reservedQty}</td>
                        <td className="py-2">
                          {isLow ? <Badge variant="danger">Low</Badge> : <Badge variant="success">OK</Badge>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No inventory at this warehouse</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
