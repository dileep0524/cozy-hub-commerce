import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const highlights = [
  'Amazon & Flipkart onboarding in 7 days',
  'Dedicated account manager',
  '500+ businesses scaled',
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              500+ Businesses Onboarded
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
              Scale Your Business with{' '}
              <span className="text-brand-600">CozyHub</span>{' '}
              Commerce
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              Your complete B2B ecommerce solutions partner. We handle Amazon &amp; Flipkart
              onboarding, inventory management, listing optimization, and everything in between.
            </p>

            <ul className="space-y-3 mb-10">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-brand-600 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary">
                Start Selling Online
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-brand-50 to-blue-100 border border-brand-100 rounded-2xl p-8 shadow-md">
              <p className="text-xs text-brand-500 mb-6 font-bold uppercase tracking-widest">
                Live Dashboard Preview
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Total Enquiries',  value: '2,140',  change: '+18%'  },
                  { label: 'Active Sellers',   value: '834',    change: '+14%'  },
                  { label: 'Products Listed',  value: '13,480', change: '+22%'  },
                  { label: 'Conversion Rate',  value: '38.4%',  change: '+2.8%' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between bg-white/70 backdrop-blur-sm border border-white rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 hover:bg-white transition-colors duration-200"
                  >
                    <span className="text-xs lg:text-sm text-gray-500">{stat.label}</span>
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className="text-lg lg:text-xl xl:text-2xl font-extrabold text-brand-700 tabular-nums tracking-tight">
                        {stat.value}
                      </span>
                      <span className="text-[10px] lg:text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 lg:px-2 py-0.5 rounded-full whitespace-nowrap">
                        {stat.change}
                      </span>
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
