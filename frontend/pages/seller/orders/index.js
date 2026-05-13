import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import SellerLayout from '@/components/seller/SellerLayout';
import { getSellerOrders, cancelOrder } from '@/services/sellerService';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-orange-100 text-orange-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const STATUSES = ['', 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const limit = 15;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSellerOrders({ page, limit, status, search });
      setOrders(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order? The wallet amount will be refunded.')) return;
    try {
      await cancelOrder(id);
      toast.success('Order cancelled — wallet refunded');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot cancel order');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <SellerLayout title="My Orders">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search marketplace order ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input-field w-full sm:w-44"
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <Link href="/seller/orders/place" className="btn-primary whitespace-nowrap">
          + Place Order
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Marketplace ID', 'Product', 'Qty', 'Amount', 'Ship By', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : orders.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                        <ShoppingCartIcon className="w-10 h-10 mx-auto mb-2" />
                        No orders found
                      </td>
                    </tr>
                  )
                : orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/seller/orders/${order.id}`} className="text-brand-600 hover:underline">
                          {order.marketplace_order_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                        {order.items?.[0]?.product_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.items?.[0]?.quantity || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        ₹{order.total_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {order.ship_by_date ? new Date(order.ship_by_date).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <XMarkIcon className="w-3 h-3" /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">{total} orders</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
