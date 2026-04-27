import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const highlights = [
  'Amazon & Flipkart onboarding in 7 days',
  'Dedicated account manager',
  '500+ businesses scaled',
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-white/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              500+ Businesses Onboarded
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Scale Your Business with{' '}
              <span className="text-yellow-300">CozyHub</span>{' '}
              Commerce
            </h1>

            <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
              Your complete B2B ecommerce solutions partner. We handle Amazon &amp; Flipkart
              onboarding, inventory management, listing optimization, and everything in between.
            </p>

            <ul className="space-y-3 mb-10">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-white">
                Start Selling Online
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <p className="text-sm text-blue-200 mb-6 font-medium uppercase tracking-wider">
                Live Dashboard Preview
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Total Enquiries', value: '248', change: '+12%' },
                  { label: 'Active Sellers', value: '512', change: '+8%' },
                  { label: 'Products Listed', value: '10,432', change: '+23%' },
                  { label: 'Conversion Rate', value: '4.8%', change: '+0.6%' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3"
                  >
                    <span className="text-sm text-blue-200">{stat.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">{stat.value}</span>
                      <span className="text-xs text-green-400 font-medium">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
