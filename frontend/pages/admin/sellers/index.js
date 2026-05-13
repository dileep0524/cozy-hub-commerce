import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { getSellers, createSeller } from '@/services/adminProducts';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', phone: '', business_name: '', gstin: '' });
  const limit = 15;

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSellers({ page, limit, search });
      setSellers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createSeller(newSeller);
      toast.success('Seller account created');
      setShowModal(false);
      setNewSeller({ name: '', email: '', password: '', phone: '', business_name: '', gstin: '' });
      fetchSellers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create seller');
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout title="Sellers">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create Seller Account</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required placeholder="Full Name" value={newSeller.name} onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })} className="input-field" />
              <input required type="email" placeholder="Email" value={newSeller.email} onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })} className="input-field" />
              <input required type="password" placeholder="Password (min 8 chars)" minLength={8} value={newSeller.password} onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })} className="input-field" />
              <input placeholder="Phone" value={newSeller.phone} onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })} className="input-field" />
              <input placeholder="Business Name" value={newSeller.business_name} onChange={(e) => setNewSeller({ ...newSeller, business_name: e.target.value })} className="input-field" />
              <input placeholder="GSTIN (optional)" value={newSeller.gstin} onChange={(e) => setNewSeller({ ...newSeller, gstin: e.target.value })} className="input-field" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {creating && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search sellers…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9" />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <PlusIcon className="w-4 h-4" /> Create Seller
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Seller', 'Business', 'Phone', 'GSTIN', 'Status', 'Wallet', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
              )) : sellers.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No sellers yet. Create one above.</td></tr>
              ) : sellers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                        {s.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.business_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.gstin || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.status === 'active' ? 'bg-green-100 text-green-700' :
                      s.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ₹{s.wallet?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/sellers/${s.id}`} className="text-sm text-brand-600 hover:underline">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">{total} sellers</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40">Prev</button>
              <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
