import { useEffect, useState } from 'react';
import { ai } from '../api/endpoints';
import type { DemandForecast, PriceSuggestion } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { TrendingUp, Tag, Sparkles } from 'lucide-react';

export function AIPage() {
  const [forecast, setForecast] = useState<DemandForecast[]>([]);
  const [suggestions, setSuggestions] = useState<PriceSuggestion[]>([]);
  const [description, setDescription] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [categorizing, setCategorizing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ai.demandForecast(),
      ai.priceSuggestions(),
    ]).then(([f, p]) => {
      setForecast(f.data.data);
      setSuggestions(p.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCategorize = async () => {
    if (!description.trim()) return;
    setCategorizing(true);
    try {
      const res = await ai.autoCategorize(description);
      setSuggestedCategory(res.data.data.suggestedCategory);
    } catch {}
    setCategorizing(false);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">AI Assistant</h1>
        <Card className="h-64 animate-pulse mb-8" />
        <Card className="h-64 animate-pulse mb-8" />
        <Card className="h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">AI Assistant</h1>

      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Demand Forecast</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Current Stock</th>
                <th className="pb-2 font-medium text-right">Total Orders</th>
                <th className="pb-2 font-medium">Restock</th>
                <th className="pb-2 font-medium text-right">Suggested Reorder</th>
                <th className="pb-2 font-medium text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((f) => (
                <tr key={f.productId} className="border-b last:border-0">
                  <td className="py-2.5 text-gray-900 font-medium">{f.title}</td>
                  <td className="py-2.5 text-right text-gray-600">{f.currentStock}</td>
                  <td className="py-2.5 text-right text-gray-600">{f.totalOrders}</td>
                  <td className="py-2.5">
                    <Badge variant={f.needsRestock ? 'danger' : 'success'}>{f.needsRestock ? 'Yes' : 'No'}</Badge>
                  </td>
                  <td className="py-2.5 text-right text-gray-600">{f.suggestedReorderQty}</td>
                  <td className="py-2.5 text-right">{(f.confidence * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Price Suggestions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Current Price</th>
                <th className="pb-2 font-medium text-right">Suggested Price</th>
                <th className="pb-2 font-medium text-right">Market Avg</th>
                <th className="pb-2 font-medium text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s) => (
                <tr key={s.productId} className="border-b last:border-0">
                  <td className="py-2.5 text-gray-900 font-medium">{s.title}</td>
                  <td className="py-2.5 text-right text-gray-600">₹{s.currentPrice.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-gray-900 font-medium">₹{s.suggestedPrice.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-gray-500">{s.marketAvgPrice ? `₹${s.marketAvgPrice.toLocaleString()}` : '-'}</td>
                  <td className={`py-2.5 text-right font-medium ${s.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Auto-Categorize</h2>
        </div>
        <textarea
          className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
          rows={4}
          placeholder="Describe your product to get a category suggestion..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button className="mt-3" onClick={handleCategorize} disabled={categorizing || !description.trim()}>
          {categorizing ? 'Analyzing...' : 'Suggest Category'}
        </Button>
        {suggestedCategory && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Suggested Category</p>
            <p className="text-sm text-gray-900 mt-1">{suggestedCategory}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
