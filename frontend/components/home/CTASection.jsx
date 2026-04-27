import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function CTASection() {
  return (
    <section className="py-20 bg-brand-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Scale Your Ecommerce Business?
        </h2>
        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
          Join 500+ businesses that trust CozyHub Commerce to manage and grow their online presence
          on Amazon, Flipkart, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-white">
            Get a Free Consultation
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
