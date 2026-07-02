import Link from 'next/link';
import {
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineStar,
  HiOutlineHeart, HiOutlineUserGroup, HiOutlineCamera,
  HiOutlineChartBar, HiOutlineClipboardCheck, HiOutlineGlobe,
  HiOutlineSparkles, HiOutlineTrendingUp, HiOutlineLockClosed,
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineCamera,
    title: 'AI Problem Detection',
    desc: 'Snap a photo of the issue and our AI identifies the problem instantly. No more guessing games.',
    color: 'from-purple-500 to-purple-700',
    details: [
      'Photo-based diagnosis using computer vision',
      'Instant problem identification & severity assessment',
      'Estimated repair time and cost prediction',
      'Automatically assigns the right professional',
    ],
  },
  {
    icon: HiOutlineChartBar,
    title: 'Worker Trust Score',
    desc: 'Every worker has a dynamic trust score based on verification, job completion, ratings, and community feedback.',
    color: 'from-green-500 to-green-700',
    details: [
      'Background verified with government ID',
      'Real-time rating from every completed job',
      'Skill certification and periodic assessments',
      'Community reputation from neighborhood network',
    ],
  },
  {
    icon: HiOutlineHeart,
    title: 'Health Record System',
    desc: 'For domestic workers (maids, drivers, caregivers) — track health checkups, vaccinations, and medical history.',
    color: 'from-pink-500 to-pink-700',
    details: [
      'Digital health record for every registered worker',
      'Quarterly health checkup reminders',
      'Vaccination & medical history tracking',
      'Private & secure — only shared with consent',
    ],
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Neighborhood Network',
    desc: 'Connect with your community. Share recommendations, ratings, and tips about local service professionals.',
    color: 'from-blue-500 to-blue-700',
    details: [
      'Local community forum for each area',
      'Share worker recommendations with neighbors',
      'Verified reviews from people you know',
      'Group booking discounts for colony events',
    ],
  },
  {
    icon: HiOutlineLightningBolt,
    title: '15-Minute Emergency',
    desc: 'Critical home emergency? Get a verified professional dispatched to your doorstep within 15 minutes.',
    color: 'from-accent-500 to-accent-700',
    details: [
      'Round-the-clock emergency hotline',
      'Priority dispatch algorithm',
      'Real-time GPS tracking of worker arrival',
      'Automated escalation if delayed beyond 15 min',
    ],
  },
  {
    icon: HiOutlineSparkles,
    title: 'Smart Scheduling',
    desc: 'AI-powered scheduling that optimizes worker routes and suggests the best time slots for your booking.',
    color: 'from-cyan-500 to-cyan-700',
    details: [
      'Intelligent time slot suggestions',
      'Optimal route planning for workers',
      'Automated reminders for both parties',
      'Reschedule with one tap',
    ],
  },
  {
    icon: HiOutlineTrendingUp,
    title: 'Transparent Pricing Engine',
    desc: 'Know the exact cost before you book. Our pricing model is 100% transparent with no hidden charges.',
    color: 'from-emerald-500 to-emerald-700',
    details: [
      'Upfront pricing for all service categories',
      'Real-time cost estimator with AI',
      'No surge pricing for regular services',
      'Money-back guarantee if overcharged',
    ],
  },
  {
    icon: HiOutlineLockClosed,
    title: 'Safety & Security',
    desc: 'Every booking is secured. Workers are tracked, SOS features are available, and all payments are encrypted.',
    color: 'from-slate-500 to-slate-700',
    details: [
      'End-to-end encrypted communication',
      'Live location tracking during service',
      'SOS emergency button in app',
      'Secured payment gateway integration',
    ],
  },
];

export default function Features() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Powerful <span className="text-accent-400">Features</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Technology-driven solutions that make home service booking smarter, safer, and faster.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isReversed = index % 2 === 1;
              return (
                <div key={feature.title} className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}>
                  <div className="flex-1">
                    <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">{feature.title}</h2>
                    <p className="text-gray-500 mb-4">{feature.desc}</p>
                    <ul className="space-y-2">
                      {feature.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                          <HiOutlineShieldCheck className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`flex-1 w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ${isReversed ? 'lg:ml-0' : ''}`}>
                    <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${feature.color} mb-6`}></div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">How it works</div>
                          <div className="text-xs text-gray-400">Simple & intuitive</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {index === 0 && 'Upload a photo → AI scans → Problem identified → Professional assigned'}
                        {index === 1 && 'ID verification → Skill test → Job performance → Trust score computed'}
                        {index === 2 && 'Worker registers → Health check → Records updated → Shared with consent'}
                        {index === 3 && 'Join community → Share reviews → Help neighbors → Earn rewards'}
                        {index === 4 && 'Call emergency → Instant dispatch → Track arrival → Service in 15 min'}
                        {index === 5 && 'Set preference → AI suggests time → Confirm booking → Smart reminder'}
                        {index === 6 && 'Select service → See price → Book with confidence → Pay after service'}
                        {index === 7 && 'End-to-end encryption → Live tracking → SOS button → Secure payments'}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">4.8</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">2,500+ active users</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            Ready for a Smarter Home Service Experience?
          </h2>
          <p className="text-lg text-accent-100 mb-8 max-w-2xl mx-auto">
            All these features and more are available when you book through GharSathi.
          </p>
          <Link href="/booking" className="bg-white text-accent-600 font-bold py-4 px-10 rounded-lg hover:bg-accent-50 transition inline-block">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
