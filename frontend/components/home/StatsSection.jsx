const stats = [
  { value: '500+', label: 'Businesses Onboarded', description: 'Across 15+ product categories' },
  { value: '10K+', label: 'Products Listed', description: 'On Amazon & Flipkart' },
  { value: '98%', label: 'Client Retention', description: 'Year-over-year satisfaction' },
  { value: '7 Days', label: 'Onboarding Time', description: 'From signup to first sale' },
];

export default function StatsSection() {
  return (
    <section className="bg-brand-600 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm font-semibold text-blue-100 mb-1">{stat.label}</div>
              <div className="text-xs text-blue-200 hidden sm:block">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
