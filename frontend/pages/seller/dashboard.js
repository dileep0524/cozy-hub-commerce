import { useEffect, useState } from 'react';
import SellerLayout from '@/components/seller/SellerLayout';
import {
  ShoppingCartIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { getSellerOrders } from '@/services/sellerService';
import { getWallet } from '@/services/sellerService';
import useSellerStore from '@/store/sellerStore';
import Link from 'next/link';

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

function StatCard({ label, value, icon: Icon, color, loading }) {
  return (
    <div className="card">
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-24" />
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SellerDashboard() {
  const { setWallet } = useSellerStore();
  const [orders, setOrders] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, walletRes] = await Promise.all([
          getSellerOrders({ limit: 10 }),
          getWallet(),
        ]);
        const allOrders = ordersRes.data.data || [];
        setOrders(allOrders.slice(0, 5));
        setWalletData(walletRes.data);
        setWallet(walletRes.data);

        // Compute stats
        const counts = allOrders.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          acc.total = (acc.total || 0) + 1;
          return acc;
        }, {});
        setStats(counts);
      } catch {
        // handled gracefully — show zeros
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setWallet]);

  const statCards = [
    { label: 'Total Orders', value: stats.total || 0, icon: ShoppingCartIcon, color: 'bg-brand-100 text-brand-600' },
    { label: 'Pending', value: stats.pending || 0, icon: ClockIcon, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Shipped', value: stats.shipped || 0, icon: TruckIcon, color: 'bg-cyan-100 text-cyan-600' },
    { label: 'Delivered', value: stats.delivered || 0, icon: CheckCircleIcon, color: 'bg-green-100 text-green-600' },
    { label: 'Cancelled', value: stats.cancelled || 0, icon: XCircleIcon, color: 'bg-red-100 text-red-600' },
    {
      label: 'Wallet Balance',
      value: `₹${walletData?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`,
      icon: WalletIcon,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <SellerLayout title="Dashboard">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/seller/orders" className="text-sm text-brand-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCartIcon className="w-10 h-10 mx-auto mb-2" />
            <p>No orders yet.</p>
            <Link href="/seller/orders/place" className="btn-primary mt-4 inline-block text-sm">
              Place your first order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Marketplace ID</th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">
                      <Link href={`/seller/orders/${order.id}`} className="text-brand-600 hover:underline">
                        {order.marketplace_order_id}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600">{order.items?.[0]?.product_name || '—'}</td>
                    <td className="py-3 text-gray-900 font-medium">
                      ₹{order.total_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
