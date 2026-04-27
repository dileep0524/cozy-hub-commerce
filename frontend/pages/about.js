import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const values = [
  { title: 'Client-First', desc: 'Every decision we make is guided by what creates the most value for our clients.' },
  { title: 'Transparency', desc: 'No hidden fees, no surprises. We communicate clearly at every step.' },
  { title: 'Expertise', desc: '5+ years of marketplace experience across 15+ product categories.' },
  { title: 'Results-Driven', desc: 'We measure success by your growth metrics — sales, visibility, and scale.' },
];

const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', initials: 'AM', bio: '10+ years in B2B ecommerce. Ex-Amazon seller consultant.' },
  { name: 'Neha Verma', role: 'Head of Operations', initials: 'NV', bio: 'Operations specialist with expertise in Flipkart fulfilment.' },
  { name: 'Rohan Das', role: 'Tech Lead', initials: 'RD', bio: 'Builds the tools that power our clients\' inventory systems.' },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About Us — CozyHub Commerce</title>
        <meta name="description" content="Learn about CozyHub Commerce — our story, mission, and the team behind India's trusted B2B ecommerce solutions platform." />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About CozyHub Commerce</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              We started with a simple mission: make ecommerce accessible and profitable for every
              Indian business, regardless of size.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
                  From Sellers to Solutions Providers
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  CozyHub Commerce was founded by former marketplace sellers who understood the
                  challenges of growing a business online. We struggled with listing compliance,
                  inventory chaos, and marketplace policies — so we built the solutions we wished
                  existed.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Today we help 500+ businesses across India launch, manage, and scale their
                  ecommerce presence. From a 5-person team in Mumbai to a pan-India operation, our
                  growth mirrors the growth of our clients.
                </p>
                <ul className="space-y-3">
                  {['Founded in 2019', 'Pan-India operations', '500+ active clients', '15+ product categories'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircleIcon className="w-5 h-5 text-brand-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  To democratise ecommerce for Indian businesses by providing the technology,
                  expertise, and support they need to compete and win on any marketplace.
                </p>
                <div className="space-y-4">
                  {values.map((v) => (
                    <div key={v.title} className="bg-white rounded-xl p-4">
                      <p className="text-sm font-semibold text-brand-700 mb-1">{v.title}</p>
                      <p className="text-xs text-gray-500">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">The Team</span>
              <h2 className="section-title mt-2">People Behind CozyHub</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="card text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-brand-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-brand-600 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to work with us?</h2>
          <Link href="/contact" className="btn-white">
            Get a Free Consultation
          </Link>
        </section>
      </Layout>
    </>
  );
}
