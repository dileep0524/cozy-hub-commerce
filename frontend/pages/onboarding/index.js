import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { ONBOARDING_DATA } from '@/data/onboardingData';

const PLATFORM_ICONS = {
  Amazon: '🛒',
  Flipkart: '🛍️',
  Meesho: '👗',
  JioMart: '🏪',
  eBay: '📦',
  Etsy: '🎨',
  Walmart: '🏬',
  Alibaba: '🌐',
};

export default function OnboardingHub() {
  const platforms = Object.values(ONBOARDING_DATA);

  return (
    <>
      <Head>
        <title>Free Marketplace Onboarding — CozyHub Commerce</title>
        <meta
          name="description"
          content="Free seller account onboarding for Amazon, Flipkart, Meesho, JioMart, eBay, Etsy, Walmart, and Alibaba. Zero setup cost, expert-guided, live in days."
        />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              🎉 Free Onboarding — No Hidden Fees
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Start Selling Online — Completely Free
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Our specialists handle your full seller account setup on any marketplace — zero setup fees, zero catch. Pick your platform and get live in days.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-2xl mx-auto">
              {[
                { value: '800+', label: 'Sellers Onboarded' },
                { value: '₹0 / $0', label: 'Setup Fee' },
                { value: '8', label: 'Marketplaces' },
                { value: '98%', label: 'Approval Rate' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Choose Your Marketplace</h2>
              <p className="section-subtitle">
                Select the platform you want to start selling on — free setup included.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {platforms.map((p) => (
                <Link
                  key={p.slug}
                  href={`/onboarding/${p.slug}`}
                  className="card hover:shadow-md transition-shadow duration-200 group flex flex-col items-center text-center p-6"
                >
                  <span className="text-4xl mb-3">{PLATFORM_ICONS[p.marketplace] || '🛒'}</span>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                    {p.marketplace}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                    {p.heroStats[3]?.label} — {p.heroStats[3]?.value}
                  </p>
                  <span className="mt-auto inline-flex items-center text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                    Get Free Setup →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Free */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Why Do We Offer Free Onboarding?</h2>
            <p className="section-subtitle mb-10">
              We believe the barrier to starting should be zero. We offer free onboarding to build long-term relationships — not to trap you with hidden fees.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                {
                  icon: '🤝',
                  title: 'Long-Term Partnership',
                  desc: "We set you up for free because we want to be your growth partner as your business scales. Zero setup fee, no forced commitments.",
                },
                {
                  icon: '🎯',
                  title: 'Expert-Guided Setup',
                  desc: 'Our specialists have onboarded 800+ sellers. Free onboarding means professional setup — not a self-serve tutorial.',
                },
                {
                  icon: '🚀',
                  title: 'Live in Days, Not Weeks',
                  desc: 'DIY registration takes weeks of rejections. Our guided process gets you live in 3–7 business days with a near-100% approval rate.',
                },
              ].map((item) => (
                <div key={item.title} className="card">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Not Sure Which Platform to Start With?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Talk to our team — we will recommend the right marketplace for your product category, target audience, and business goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors duration-200"
            >
              Get a Free Recommendation
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
