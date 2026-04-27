import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getActiveSlides } from '@/services/carousel';

const defaultSlides = [
  {
    id: 'default-1',
    title: 'Scale Your Business with CozyHub Commerce',
    subtitle: 'Complete Amazon & Flipkart onboarding, inventory management, and listing optimisation — all in one place.',
    cta_text: 'Get Started',
    cta_link: '/contact',
    badge_text: '500+ Businesses Onboarded',
    bg_color: 'from-brand-600 via-brand-700 to-brand-900',
  },
  {
    id: 'default-2',
    title: 'Go Live on Amazon in Just 7 Days',
    subtitle: 'Our dedicated team handles verification, GST setup, brand registry, and your first 50 listings.',
    cta_text: 'Start Onboarding',
    cta_link: '/contact',
    badge_text: 'Fast Onboarding',
    bg_color: 'from-indigo-600 via-indigo-700 to-indigo-900',
  },
  {
    id: 'default-3',
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
      {/* Slides */}
      <div
        className={`relative bg-gradient-to-br ${slide.bg_color || 'from-brand-600 to-brand-900'} text-white transition-all duration-700`}
        style={slide.image_url ? { backgroundImage: `url(${slide.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {slide.image_url && <div className="absolute inset-0 bg-black/50" />}

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
          {slide.badge_text && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              {slide.badge_text}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-5 animate-fade-in">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8">
              {slide.subtitle}
            </p>
          )}

          {slide.cta_text && (
            <Link
              href={slide.cta_link || '/contact'}
              className="btn-white inline-flex items-center"
            >
              {slide.cta_text}
            </Link>
          )}
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
