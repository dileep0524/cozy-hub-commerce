import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SellerLayout from '@/components/seller/SellerLayout';
import { getSellerOrder, cancelOrder } from '@/services/sellerService';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  packed: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  returned: 'bg-orange-100 text-orange-700 border-orange-200',
  refunded: 'bg-gray-100 text-gray-700 border-gray-200',
};

const STATUS_TIMELINE = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await getSellerOrder(id);
        setOrder(res.data);
      } catch {
        toast.error('Order not found');
        router.push('/seller/orders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, router]);

  const handleCancel = async () => {
    if (!confirm('Cancel this order? The wallet amount will be refunded.')) return;
    try {
      await cancelOrder(id);
      toast.success('Order cancelled — wallet refunded');
      const res = await getSellerOrder(id);
      setOrder(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot cancel order');
    }
  };

  if (loading) return (
    <SellerLayout title="Order Details">
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
    </SellerLayout>
  );

  if (!order) return null;

  const timelineStep = STATUS_TIMELINE.indexOf(order.status);

  return (
    <SellerLayout title="Order Details">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/seller/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
              <ArrowLeftIcon className="w-4 h-4" /> Back to orders
            </Link>
            <h2 className="text-xl font-bold text-gray-900">{order.marketplace_order_id}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Placed {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.status === 'pending' && (
              <button onClick={handleCancel} className="btn-secondary text-red-500 border-red-200 hover:bg-red-50">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Status timeline */}
        {!['cancelled', 'returned', 'refunded'].includes(order.status) && (
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Progress</h3>
            <div className="flex items-center gap-0">
              {STATUS_TIMELINE.map((step, i) => {
                const done = i <= timelineStep;
                const active = i === timelineStep;
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        done
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'border-gray-200 text-gray-300'
                      } ${active ? 'ring-2 ring-brand-300' : ''}`}>
                        {i + 1}
                      </div>
                      <p className={`text-xs mt-1 text-center ${done ? 'text-brand-600 font-medium' : 'text-gray-400'}`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </p>
                    </div>
                    {i < STATUS_TIMELINE.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < timelineStep ? 'bg-brand-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-sm text-gray-500">SKU: {item.sku} · Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{item.total_price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-400">₹{item.unit_price} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>₹{order.shipping_charge?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span>Total Charged</span>
              <span>₹{order.total_amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Order info */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Ship By Date</p>
              <p className="font-medium text-gray-900 flex items-center gap-1 mt-1">
                <ClockIcon className="w-4 h-4 text-orange-500" />
                {order.ship_by_date ? new Date(order.ship_by_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Wallet Deducted</p>
              <p className="font-medium text-gray-900 mt-1">₹{order.wallet_deducted?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            {order.notes && (
              <div className="col-span-2">
                <p className="text-gray-500">Notes</p>
                <p className="font-medium text-gray-900 mt-1">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
