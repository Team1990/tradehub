import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import { Button, Input, Card } from '../components/ui';
import { Building2 } from 'lucide-react';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await auth.login(form);
      setAuth(res.data.data.user, res.data.data.token);
      navigate(res.data.data.user.role === 'SELLER' ? '/seller' : '/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid credentials');
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@company.com" />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter password" />

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">Sign In</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">Create one</Link>
        </p>
      </Card>
    </div>
  );
}
