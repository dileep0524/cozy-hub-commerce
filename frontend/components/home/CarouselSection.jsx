import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getActiveSlides } from '@/services/carousel';

const defaultSlides = [
  {
    id: 'default-1',
    title: 'Start Selling Online — Free Onboarding',
    subtitle: 'Get your seller account set up, verified, and live at zero cost. Our specialists handle everything from documentation to your very first sale.',
    cta_text: 'Claim Free Onboarding',
    cta_link: '/contact',
    badge_text: '🎉 Free Onboarding — No Hidden Fees',
    bg_color: 'from-emerald-600 via-teal-700 to-brand-900',
  },
  {
    id: 'default-2',
    title: 'Scale Your Business with CozyHub Commerce',
    subtitle: 'Complete marketplace onboarding, inventory management, and listing optimisation — all in one place.',
    cta_text: 'Get Started',
    cta_link: '/contact',
    badge_text: '800+ Businesses Onboarded',
    bg_color: 'from-brand-600 via-brand-700 to-brand-900',
  },
  {
    id: 'default-4',
    title: 'Smart Inventory. Zero Stockouts.',
    subtitle: 'Real-time multi-warehouse inventory tracking with automated reorder alerts across all marketplaces.',
    cta_text: 'Learn More',
    cta_link: '/services',
    badge_text: 'Inventory Management',
    bg_color: 'from-violet-600 via-violet-700 to-violet-900',
  },
];

export default function CarouselSection() {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getActiveSlides()
      .then((res) => {
        const data = res.data.data;
        if (data && data.length > 0) setSlides(data);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, slides.length]);

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide */}
      <div
        className={`relative bg-gradient-to-br ${slide.bg_color || 'from-brand-600 to-brand-900'} text-white transition-all duration-700`}
        style={slide.image_url ? { backgroundImage: `url(${slide.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {slide.image_url && <div className="absolute inset-0 bg-black/50" />}

        {/* Extra horizontal padding (px-12) on mobile so arrows don't overlap text */}
        <div className="relative max-w-4xl mx-auto px-12 sm:px-10 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 text-center">

          {slide.badge_text && (
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium mb-4 sm:mb-6 max-w-[90vw] truncate">
              {slide.badge_text}
            </div>
          )}

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-5 animate-fade-in">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              {slide.subtitle}
            </p>
          )}

          {slide.cta_text && (
            <Link
              href={slide.cta_link || '/contact'}
              className="btn-white inline-flex items-center justify-center w-full sm:w-auto"
            >
              {slide.cta_text}
            </Link>
          )}
        </div>
      </div>

      {/* Arrows — smaller on mobile */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-5 sm:w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
