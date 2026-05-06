import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

const PAGE_DATA = {
  alibaba: {
    title: 'Alibaba Seller Account Management',
    marketplace: 'Alibaba',
    description: 'Establish and grow your presence on Alibaba with expert account setup, product listing, and B2B sales management.',
  },
  amazon: {
    title: 'Amazon Seller Account Management',
    marketplace: 'Amazon',
    description: 'Full-service Amazon account management — from listing optimization and PPC to inventory planning and brand protection.',
  },
  etsy: {
    title: 'Etsy Seller Account Management',
    marketplace: 'Etsy',
    description: 'Grow your Etsy shop with professional account management, SEO-optimized listings, and shop analytics.',
  },
  walmart: {
    title: 'Walmart Seller Account Management',
    marketplace: 'Walmart',
    description: 'Scale your Walmart marketplace business with dedicated account management, catalog optimization, and fulfillment support.',
  },
  flipkart: {
    title: 'Flipkart Seller Account Management',
    marketplace: 'Flipkart',
    description: 'Optimize your Flipkart seller account with comprehensive management services, listing optimization, and growth strategies.',
  },
  jiomart: {
    title: 'Jiomart Seller Account Management',
    marketplace: 'JioMart',
    description: 'Expand your reach on JioMart with professional account management, catalog setup, and dedicated seller support.',
  },
  meesho: {
    title: 'Meesho Seller Account Management',
    marketplace: 'Meesho',
    description: 'Grow your Meesho seller business with expert account management, catalog optimization, and performance tracking.',
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

export default function ManagementPage({ title, marketplace, description }) {
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
              Ecommerce Management
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{title}</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">{description}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Expert {marketplace} Management</h2>
            <p className="section-subtitle mb-10">
              Let our specialists handle day-to-day operations so you can focus on growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get a Free Audit
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
