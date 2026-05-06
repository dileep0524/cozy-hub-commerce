import Link from 'next/link';
import {
  CheckBadgeIcon,
  TagIcon,
  PresentationChartLineIcon,
  CubeIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowPathIcon,
  TruckIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  MegaphoneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import ServiceEnquiryForm from './ServiceEnquiryForm';

const ICON_MAP = {
  CheckBadgeIcon,
  TagIcon,
  PresentationChartLineIcon,
  CubeIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowPathIcon,
  TruckIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  MegaphoneIcon,
};

function ServiceIcon({ name, className }) {
  const Icon = ICON_MAP[name] || CheckCircleIcon;
  return <Icon className={className} />;
}

/* ── SECTION 1: Hero ─────────────────────────────────────── */
function HeroSection({ service }) {
  return (
    <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — headline */}
          <div className="pt-4">
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              {service.marketplace} Services
            </span>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight mb-5">
              {service.title}
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8">
              {service.tagline}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#enquiry-form"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-brand-700 font-semibold text-sm hover:bg-brand-50 transition-colors duration-200"
              >
                Get a Free Consultation
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors duration-200"
              >
                Talk to an Expert
              </Link>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {service.heroStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div id="enquiry-form" className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Start Selling on {service.marketplace}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill in your details and we will contact you within 24 hours.
            </p>
            <ServiceEnquiryForm defaultMarketplace={service.marketplace} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 2: About ────────────────────────────────────── */
function AboutSection({ about }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title mb-6">{about.heading}</h2>
        <div className="space-y-4">
          {about.paragraphs.map((para, i) => (
            <p key={i} className="text-gray-600 text-lg leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 3: Offerings ────────────────────────────────── */
function OfferingsSection({ offerings, marketplace }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="section-title mt-2">
            Our {marketplace} Management Services
          </h2>
          <p className="section-subtitle">
            End-to-end support across every part of your {marketplace} business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((item) => (
            <div
              key={item.title}
              className="card hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                <ServiceIcon name={item.icon} className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 4: Process ──────────────────────────────────── */
function ProcessSection({ process }) {
  return (
    <section className="py-16 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            How We Work
          </span>
          <h2 className="section-title mt-2">Our 5-Step Process</h2>
          <p className="section-subtitle">
            A proven process that gets you live and selling as fast as possible.
          </p>
        </div>

        {/* Desktop: horizontal steps */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4">
          {process.map((step, idx) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {idx < process.length - 1 && (
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-brand-200 z-0" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: vertical steps */}
        <div className="lg:hidden space-y-6">
          {process.map((step) => (
            <div key={step.step} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                {step.step}
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 5: Benefits ─────────────────────────────────── */
function BenefitsSection({ benefits, marketplace }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            Why It Matters
          </span>
          <h2 className="section-title mt-2">
            Benefits of Selling on {marketplace} with Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="card border-t-4 border-brand-500 hover:shadow-md transition-shadow duration-200"
            >
              <div className="mb-3">
                <span className="text-4xl font-extrabold text-brand-600">
                  {b.stat}
                </span>
                <span className="text-xl font-bold text-brand-400">{b.unit}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 6: Why Choose Us ────────────────────────────── */
function WhyUsSection({ whyUs }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            Our Edge
          </span>
          <h2 className="section-title mt-2">Why Choose CozyHub Commerce?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyUs.map((item, idx) => (
            <div key={item.title} className="card text-center hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {idx + 1}
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 7: Trust Stats Bar ──────────────────────────── */
function TrustBar() {
  const stats = [
    { value: '800+', label: 'Sellers Onboarded' },
    { value: '6+', label: 'Years Experience' },
    { value: '₹35Cr+', label: 'Revenue Generated' },
    { value: '24/7', label: 'Dedicated Support' },
  ];

  return (
    <section className="py-10 bg-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-sm text-blue-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 8: Bottom CTA ───────────────────────────────── */
function BottomCTA({ cta }) {
  return (
    <section className="py-16 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{cta.heading}</h2>
        <p className="text-lg text-blue-100 mb-8">{cta.subheading}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#enquiry-form"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors duration-200"
          >
            {cta.buttonText}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors duration-200"
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── MAIN TEMPLATE ───────────────────────────────────────── */
export default function ServicePageTemplate({ service }) {
  return (
    <>
      <HeroSection service={service} />
      <AboutSection about={service.about} />
      <OfferingsSection offerings={service.offerings} marketplace={service.marketplace} />
      <ProcessSection process={service.process} />
      <BenefitsSection benefits={service.benefits} marketplace={service.marketplace} />
      <WhyUsSection whyUs={service.whyUs} />
      <TrustBar />
      <BottomCTA cta={service.cta} marketplace={service.marketplace} />
    </>
  );
}
