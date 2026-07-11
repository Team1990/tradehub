import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import { Button, Input, Card } from '../components/ui';
import { Building2 } from 'lucide-react';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: searchParams.get('role') === 'seller' ? 'SELLER' : 'BUYER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await auth.register(form);
      setAuth(res.data.data.user, res.data.data.token);
      navigate(form.role === 'SELLER' ? '/seller' : '/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Building2 className="w-8 h-8 text-brand-600" />
            <span className="text-xl font-bold">TradeHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join India's leading B2B marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, role: 'BUYER' }))}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${form.role === 'BUYER' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}
            >I'm a Buyer</button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, role: 'SELLER' }))}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${form.role === 'SELLER' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}
            >I'm a Seller</button>
          </div>

          <Input label="Full Name" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@company.com" />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" minLength={8} />

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
