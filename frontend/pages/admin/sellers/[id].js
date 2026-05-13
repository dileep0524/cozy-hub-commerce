import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { getSeller, updateSellerStatus, getAdminOrders } from '@/services/adminProducts';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const STATUS_OPTIONS = ['active', 'suspended', 'pending'];
const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function SellerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [seller, setSeller] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [sellerRes, ordersRes] = await Promise.all([
        getSeller(id),
        getAdminOrders({ limit: 10 }),
      ]);
      setSeller(sellerRes.data);
      // Filter to this seller's orders
      const allOrders = ordersRes.data.data || [];
      setOrders(allOrders.filter((o) => o.seller_id === id || o.seller?.id === id));
    } catch {
      toast.error('Seller not found');
      router.push('/admin/sellers');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (newStatus) => {
    if (!confirm(`Change seller status to "${newStatus}"?`)) return;
    setUpdatingStatus(true);
    try {
      await updateSellerStatus(id, newStatus);
      toast.success('Status updated');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return (
    <AdminLayout title="Seller Details">
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
    </AdminLayout>
  );

  if (!seller) return null;

  return (
    <AdminLayout title="Seller Details">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/sellers" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="w-4 h-4" /> Back to sellers
        </Link>

        {/* Seller profile card */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xl">
                {seller.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{seller.name}</h2>
                <p className="text-gray-500 text-sm">{seller.email}</p>
                {seller.business_name && <p className="text-sm text-gray-400 mt-0.5">{seller.business_name}</p>}
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
              seller.status === 'active' ? 'bg-green-100 text-green-700' :
              seller.status === 'suspended' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{seller.status}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-sm">
            <div><p className="text-gray-500">Phone</p><p className="font-medium mt-0.5">{seller.phone || '—'}</p></div>
            <div><p className="text-gray-500">GSTIN</p><p className="font-mono text-xs mt-0.5">{seller.gstin || '—'}</p></div>
            <div><p className="text-gray-500">Wallet Balance</p><p className="font-bold text-gray-900 mt-0.5">₹{seller.wallet?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</p></div>
            <div><p className="text-gray-500">Joined</p><p className="font-medium mt-0.5">{new Date(seller.created_at).toLocaleDateString('en-IN')}</p></div>
          </div>
        </div>

        {/* Status management */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={updatingStatus || seller.status === s}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${
                  seller.status === s
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.marketplace_order_id}</p>
                    <p className="text-xs text-gray-400">{order.items?.[0]?.product_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{order.total_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
