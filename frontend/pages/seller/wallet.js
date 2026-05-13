import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import SellerLayout from '@/components/seller/SellerLayout';
import { getWallet, getWalletTransactions, initiateTopup, verifyTopup } from '@/services/sellerService';
import useSellerStore from '@/store/sellerStore';
import toast from 'react-hot-toast';
import {
  WalletIcon,
  PlusCircleIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const TYPE_CONFIG = {
  credit:     { label: 'Top-up', color: 'text-green-600', bg: 'bg-green-50', icon: ArrowUpCircleIcon, sign: '+' },
  debit:      { label: 'Order Payment', color: 'text-red-600', bg: 'bg-red-50', icon: ArrowDownCircleIcon, sign: '-' },
  refund:     { label: 'Refund', color: 'text-blue-600', bg: 'bg-blue-50', icon: ArrowPathIcon, sign: '+' },
  reversal:   { label: 'Reversal', color: 'text-orange-600', bg: 'bg-orange-50', icon: ArrowPathIcon, sign: '+' },
  adjustment: { label: 'Adjustment', color: 'text-purple-600', bg: 'bg-purple-50', icon: ArrowPathIcon, sign: '±' },
};

function TopupModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopup = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { toast.error('Minimum top-up is ₹100'); return; }
    setLoading(true);
    try {
      const res = await initiateTopup(amt);
      const { razorpay_order_id, amount: amtPaise, currency, key_id } = res.data;

      // Test mode — no real Razorpay key
      if (key_id === 'rzp_test_placeholder') {
        await verifyTopup({
          razorpay_order_id,
          razorpay_payment_id: 'pay_test_' + Date.now(),
          razorpay_signature: 'test_sig',
          amount: amt,
        });
        toast.success(`₹${amt} added to wallet (test mode)`);
        onSuccess();
        onClose();
        return;
      }

      // Real Razorpay checkout
      const options = {
        key: key_id,
        amount: amtPaise,
        currency,
        name: 'CozyHub Commerce',
        description: 'Wallet Top-up',
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            await verifyTopup({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amt,
            });
            toast.success(`₹${amt} added to wallet`);
            onSuccess();
            onClose();
          } catch (err) {
            toast.error(err.response?.data?.error || 'Payment verification failed');
          }
        },
        theme: { color: '#0284C7' },
      };

      if (typeof window === 'undefined' || !window.Razorpay) {
        toast.error('Payment SDK not ready. Please wait a moment and try again.');
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        toast.error('Payment failed: ' + (resp.error?.description || 'Unknown error'));
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add Money to Wallet</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {[500, 1000, 2000, 5000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(String(preset))}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                amount === String(preset)
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              ₹{preset}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (min ₹100)"
          className="input-field mb-4"
          min={100}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={handleTopup}
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {loading ? 'Processing…' : 'Add Money'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { setWallet } = useSellerStore();
  const [wallet, setLocalWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const limit = 15;

  const fetchWallet = useCallback(async () => {
    try {
      const res = await getWallet();
      setLocalWallet(res.data);
      setWallet(res.data);
    } catch { /* handled */ }
  }, [setWallet]);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await getWalletTransactions({ page, limit });
      setTransactions(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch { /* handled */ } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleTopupSuccess = () => {
    fetchWallet();
    fetchTransactions();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <SellerLayout title="Wallet">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {showTopup && (
        <TopupModal onClose={() => setShowTopup(false)} onSuccess={handleTopupSuccess} />
      )}

      {/* Balance card */}
      <div className="card bg-gradient-to-br from-brand-600 to-brand-800 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-200 text-sm font-medium">Available Balance</p>
            <p className="text-4xl font-bold mt-1">
              ₹{wallet?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <WalletIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <button
          onClick={() => setShowTopup(true)}
          className="mt-6 flex items-center gap-2 bg-white text-brand-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Money
        </button>
      </div>

      {/* Transaction history */}
      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Transaction History</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <WalletIcon className="w-10 h-10 mx-auto mb-2" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((txn) => {
              const cfg = TYPE_CONFIG[txn.type] || TYPE_CONFIG.adjustment;
              const Icon = cfg.icon;
              const isPositive = ['credit', 'refund', 'reversal'].includes(txn.type);
              return (
                <div key={txn.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{txn.description || cfg.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(txn.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : '-'}₹{txn.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">Bal: ₹{txn.balance_after?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">{total} transactions</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40">Prev</button>
              <span className="px-3 py-1.5 text-sm text-gray-600">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
