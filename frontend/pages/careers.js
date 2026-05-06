import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

const VALUES = [
  {
    icon: '🚀',
    title: 'Move Fast',
    description: 'We ship quickly, learn from feedback, and iterate. No red tape.',
  },
  {
    icon: '🤝',
    title: 'Customer First',
    description: 'Every decision starts with "how does this help our sellers?"',
  },
  {
    icon: '🌍',
    title: 'Think Global',
    description: 'We help Indian businesses reach customers around the world.',
  },
  {
    icon: '📈',
    title: 'Grow Together',
    description: 'When our sellers win, we win. We celebrate every milestone.',
  },
];

export default function CareersPage() {
  return (
    <>
      <Head>
        <title>Careers — CozyHub Commerce</title>
        <meta
          name="description"
          content="Join the CozyHub Commerce team and help Indian businesses sell globally."
        />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-200 text-sm font-semibold uppercase tracking-wider mb-4">
              We are hiring
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Help Indian businesses reach customers around the world. We are building the future of ecommerce enablement.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title">Why CozyHub?</h2>
              <p className="section-subtitle">We are a small, focused team that moves fast and cares deeply.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="card text-center">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">Open Positions</h2>
            <p className="section-subtitle mb-10">
              We do not have any open roles right now, but we are always looking for great people.
            </p>
            <div className="card py-12">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500 text-sm mb-6">No open positions at the moment.</p>
              <p className="text-gray-700 mb-6">
                Send us your resume and we will reach out when a role that fits you opens up.
              </p>
              <Link href="/contact" className="btn-primary">
                Send Your Resume
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
