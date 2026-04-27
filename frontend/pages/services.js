import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Starter',
    price: '₹9,999',
    period: '/month',
    description: 'Perfect for businesses just starting their online journey.',
    features: [
      'Amazon & Flipkart onboarding',
      'Up to 50 product listings',
      'Basic listing optimisation',
      'Email support',
      'Monthly performance report',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹24,999',
    period: '/month',
    description: 'For businesses ready to accelerate their marketplace growth.',
    features: [
      'Everything in Starter',
      'Up to 500 product listings',
      'Advanced SEO & A+ Content',
      'Inventory management system',
      'Dedicated account manager',
      'Weekly performance calls',
      'Amazon PPC management',
    ],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large-scale ecommerce operations.',
    features: [
      'Everything in Growth',
      'Unlimited product listings',
      'Multi-warehouse inventory',
      'Custom analytics dashboard',
      'Priority support (24/7)',
      'Catalogue management',
      'Cross-border selling setup',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Services() {
  return (
    <>
      <Head>
        <title>Services & Pricing — CozyHub Commerce</title>
        <meta name="description" content="Explore CozyHub Commerce services: marketplace onboarding, inventory management, listing optimisation, and more. Transparent pricing for every business size." />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Services & Pricing</h1>
            <p className="text-lg text-blue-100">
              Transparent, value-driven pricing. No lock-ins.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title">Choose Your Plan</h2>
              <p className="section-subtitle">
                All plans include onboarding support and a 30-day free trial.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
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
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>
                      {plan.description}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className={`text-sm mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <CheckIcon
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            plan.highlight ? 'text-yellow-300' : 'text-brand-600'
                          }`}
                        />
                        <span className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={
                      plan.highlight
                        ? 'btn-white'
                        : 'btn-primary'
                    }
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ teaser */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Have questions about our services?
            </h2>
            <p className="text-gray-600 mb-8">
              Our team is happy to walk you through any plan and customise a solution for your needs.
            </p>
            <Link href="/contact" className="btn-primary">
              Talk to an Expert
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
