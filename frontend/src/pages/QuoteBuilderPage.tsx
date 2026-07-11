import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quotes, inquiries } from '../api/endpoints';
import type { Inquiry } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { ArrowLeft, Send } from 'lucide-react';

export function QuoteBuilderPage() {
  const { inquiryId } = useParams<{ inquiryId: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inquiryId) return;
    inquiries.received().then(r => {
      const found = r.data.data.find((i: Inquiry) => i.id === inquiryId);
      if (found) setInquiry(found);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [inquiryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || !inquiryId) return;
    setSubmitting(true);
    setError('');
    try {
      await quotes.create({
        inquiryId,
        price: Number(price),
        moq: moq ? Number(moq) : undefined,
        validUntil: validUntil || undefined,
        notes: notes || undefined,
      });
      navigate('/inquiries', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Failed to submit quote');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Quote</h1>

      {inquiry && (
        <Card className="p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Inquiry for</p>
          <p className="font-medium text-gray-900">{inquiry.product?.title || 'Unknown Product'}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Qty: {inquiry.quantity}</span>
            {inquiry.buyer && <span>From: {inquiry.buyer.name}</span>}
          </div>
          {inquiry.message && (
            <p className="mt-2 text-sm text-gray-500 italic bg-gray-50 p-2 rounded">"{inquiry.message}"</p>
          )}
          <div className="mt-2">
            <Badge variant={inquiry.status === 'OPEN' ? 'warning' : 'success'}>{inquiry.status}</Badge>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="0.00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MOQ</label>
            <input type="number" value={moq} onChange={e => setMoq(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Minimum order quantity" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Terms, delivery details, etc." />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            <Send className="w-4 h-4 mr-2" /> {submitting ? 'Submitting...' : 'Send Quote'}
          </Button>
        </Card>
      </form>
    </div>
  );
}
