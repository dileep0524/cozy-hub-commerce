import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import CalculatorWidget from '@/components/calculators/CalculatorWidget';
import { CALC_CONFIGS } from '@/data/calculatorConfigs';

const CATEGORY_LABELS = {
  fba: 'FBA',
  domestic: 'Domestic',
  international: 'International',
  other: 'Other',
};

const ALL_PATHS = [
  { category: 'fba', slug: 'amazon' },
  { category: 'fba', slug: 'amazon-us' },
  { category: 'fba', slug: 'amazon-uk' },
  { category: 'domestic', slug: 'amazon' },
  { category: 'domestic', slug: 'flipkart' },
  { category: 'domestic', slug: 'jiomart' },
  { category: 'domestic', slug: 'meesho' },
  { category: 'international', slug: 'amazon-us' },
  { category: 'international', slug: 'amazon-uk' },
  { category: 'international', slug: 'ebay' },
  { category: 'international', slug: 'etsy' },
  { category: 'international', slug: 'walmart' },
  { category: 'international', slug: 'alibaba' },
  { category: 'other', slug: 'seller-fees' },
  { category: 'other', slug: 'volumetric-weight' },
  { category: 'other', slug: 'finance-margin' },
  { category: 'other', slug: 'age' },
  { category: 'other', slug: 'pythagorean' },
];

export async function getStaticPaths() {
  return {
    paths: ALL_PATHS.map(({ category, slug }) => ({ params: { category, slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { category, slug } = params;
  const configKey = `${category}/${slug}`;
  const config = CALC_CONFIGS[configKey];
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const title = config?.title || `${slug} Calculator`;
  const description = config?.description || `Use the ${title} to estimate your ecommerce costs and margins.`;
  return {
    props: { category, slug, categoryLabel, title, description, hasConfig: !!config },
  };
}

export default function NestedCalculatorPage({ category, slug, categoryLabel, title, description }) {
  const config = CALC_CONFIGS[`${category}/${slug}`];

  return (
    <>
      <Head>
        <title>{`${title} — CozyHub Commerce`}</title>
        <meta name="description" content={description} />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-200 text-sm font-semibold uppercase tracking-wider mb-4">
              {categoryLabel} Calculator
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{title}</h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

        {/* Calculator or fallback */}
        {config ? (
          <CalculatorWidget config={config} />
        ) : (
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="card max-w-lg mx-auto">
                <p className="text-gray-400 text-sm mb-4">Interactive calculator coming soon</p>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need an instant estimate?</h2>
                <p className="text-gray-600 mb-6">
                  Our team calculates your exact costs and margins — reach out for a free analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact" className="btn-primary">Get a Free Estimate</Link>
                  <Link href={`/calculators/${category}`} className="btn-secondary">Back to Calculators</Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA strip */}
        <section className="bg-white border-t border-gray-100 py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 text-sm mb-4">
              Need help setting up on this marketplace? Our team handles the full onboarding.
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
