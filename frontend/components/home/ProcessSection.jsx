const steps = [
  {
    number: '01',
    title: 'Onboard',
    description: 'Share your business details. We set up your seller accounts on all target marketplaces within 7 days.',
    color: 'bg-blue-600',
  },
  {
    number: '02',
    title: 'Setup',
    description: 'Our team uploads and optimizes your product listings with high-quality images, SEO content, and competitive pricing.',
    color: 'bg-indigo-600',
  },
  {
    number: '03',
    title: 'Sell',
    description: 'Go live! We manage orders, handle customer queries, and ensure smooth fulfilment from day one.',
    color: 'bg-violet-600',
  },
  {
    number: '04',
    title: 'Scale',
    description: 'Analyse performance data, run ads, expand to new categories, and grow revenue month over month.',
    color: 'bg-purple-600',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="section-title mt-2">Simple 4-Step Process</h2>
          <p className="section-subtitle">
            From zero to selling online in less than a week.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 z-0 -translate-x-6" />
              )}
              <div className="relative z-10 card text-center">
                <div
                  className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
