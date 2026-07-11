import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { messages as messagesApi, inquiries as inquiriesApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import type { Message, Inquiry } from '../types';
import { Card, Button } from '../components/ui';
import { Send, ArrowLeft, Package } from 'lucide-react';

export function MessagesPage() {
  const { inquiryId } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () => {
    if (!inquiryId) return;
    Promise.all([
      messagesApi.list(inquiryId),
      inquiriesApi.my(),
      inquiriesApi.received(),
    ]).then(([m, s, r]) => {
      setMessages(m.data.data);
      const all = [...s.data.data, ...r.data.data];
      const found = all.find(i => i.id === inquiryId);
      if (found) setInquiry(found);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [inquiryId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!content.trim() || !inquiryId) return;
    try {
      const res = await messagesApi.send(inquiryId, content.trim());
      setMessages(prev => [...prev, res.data.data]);
      setContent('');
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/inquiries" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Inquiries
      </Link>

      <Card className="overflow-hidden">
        {inquiry && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{inquiry.product?.title}</p>
                <p className="text-xs text-gray-500">Qty: {inquiry.quantity}</p>
              </div>
            </div>
          </div>
        )}

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg w-2/3" />)}</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No messages yet. Start the conversation.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.senderId === user?.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-brand-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button onClick={send} disabled={!content.trim()}><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
