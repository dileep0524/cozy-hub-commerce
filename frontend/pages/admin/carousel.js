import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAllSlides, createSlide, updateSlide, deleteSlide } from '@/services/carousel';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const bgOptions = [
  { label: 'Brand Blue', value: 'from-brand-600 via-brand-700 to-brand-900' },
  { label: 'Indigo', value: 'from-indigo-600 via-indigo-700 to-indigo-900' },
  { label: 'Violet', value: 'from-violet-600 via-violet-700 to-violet-900' },
  { label: 'Emerald', value: 'from-emerald-600 via-emerald-700 to-emerald-900' },
  { label: 'Rose', value: 'from-rose-600 via-rose-700 to-rose-900' },
  { label: 'Amber', value: 'from-amber-500 via-orange-600 to-red-700' },
];

const emptyForm = {
  title: '',
  subtitle: '',
  image_url: '',
  cta_text: 'Get Started',
  cta_link: '/contact',
  badge_text: '',
  bg_color: 'from-brand-600 via-brand-700 to-brand-900',
  sort_order: 0,
  is_active: true,
};

export default function AdminCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await getAllSlides();
      setSlides(res.data.data || []);
    } catch {
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (slide) => {
    setEditing(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      badge_text: slide.badge_text,
      bg_color: slide.bg_color,
      sort_order: slide.sort_order,
      is_active: slide.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateSlide(editing, form);
        toast.success('Slide updated');
      } else {
        await createSlide(form);
        toast.success('Slide created');
      }
      setShowModal(false);
      fetchSlides();
    } catch {
      toast.error('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return;
    try {
      await deleteSlide(id);
      toast.success('Slide deleted');
      fetchSlides();
    } catch {
      toast.error('Failed to delete slide');
    }
  };

  const handleToggle = async (slide) => {
    try {
      await updateSlide(slide.id, { ...slide, is_active: !slide.is_active });
      toast.success(`Slide ${slide.is_active ? 'hidden' : 'shown'}`);
      fetchSlides();
    } catch {
      toast.error('Failed to update slide');
    }
  };

  return (
    <>
      <Head><title>Carousel — CozyHub Admin</title></Head>
      <AdminLayout title="Carousel Management">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Carousel Slides</h2>
            <p className="text-sm text-gray-500">{slides.length} slides · changes appear on homepage instantly</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Slide
          </button>
        </div>

        {/* Slides list */}
        {loading ? (
          <div className="space-y-3">
            {[0,1,2].map(i => (
              <div key={i} className="card animate-pulse h-20" />
            ))}
          </div>
        ) : slides.length === 0 ? (
          <div className="card text-center py-16 text-gray-400">
            <p className="text-lg font-medium mb-2">No slides yet</p>
            <p className="text-sm mb-4">The homepage will show default slides until you add custom ones.</p>
            <button onClick={openCreate} className="btn-primary mx-auto">Add First Slide</button>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, i) => (
              <div key={slide.id} className={`card flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${!slide.is_active ? 'opacity-50' : ''}`}>
                {/* Preview swatch */}
                <div className={`hidden sm:block w-16 h-12 rounded-lg bg-gradient-to-br ${slide.bg_color} flex-shrink-0`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{slide.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {slide.is_active ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-xs text-gray-400">Order: {slide.sort_order}</span>
                  </div>
                  {slide.subtitle && (
                    <p className="text-sm text-gray-500 truncate mt-0.5">{slide.subtitle}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <button
                    onClick={() => handleToggle(slide)}
                    className="p-2 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title={slide.is_active ? 'Hide slide' : 'Show slide'}
                  >
                    {slide.is_active ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="p-2 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Edit slide"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete slide"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editing ? 'Edit Slide' : 'New Slide'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {/* Live preview */}
                <div className={`h-24 rounded-xl bg-gradient-to-br ${form.bg_color} flex items-center justify-center overflow-hidden`}
                  style={form.image_url ? { backgroundImage: `url(${form.image_url})`, backgroundSize: 'cover' } : {}}
                >
                  {form.image_url && <div className="absolute inset-0 bg-black/40 rounded-xl" />}
                  <p className="text-white font-bold text-sm text-center px-4 relative z-10 truncate">
                    {form.title || 'Slide preview'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="input-field"
                    placeholder="Your headline here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <textarea
                    value={form.subtitle}
                    onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                    className="input-field resize-none"
                    rows={2}
                    placeholder="Supporting description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(optional — overrides background color)</span></label>
                  <input
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {bgOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, bg_color: opt.value }))}
                        className={`h-10 rounded-lg bg-gradient-to-br ${opt.value} text-white text-xs font-medium border-2 transition-all ${form.bg_color === opt.value ? 'border-gray-900 scale-105' : 'border-transparent'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      value={form.cta_text}
                      onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                      className="input-field"
                      placeholder="Get Started"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      value={form.cta_link}
                      onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))}
                      className="input-field"
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                    <input
                      value={form.badge_text}
                      onChange={e => setForm(f => ({ ...f, badge_text: e.target.value }))}
                      className="input-field"
                      placeholder="500+ Businesses"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                      min={0}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible on homepage)</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Saving...' : editing ? 'Update Slide' : 'Create Slide'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
