import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  InboxIcon,
  ChartBarIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import useAdminStore from '@/store/adminStore';
import { useAdmin } from '@/hooks/useAdmin';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/admin/enquiries', label: 'Enquiries', icon: InboxIcon },
  { href: '/admin/carousel', label: 'Carousel', icon: PhotoIcon },
  { href: '/admin/dashboard#analytics', label: 'Analytics', icon: ChartBarIcon },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const { admin, ready } = useAdmin();
  const logout = useAdminStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navLinks = (
    <>
      {/* Logo row */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100 flex-shrink-0">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <ShoppingBagIcon className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-sm flex-1">CozyHub Admin</span>
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-brand-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {admin?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{admin?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed inset-y-0 left-0 z-30">
        {navLinks}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col md:hidden shadow-xl">
            {navLinks}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 flex-shrink-0"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h1>
          </div>
          <Link href="/" target="_blank" className="text-sm text-brand-600 hover:underline whitespace-nowrap ml-4">
            View Website ↗
          </Link>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
