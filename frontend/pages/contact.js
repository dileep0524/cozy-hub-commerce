import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const contactInfo = [
  {
    icon: EnvelopeIcon,
    label: 'Email Us',
    value: 'hello@cozyhubcommerce.com',
    href: 'mailto:hello@cozyhubcommerce.com',
  },
  {
    icon: PhoneIcon,
    label: 'Call Us',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: MapPinIcon,
    label: 'Office',
    value: 'Mumbai, Maharashtra, India',
    href: null,
  },
];

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us — CozyHub Commerce</title>
        <meta name="description" content="Get in touch with CozyHub Commerce for a free consultation on your ecommerce needs." />
      </Head>
      <Layout>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-lg text-blue-100">
              Tell us about your business and we&apos;ll reach out within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact grid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send an Enquiry</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form and our team will get back to you shortly.
                </p>
                <div className="card">
                  <EnquiryForm />
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                <p className="text-gray-600 mb-8">Prefer to reach out directly? Here&apos;s how.</p>

                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="text-sm text-brand-600 hover:underline">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 bg-brand-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-sm text-gray-600">Monday – Saturday</p>
                  <p className="text-sm text-gray-600">9:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
