import {
  ShoppingBagIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  TruckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    icon: ShoppingBagIcon,
    title: 'Marketplace Onboarding',
    description:
      'Complete seller account setup on Amazon, Flipkart, Meesho, and more. We handle verification, GST setup, and brand registry.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: ArchiveBoxIcon,
    title: 'Inventory Management',
    description:
      'Real-time inventory tracking across multiple warehouses. Automated reorder alerts and stock sync across all marketplaces.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Listing Optimization',
    description:
      'SEO-optimized product titles, bullet points, and descriptions. A+ Content creation and keyword research to drive organic traffic.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics & Insights',
    description:
      'Deep-dive performance reports on sales, traffic, and conversions. Competitor analysis and pricing intelligence.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: TruckIcon,
    title: 'Order Management',
    description:
      'Streamlined order processing, returns management, and fulfilment coordination across FBA, FBF, and self-ship models.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: UserGroupIcon,
    title: 'Dedicated Support',
    description:
      'Assigned account manager for every client. Weekly growth calls, escalation support, and marketplace policy guidance.',
    color: 'bg-indigo-50 text-indigo-600',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            What We Do
          </span>
          <h2 className="section-title mt-2">End-to-End Ecommerce Solutions</h2>
          <p className="section-subtitle">
            Everything you need to launch, manage, and scale your business on India&apos;s top
            marketplaces.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="card hover:shadow-md transition-shadow group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${svc.color}`}
              >
                <svc.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                {svc.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
