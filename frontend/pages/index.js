import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import CarouselSection from '@/components/home/CarouselSection';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesSection from '@/components/home/ServicesSection';
import ProcessSection from '@/components/home/ProcessSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import EnquiryForm from '@/components/forms/EnquiryForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>CozyHub Commerce — B2B Ecommerce Solutions</title>
        <meta
          name="description"
          content="Scale your business with CozyHub Commerce. Amazon & Flipkart onboarding, inventory management, listing optimization, and more."
        />
        <meta property="og:title" content="CozyHub Commerce — B2B Ecommerce Solutions" />
        <meta
          property="og:description"
          content="Your trusted B2B ecommerce solutions partner. Onboard, sell, and scale on India's top marketplaces."
        />
      </Head>
      <Layout>
        <CarouselSection />
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <ProcessSection />
        <TestimonialsSection />
        <CTASection />

        {/* Enquiry section */}
        <section id="enquiry" className="py-20 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
                Get In Touch
              </span>
              <h2 className="section-title mt-2">Start Your Ecommerce Journey</h2>
              <p className="mt-4 text-gray-600">
                Fill out the form and our team will reach out within 24 hours.
              </p>
            </div>
            <div className="card">
              <EnquiryForm />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
