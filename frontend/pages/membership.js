import Link from 'next/link';
import {
  HiOutlineCheck, HiOutlineLightningBolt, HiOutlineShieldCheck,
  HiOutlineStar, HiOutlineHeart, HiOutlineClock,
  HiOutlineCurrencyRupee, HiOutlinePhone, HiOutlineFire,
} from 'react-icons/hi';

const plans = [
  {
    name: 'Basic',
    price: '₹99',
    period: '/month',
    color: 'from-blue-500 to-blue-600',
    badge: 'Starter',
    popular: false,
    features: [
      'Up to 2 service bookings/month',
      'Standard response time (2-4 hrs)',
      'Phone support',
      'Verified professionals',
      'Transparent pricing',
    ],
    excluded: ['Priority dispatch', 'Emergency 15-min service', 'AI photo diagnosis', 'Health records', 'Premium support'],
  },
  {
    name: 'Premium',
    price: '₹199',
    period: '/month',
    color: 'from-accent-500 to-accent-600',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Up to 5 service bookings/month',
      'Priority response (30-60 min)',
      'Priority phone & chat support',
      'Verified professionals with trust scores',
      'AI photo-based problem detection',
      'Worker health record access',
      'Free annual maintenance check',
    ],
    excluded: ['VIP emergency 15-min service', 'Dedicated relationship manager', 'Neighborhood network access'],
  },
  {
    name: 'VIP',
    price: '₹299',
    period: '/month',
    color: 'from-purple-600 to-purple-800',
    badge: 'Best Value',
    popular: false,
    features: [
      'Unlimited service bookings',
      '15-minute emergency dispatch',
      'VIP 24/7 dedicated support',
      'Top-rated verified professionals',
      'AI photo diagnosis + video call assist',
      'Full health record management',
      'Free annual maintenance & deep clean',
      'Neighborhood network access',
      'Dedicated relationship manager',
      'Exclusive member events & offers',
    ],
    excluded: [],
  },
];

const comparisons = [
  { feature: 'Service Bookings', basic: '2/month', premium: '5/month', vip: 'Unlimited' },
  { feature: 'Emergency Response', basic: '2-4 hrs', premium: '30-60 min', vip: '15 min' },
  { feature: 'AI Photo Diagnosis', basic: '—', premium: '✓', vip: '✓ + Video Call' },
  { feature: 'Health Records', basic: '—', premium: '✓', vip: '✓ Full Access' },
  { feature: 'Support Level', basic: 'Phone', premium: 'Phone + Chat', vip: '24/7 Dedicated' },
  { feature: 'Neighborhood Network', basic: '—', premium: '—', vip: '✓' },
  { feature: 'Annual Maintenance', basic: '—', premium: '✓', vip: '✓ + Deep Clean' },
];

const benefits = [
  { icon: HiOutlineCurrencyRupee, text: 'Save up to 40% on every service' },
  { icon: HiOutlineLightningBolt, text: 'Skip the queue with priority dispatch' },
  { icon: HiOutlineShieldCheck, text: 'Exclusive access to top-rated professionals' },
  { icon: HiOutlineStar, text: 'Free annual home maintenance check' },
  { icon: HiOutlineClock, text: 'Members-only emergency response' },
  { icon: HiOutlineHeart, text: 'Comprehensive health record management' },
];

export default function Membership() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Membership <span className="text-accent-400">Plans</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Unlock exclusive benefits, faster service, and premium features with GharSathi membership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <HiOutlineCurrencyRupee className="w-5 h-5 text-accent-400" />
              <span className="text-sm">Save up to 40% on every booking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <HiOutlineLightningBolt className="w-5 h-5 text-accent-400" />
              <span className="text-sm">15-minute emergency dispatch for VIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Ticker */}
      <section className="bg-primary-800 text-white py-4 overflow-hidden">
        <div className="flex animate-scroll space-x-12 whitespace-nowrap">
          {benefits.map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm">
              <b.icon className="w-4 h-4 text-accent-400" />
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan) => (
              <div key={plan.name} className={`card relative ${plan.popular ? 'ring-2 ring-accent-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-accent text-white px-4 py-1 rounded-full text-xs font-bold">
                    {plan.badge}
                  </div>
                )}

                <div className={`gradient-card text-white rounded-xl p-6 mb-6 ${plan.color}`}>
                  <div className="text-sm font-medium opacity-80 mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-sm opacity-80">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <HiOutlineCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </div>
                  ))}
                  {plan.excluded.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 opacity-40">
                      <HiOutlineCheck className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/booking"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Compare Plans</h2>
            <p className="section-subtitle">Find the perfect plan for your home.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600">Basic</th>
                  <th className="text-center py-4 px-4 font-semibold text-accent-500">Premium</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">VIP</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-700">{row.feature}</td>
                    <td className="text-center py-4 px-4 text-gray-500">{row.basic}</td>
                    <td className="text-center py-4 px-4 text-gray-700 font-medium">{row.premium}</td>
                    <td className="text-center py-4 px-4 text-purple-600 font-bold">{row.vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            Start Saving Today
          </h2>
          <p className="text-lg text-accent-100 mb-8 max-w-2xl mx-auto">
            Join GharSathi membership and transform how you manage your home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking" className="bg-white text-accent-600 font-bold py-4 px-10 rounded-lg hover:bg-accent-50 transition">
              Get Started Free
            </Link>
            <Link href="/features" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-10 rounded-lg transition">
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
