import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Basic',
    price: '₹5,000',
    period: '/month',
    description: 'Perfect for first-time sellers launching on a single marketplace.',
    highlight: false,
    cta: 'Get Started',
    features: [
      { text: 'Ecommerce onboarding — 1 marketplace', included: true },
      { text: 'Up to 50 product listings', included: true },
      { text: 'Basic account management', included: true },
      { text: 'Payment reconciliation', included: true },
      { text: 'Email support', included: true },
      { text: 'A+ / Enhanced Brand Content', included: false },
      { text: 'OMS order tracking platform', included: false },
      { text: 'Inventory management', included: false },
      { text: 'SEO management', included: false },
      { text: 'FBA management', included: false },
      { text: 'Wholesale product sourcing', included: false },
      { text: 'Custom seller website', included: false },
    ],
  },
  {
    name: 'Standard',
    price: '₹7,500',
    period: '/month',
    description: 'For growing sellers expanding across multiple marketplaces.',
    highlight: true,
    cta: 'Get Started',
    features: [
      { text: 'Onboarding on up to 3 marketplaces', included: true },
      { text: 'Up to 250 product listings', included: true },
      { text: 'Dedicated account support', included: true },
      { text: 'Payment reconciliation', included: true },
      { text: 'Basic A+ content creation', included: true },
      { text: 'OMS order tracking platform', included: true },
      { text: 'Inventory management', included: true },
      { text: 'Basic SEO management', included: true },
      { text: 'Email + Phone support', included: true },
      { text: 'FBA management', included: false },
      { text: 'Wholesale product sourcing', included: false },
      { text: 'Custom seller website', included: false },
    ],
  },
  {
    name: 'Premium',
    price: '₹15,000',
    period: '/month',
    description: 'Full-service management for serious sellers scaling across markets.',
    highlight: false,
    cta: 'Go Premium',
    features: [
      { text: 'Unlimited marketplace onboarding', included: true },
      { text: 'Unlimited product listings', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Payment reconciliation', included: true },
      { text: 'Full A+ + Enhanced Brand Content', included: true },
      { text: 'OMS order tracking platform', included: true },
      { text: 'Advanced inventory management', included: true },
      { text: 'Advanced SEO + keyword strategy', included: true },
      { text: 'FBA management', included: true },
      { text: 'Wholesale product sourcing', included: true },
      { text: 'Custom seller website', included: true },
      { text: '24/7 priority support', included: true },
    ],
  },
];

const allPlansInclude = [
  '30-day onboarding support',
  'Seller account setup & verification',
  'GST & documentation assistance',
  'Monthly performance report',
  'Access to CozyHub seller portal',
];

export default function PlansPage() {
  return (
    <>
      <Head>
        <title>Pricing Plans — CozyHub Commerce</title>
        <meta
          name="description"
          content="Simple, transparent pricing for every stage of your ecommerce journey. Choose the CozyHub Commerce plan that fits your business."
        />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Plans Built for Every Seller
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
              From your first listing to a full-scale multi-marketplace operation — we have a plan
              that grows with you. No lock-ins, no hidden fees.
            </p>
          </div>
        </section>

        {/* Pricing grid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title">Choose Your Plan</h2>
              <p className="section-subtitle">
                All plans include a 30-day onboarding support period and a free initial consultation.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 flex flex-col border-2 transition-shadow hover:shadow-lg ${
                    plan.highlight
                      ? 'border-brand-600 bg-brand-600 text-white relative'
                      : 'border-gray-100 bg-white text-gray-900'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <h3
                      className={`text-xl font-bold mb-1 ${
                        plan.highlight ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm mb-5 ${
                        plan.highlight ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {plan.description}
                    </p>
                    <div className="flex items-end gap-1">
                      <span
                        className={`text-4xl font-bold ${
                          plan.highlight ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm mb-1 ${
                          plan.highlight ? 'text-blue-200' : 'text-gray-400'
                        }`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-3 text-sm">
                        {f.included ? (
                          <CheckIcon
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              plan.highlight ? 'text-yellow-300' : 'text-brand-600'
                            }`}
                          />
                        ) : (
                          <XMarkIcon
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              plan.highlight ? 'text-blue-300/60' : 'text-gray-300'
                            }`}
                          />
                        )}
                        <span
                          className={
                            f.included
                              ? plan.highlight
                                ? 'text-blue-50'
                                : 'text-gray-700'
                              : plan.highlight
                              ? 'text-blue-200/60'
                              : 'text-gray-300'
                          }
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={plan.highlight ? 'btn-white' : 'btn-primary'}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All plans include */}
        <section className="py-14 bg-brand-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              Included in Every Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlansInclude.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-brand-100"
                >
                  <CheckIcon className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Need a Custom Plan?
            </h2>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">
              Running a large catalogue or selling across 5+ marketplaces? We build tailored
              solutions for enterprise sellers. Talk to us and we will put together a package
              that fits your exact needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Talk to an Expert
              </Link>
              <Link href="/services" className="btn-secondary">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
