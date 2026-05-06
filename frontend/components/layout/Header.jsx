import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { NAV_ITEMS } from '@/data/navConfig';
import DropdownMenu from '@/components/layout/DropdownMenu';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const [openMobileSubGroup, setOpenMobileSubGroup] = useState(null);
  const closeTimerRef = useRef(null);
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    const close = () => {
      setMobileOpen(false);
      setOpenMobileGroup(null);
      setOpenMobileSubGroup(null);
    };
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  // Recursively checks if any descendant href is active
  const isGroupActive = (children) => {
    if (!children) return false;
    return children.some((c) => {
      if (c.href && isActive(c.href)) return true;
      if (c.children) return isGroupActive(c.children);
      return false;
    });
  };

  const handleMouseEnter = (label) => {
    clearTimeout(closeTimerRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 130);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setActiveDropdown(null);
  };

  const handleMobileGroupToggle = (label) => {
    if (openMobileGroup === label) {
      setOpenMobileGroup(null);
      setOpenMobileSubGroup(null);
    } else {
      setOpenMobileGroup(label);
      setOpenMobileSubGroup(null);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              CozyHub <span className="text-brand-600">Commerce</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="nav-hover-underline">{item.label}</span>
                </Link>
              ) : (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isGroupActive(item.children)
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.label}
                  >
                    <span className="nav-hover-underline">{item.label}</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 mt-1.5 z-50 animate-dropdown-enter"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <DropdownMenu items={item.children} />
                    </div>
                  )}
                </div>
              )
            )}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Contact Us
            </Link>

            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-0.5 pt-3">
            {NAV_ITEMS.map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.label}>
                  {/* Level-1 group toggle */}
                  <button
                    onClick={() => handleMobileGroupToggle(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isGroupActive(item.children)
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                        openMobileGroup === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openMobileGroup === item.label && (
                    <div className="ml-4 mt-0.5 flex flex-col gap-0.5">
                      {item.children.map((child) =>
                        child.children ? (
                          /* Level-2 group toggle */
                          <div key={child.label}>
                            <button
                              onClick={() =>
                                setOpenMobileSubGroup(
                                  openMobileSubGroup === child.label ? null : child.label
                                )
                              }
                              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                            >
                              {child.label}
                              <ChevronDownIcon
                                className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                                  openMobileSubGroup === child.label ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {openMobileSubGroup === child.label && (
                              <div className="ml-4 mt-0.5 flex flex-col gap-0.5">
                                {child.children.map((subChild) => (
                                  <Link
                                    key={subChild.href}
                                    href={subChild.href}
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setOpenMobileGroup(null);
                                      setOpenMobileSubGroup(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors leading-snug ${
                                      isActive(subChild.href)
                                        ? 'text-brand-600 font-medium bg-brand-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                  >
                                    {subChild.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Direct link */
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setOpenMobileGroup(null);
                            }}
                            className={`px-4 py-2.5 rounded-lg text-sm transition-colors leading-snug ${
                              isActive(child.href)
                                ? 'text-brand-600 font-medium bg-brand-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            )}

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors duration-200 w-full"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
