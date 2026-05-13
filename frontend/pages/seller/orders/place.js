import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import SellerLayout from '@/components/seller/SellerLayout';
import { getSellerProducts, placeOrder } from '@/services/sellerService';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

export default function PlaceOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipNextSearch = useRef(false);

  const [form, setForm] = useState({
    marketplace_order_id: '',
    ship_by_date: '',
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (search.length < 1) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await getSellerProducts({ search, limit: 10 });
        setProducts(res.data.data || []);
        setShowDropdown(true);
      } catch (err) {
        setProducts([]);
        setShowDropdown(true);
        if (err.response?.status !== 401) {
          toast.error('Failed to search products');
        }
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const unitPrice = selectedVariant
    ? selectedVariant.price
    : selectedProduct?.price || 0;
  const shippingCharge = selectedProduct?.shipping_charge || 0;
  const totalCost = (unitPrice * form.quantity) + shippingCharge;

  const handleProductSelect = (product) => {
    skipNextSearch.current = true;
    setSelectedProduct(product);
    setSelectedVariant(null);
    setSearch(product.name + ' — ' + product.sku);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) { toast.error('Please select a product'); return; }
    if (!form.marketplace_order_id.trim()) { toast.error('Marketplace order ID is required'); return; }
    if (!form.ship_by_date) { toast.error('Ship-by date is required'); return; }

    setLoading(true);
    try {
      const payload = {
        marketplace_order_id: form.marketplace_order_id,
        ship_by_date: new Date(form.ship_by_date).toISOString(),
        product_id: selectedProduct.id,
        quantity: parseInt(form.quantity),
        notes: form.notes,
      };
      if (selectedVariant) payload.variant_id = selectedVariant.id;

      const res = await placeOrder(payload);
      toast.success('Order placed successfully!');
      router.push(`/seller/orders/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const primaryImage = selectedProduct?.images?.find((i) => i.is_primary) || selectedProduct?.images?.[0];
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  return (
    <SellerLayout title="Place Order">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Selection */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Select Product</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedProduct(null); }}
                onFocus={() => search.length >= 1 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="input-field pl-9"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="h-4 w-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin block" />
                </div>
              )}
              {showDropdown && search.length >= 1 && (
                <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {products.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      No products found for "{search}"
                    </div>
                  ) : products.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onMouseDown={() => handleProductSelect(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      {p.images?.[0] ? (
                        <img src={apiBase + p.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <PhotoIcon className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">SKU: {p.sku} · Stock: {p.stock} · ₹{p.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected product details */}
            {selectedProduct && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex gap-4">
                  {primaryImage ? (
                    <img
                      src={apiBase + primaryImage.url}
                      alt={selectedProduct.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">SKU: {selectedProduct.sku}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <span className="text-gray-600">Price: <strong>₹{unitPrice}</strong></span>
                      <span className="text-gray-600">Shipping: <strong>₹{shippingCharge}</strong></span>
                      <span className={selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                        Stock: {selectedProduct.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variant selector */}
                {selectedProduct.variants?.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVariant(null)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                          !selectedVariant ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Base
                      </button>
                      {selectedProduct.variants.filter(v => v.status === 'active').map((v) => (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            selectedVariant?.id === v.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {v.name} · ₹{v.price}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marketplace Order ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.marketplace_order_id}
                  onChange={(e) => setForm({ ...form, marketplace_order_id: e.target.value })}
                  className="input-field"
                  placeholder="e.g., AMZ-123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ship By Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.ship_by_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, ship_by_date: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.quantity}
                  min={1}
                  max={selectedProduct?.stock || 999}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Any special instructions…"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {selectedProduct && (
            <div className="card bg-gray-50">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Unit Price × {form.quantity}</span>
                  <span>₹{(unitPrice * form.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shippingCharge.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total (wallet deduction)</span>
                  <span>₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
              {loading ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
