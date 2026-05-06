import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

const PLACEHOLDER_POSTS = [
  {
    id: 1,
    tag: 'Amazon',
    title: 'How to Start Selling on Amazon India in 2024',
    excerpt: 'A step-by-step guide to setting up your Amazon seller account and launching your first product listing.',
    readTime: '5 min read',
  },
  {
    id: 2,
    tag: 'Flipkart',
    title: 'Flipkart Seller Account: Complete Registration Guide',
    excerpt: 'Everything you need to know about registering as a seller on Flipkart and getting your first order.',
    readTime: '4 min read',
  },
  {
    id: 3,
    tag: 'Etsy',
    title: 'How to Sell Handmade Products on Etsy from India',
    excerpt: 'Tap into a global audience of buyers looking for unique, handcrafted products. Here is how to get started.',
    readTime: '6 min read',
  },
  {
    id: 4,
    tag: 'Meesho',
    title: 'Meesho Seller Onboarding: Tips for New Sellers',
    excerpt: 'Maximize your Meesho sales from day one with these proven tips from our marketplace experts.',
    readTime: '4 min read',
  },
  {
    id: 5,
    tag: 'FBA',
    title: 'Understanding Amazon FBA Fees in 2024',
    excerpt: 'Break down every FBA fee so you can price your products profitably and avoid surprises.',
    readTime: '7 min read',
  },
  {
    id: 6,
    tag: 'Strategy',
    title: 'Multi-Marketplace Strategy: Sell on 3+ Platforms',
    excerpt: 'Learn how to manage inventory and orders across Amazon, Flipkart, Meesho, and more without losing your mind.',
    readTime: '8 min read',
  },
];

export default function BlogsPage() {
  return (
    <>
      <Head>
        <title>Blogs & Insights — CozyHub Commerce</title>
        <meta
          name="description"
          content="Ecommerce tips, marketplace updates, and growth strategies from the CozyHub Commerce team."
        />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-200 text-sm font-semibold uppercase tracking-wider mb-4">
              Resources
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Blogs & Insights</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Ecommerce tips, marketplace updates, and growth strategies to help your business sell smarter.
            </p>
          </div>
        </section>

        {/* Blog grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLACEHOLDER_POSTS.map((post) => (
                <article key={post.id} className="card flex flex-col hover:shadow-md transition-shadow duration-200">
                  <span className="inline-block badge-new mb-3 self-start">{post.tag}</span>
                  <h2 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 flex-1 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.readTime}</span>
                    <span className="text-brand-600 font-medium cursor-pointer hover:underline">
                      Read more →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to grow your marketplace business?</h2>
            <p className="text-gray-600 mb-8">
              Talk to our experts and get a free consultation tailored to your business.
            </p>
            <Link href="/contact" className="btn-primary">
              Get a Free Consultation
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
