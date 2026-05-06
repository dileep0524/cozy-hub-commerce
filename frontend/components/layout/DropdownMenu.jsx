import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

function DropdownItem({ item }) {
  const [showSub, setShowSub] = useState(false);
  const timerRef = useRef(null);
  const router = useRouter();

  const hasChildren = !!(item.children?.length);

  const isActive = item.href
    ? item.href === '/'
      ? router.pathname === '/'
      : router.pathname.startsWith(item.href)
    : false;

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    setShowSub(true);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setShowSub(false), 130);
  };

  const baseClass =
    'flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors leading-snug text-left';

  const activeClass = isActive
    ? 'text-brand-600 bg-brand-50 font-medium'
    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900';

  return (
    <div
      className="relative"
      onMouseEnter={hasChildren ? handleEnter : undefined}
      onMouseLeave={hasChildren ? handleLeave : undefined}
    >
      {item.href && !hasChildren ? (
        <Link href={item.href} className={`${baseClass} ${activeClass}`}>
          <span className="nav-hover-underline">{item.label}</span>
        </Link>
      ) : (
        <button
          className={`${baseClass} text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
          tabIndex={0}
        >
          <span className="nav-hover-underline">{item.label}</span>
          {hasChildren && (
            <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 ml-3" />
          )}
        </button>
      )}

      {/* Sub-menu — opens to the right */}
      {hasChildren && showSub && (
        <div
          className="absolute left-full top-0 ml-0.5 z-[60] animate-dropdown-enter"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <DropdownMenu items={item.children} />
        </div>
      )}
    </div>
  );
}

export default function DropdownMenu({ items }) {
  return (
    <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5">
      {items.map((item) => (
        <DropdownItem key={item.href || item.label} item={item} />
      ))}
    </div>
  );
}
