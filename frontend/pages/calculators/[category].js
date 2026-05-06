import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

const PAGE_DATA = {
  fba: {
    title: 'FBA Calculator',
    subtitle: 'Fulfillment by Amazon',
    description: 'Estimate your Amazon FBA fees, net profit, and ROI before you ship a single unit.',
  },
  domestic: {
    title: 'Domestic Shipping Calculator',
    subtitle: 'Domestic Marketplaces',
    description: 'Calculate shipping costs and margins for domestic marketplace orders across India.',
  },
  international: {
    title: 'International Shipping Calculator',
    subtitle: 'Cross-Border Commerce',
    description: 'Plan your cross-border selling with accurate international shipping cost estimates.',
  },
  other: {
    title: 'Other Marketplace Calculator',
    subtitle: 'Multi-Platform',
    description: 'Estimate fees and margins for Meesho, JioMart, Flipkart, and other marketplaces.',
  },
};

export async function getStaticPaths() {
  return {
    paths: Object.keys(PAGE_DATA).map((category) => ({ params: { category } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = PAGE_DATA[params.category];
  if (!data) return { notFound: true };
  return { props: { category: params.category, ...data } };
}

export default function CalculatorPage({ title, subtitle, description }) {
  return (
    <>
      <Head>
        <title>{title} — CozyHub Commerce</title>
        <meta name="description" content={description} />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-200 text-sm font-semibold uppercase tracking-wider mb-4">
              {subtitle}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{title}</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

        {/* Calculator placeholder */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card max-w-lg mx-auto">
              <p className="text-gray-500 text-sm mb-6">Calculator coming soon</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Need a quick estimate?
              </h2>
              <p className="text-gray-600 mb-6">
                Reach out to our team and we will calculate your costs and margins manually.
              </p>
              <Link href="/contact" className="btn-primary">
                Get a Free Estimate
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
