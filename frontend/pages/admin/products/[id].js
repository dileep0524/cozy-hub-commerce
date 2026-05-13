import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  getProduct, updateProduct, uploadProductImage, deleteProductImage,
  addVariant, updateVariant, deleteVariant,
} from '@/services/adminProducts';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeftIcon, TrashIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [newVariant, setNewVariant] = useState({ name: '', sku: '', price: '', stock: '' });
  const [addingVariant, setAddingVariant] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getProduct(id);
      setProduct(res.data);
      setForm({
        name: res.data.name,
        description: res.data.description,
        price: res.data.price,
        stock: res.data.stock,
        category: res.data.category,
        is_active: res.data.is_active,
        weight_grams: res.data.weight_grams,
        length_cm: res.data.length_cm,
        width_cm: res.data.width_cm,
        height_cm: res.data.height_cm,
        shipping_charge: res.data.shipping_charge,
      });
    } catch {
      toast.error('Product not found');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProduct(id, form);
      toast.success('Product updated');
      fetchProduct();
    } catch {
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      await uploadProductImage(id, fd);
      toast.success('Image uploaded');
      fetchProduct();
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteProductImage(id, imageId);
      toast.success('Image deleted');
      fetchProduct();
    } catch { toast.error('Failed to delete image'); }
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    setAddingVariant(true);
    try {
      await addVariant(id, {
        name: newVariant.name,
        sku: newVariant.sku,
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock) || 0,
      });
      toast.success('Variant added');
      setNewVariant({ name: '', sku: '', price: '', stock: '' });
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add variant');
    } finally {
      setAddingVariant(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!confirm('Delete this variant?')) return;
    try {
      await deleteVariant(id, variantId);
      toast.success('Variant deleted');
      fetchProduct();
    } catch { toast.error('Failed to delete variant'); }
  };

  if (loading) return (
    <AdminLayout title="Edit Product">
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Edit Product">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="w-4 h-4" /> Back to products
        </Link>

        {/* Basic info form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input type="checkbox" id="is_active" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Pricing & Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" min="0" step="0.01" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" min="0" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping (₹)</label>
                <input type="number" min="0" step="0.01" value={form.shipping_charge || ''} onChange={(e) => setForm({ ...form, shipping_charge: e.target.value })} className="input-field" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Images */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Product Images</h2>
            <label className={`btn-secondary text-sm cursor-pointer flex items-center gap-1 ${uploadingImage ? 'opacity-60' : ''}`}>
              {uploadingImage ? <span className="h-3 w-3 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" /> : <PlusIcon className="w-4 h-4" />}
              Upload
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="sr-only" disabled={uploadingImage} />
            </label>
          </div>
          {product?.images?.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <PhotoIcon className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">No images yet. Upload one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {product?.images?.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <img src={apiBase + img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Variants</h2>
          {product?.variants?.length > 0 && (
            <div className="mb-4 divide-y divide-gray-100">
              {product.variants.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{v.name}</p>
                    <p className="text-xs text-gray-500">SKU: {v.sku} · Stock: {v.stock} · ₹{v.price}</p>
                  </div>
                  <button onClick={() => handleDeleteVariant(v.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add variant form */}
          <form onSubmit={handleAddVariant} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Add Variant</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input required placeholder="Name (e.g., Red/L)" value={newVariant.name} onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} className="input-field text-sm" />
              <input required placeholder="SKU" value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} className="input-field text-sm font-mono" />
              <input required type="number" min="0" step="0.01" placeholder="Price (₹)" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} className="input-field text-sm" />
              <input type="number" min="0" placeholder="Stock" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })} className="input-field text-sm" />
            </div>
            <button type="submit" disabled={addingVariant} className="btn-primary text-sm flex items-center gap-1">
              {addingVariant ? <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <PlusIcon className="w-4 h-4" />}
              Add Variant
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
