import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

const PAGE_DATA = {
  amazon: {
    title: 'Amazon Global Free Onboarding',
    platform: 'Amazon',
    description: 'Get onboarded to Amazon.com global selling for free. We handle your account setup, documentation, and first listing.',
  },
  ebay: {
    title: 'eBay Free Onboarding',
    platform: 'eBay',
    description: 'Start selling on eBay with zero onboarding cost. Our team sets up your account and guides you through your first listing.',
  },
};

export async function getStaticPaths() {
  return {
    paths: Object.keys(PAGE_DATA).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = PAGE_DATA[params.slug];
  if (!data) return { notFound: true };
  return { props: { slug: params.slug, ...data } };
}

export default function OnboardingPage({ title, platform, description }) {
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
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Free Onboarding
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{title}</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Start Selling on {platform} — For Free</h2>
            <p className="section-subtitle mb-10">
              No hidden fees. Our onboarding specialists walk you through every step from account creation to your first sale.
            </p>
            <Link href="/contact" className="btn-primary">
              Claim Your Free Onboarding
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
