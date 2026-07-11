import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiries as inquiriesApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import type { Inquiry } from '../types';
import { Card, Badge, Button } from '../components/ui';
import { MessageSquare, Package } from 'lucide-react';

export function InquiriesPage() {
  const { user } = useAuthStore();
  const [sent, setSent] = useState<Inquiry[]>([]);
  const [received, setReceived] = useState<Inquiry[]>([]);
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      inquiriesApi.my(),
      inquiriesApi.received(),
    ]).then(([s, r]) => {
      setSent(s.data.data);
      setReceived(r.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const inquiries = tab === 'sent' ? sent : received;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab('sent')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'sent' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Sent ({sent.length})
        </button>
        <button onClick={() => setTab('received')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'received' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Received ({received.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Card key={i} className="h-24 animate-pulse" />)}</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No inquiries yet</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <Link key={inq.id} to={`/messages/${inq.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {inq.product?.images?.[0] ? (
                      <img src={inq.product.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{inq.product?.title}</p>
                      <Badge variant={inq.status === 'OPEN' ? 'warning' : inq.status === 'RESPONDED' ? 'success' : 'default'}>{inq.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {tab === 'sent' ? `To: ${inq.seller?.company?.name || inq.seller?.name}` : `From: ${inq.buyer?.name}`}
                      {' · '}Qty: {inq.quantity}
                    </p>
                    {inq.messages && inq.messages.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{inq.messages[0].content}</p>
                    )}
                  </div>
                  <MessageSquare className="w-5 h-5 text-gray-300 flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
