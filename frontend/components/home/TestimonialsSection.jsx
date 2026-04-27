import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    quote:
      'CozyHub helped us go from zero to ₹15L/month on Amazon within 4 months. Their onboarding process is seamless and the team is extremely responsive.',
    name: 'Dileep Kaibadi',
    role: 'Owner, CozyHub Commerce',
    avatar: 'DK',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="section-title mt-2">What Our Clients Say</h2>
          <p className="section-subtitle">
            Trusted by 500+ businesses across India to grow their online presence.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="card flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
