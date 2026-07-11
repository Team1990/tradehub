import { useEffect, useState } from 'react';
import { auth as authApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import type { Company } from '../types';
import { Card, Button, Input } from '../components/ui';
import { Building2, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [companyForm, setCompanyForm] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'SELLER') {
      authApi.getCompany().then(r => {
        setCompany(r.data.data);
        setCompanyForm(r.data.data || {});
      }).catch(() => {});
    }
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      await authApi.updateProfile(form);
      updateUser(form);
      setEditing(false);
    } catch {} finally { setLoading(false); }
  };

  const updateCompany = async () => {
    setLoading(true);
    try {
      const res = await authApi.updateCompany(companyForm);
      setCompany(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center">
          <User className="w-7 h-7 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email} · {user?.role}</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
          {!editing && <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>}
        </div>
        {editing ? (
          <div className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            <div className="flex gap-2">
              <Button onClick={updateProfile} loading={loading} size="sm">Save</Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {user?.name}</p>
            <p><span className="text-gray-500">Email:</span> {user?.email}</p>
            <p><span className="text-gray-500">Phone:</span> {user?.phone || '—'}</p>
            <p><span className="text-gray-500">Role:</span> {user?.role}</p>
          </div>
        )}
      </Card>

      {user?.role === 'SELLER' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-5 h-5" /> Company Profile</h2>
          </div>
          {company ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Company Name" value={companyForm.name || ''} onChange={(e) => setCompanyForm(f => ({ ...f, name: e.target.value }))} />
                <Input label="Website" value={companyForm.website || ''} onChange={(e) => setCompanyForm(f => ({ ...f, website: e.target.value }))} />
                <Input label="Phone" value={companyForm.phone || ''} onChange={(e) => setCompanyForm(f => ({ ...f, phone: e.target.value }))} />
                <Input label="City" value={companyForm.city || ''} onChange={(e) => setCompanyForm(f => ({ ...f, city: e.target.value }))} />
                <Input label="State" value={companyForm.state || ''} onChange={(e) => setCompanyForm(f => ({ ...f, state: e.target.value }))} />
                <Input label="GSTIN" value={companyForm.gstin || ''} onChange={(e) => setCompanyForm(f => ({ ...f, gstin: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={companyForm.description || ''} onChange={(e) => setCompanyForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <Button onClick={updateCompany} loading={loading}>Save Company</Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">Create your company profile to start selling</p>
              <Button onClick={async () => { try { const res = await authApi.updateCompany({ name: user?.name + "'s Company" }); setCompany(res.data.data); setCompanyForm(res.data.data); } catch {} }}>Create Company Profile</Button>
            </div>
          )}
        </Card>
      )}

      <div className="flex gap-4">
        {user?.role === 'BUYER' && <Link to="/inquiries"><Button variant="outline"><Package className="w-4 h-4 mr-2" /> My Inquiries</Button></Link>}
        {user?.role === 'SELLER' && <Link to="/seller"><Button variant="outline"><Building2 className="w-4 h-4 mr-2" /> Seller Dashboard</Button></Link>}
      </div>
    </div>
  );
}
