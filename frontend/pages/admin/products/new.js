import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { createProduct } from '@/services/adminProducts';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    is_active: true,
    weight_grams: '',
    length_cm: '',
    width_cm: '',
    height_cm: '',
    shipping_charge: '',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        weight_grams: parseFloat(form.weight_grams) || 0,
        length_cm: parseFloat(form.length_cm) || 0,
        width_cm: parseFloat(form.width_cm) || 0,
        height_cm: parseFloat(form.height_cm) || 0,
        shipping_charge: parseFloat(form.shipping_charge) || 0,
      };
      const res = await createProduct(payload);
      toast.success('Product created');
      router.push(`/admin/products/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="New Product">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeftIcon className="w-4 h-4" /> Back to products
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" placeholder="e.g., Premium Cotton T-Shirt" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-red-500">*</span></label>
                <input required value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input-field font-mono" placeholder="e.g., SKU-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field" placeholder="e.g., Apparel" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field resize-none" rows={3} placeholder="Product description…" />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Pricing & Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) <span className="text-red-500">*</span></label>
                <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className="input-field" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Charge (₹)</label>
                <input type="number" min="0" step="0.01" value={form.shipping_charge} onChange={(e) => set('shipping_charge', e.target.value)} className="input-field" placeholder="0.00" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="rounded" />
              <label htmlFor="is_active" className="text-sm text-gray-700">Active (visible to sellers)</label>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Dimensions & Weight</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
                <input type="number" min="0" value={form.weight_grams} onChange={(e) => set('weight_grams', e.target.value)} className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                <input type="number" min="0" step="0.1" value={form.length_cm} onChange={(e) => set('length_cm', e.target.value)} className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                <input type="number" min="0" step="0.1" value={form.width_cm} onChange={(e) => set('width_cm', e.target.value)} className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" min="0" step="0.1" value={form.height_cm} onChange={(e) => set('height_cm', e.target.value)} className="input-field" placeholder="0" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/products" className="btn-secondary flex-1 text-center">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
              {loading ? 'Creating…' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
