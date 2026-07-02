import Link from 'next/link';
import {
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineClock,
  HiOutlineCurrencyRupee, HiOutlineStar, HiOutlineHeart,
  HiOutlineSupport, HiOutlineTruck, HiOutlineHome,
  HiOutlineColorSwatch, HiOutlineSparkles, HiOutlineUserGroup,
  HiOutlinePhone, HiOutlineChevronRight, HiOutlineAdjustments,
  HiOutlineScissors, HiOutlineBeaker,
} from 'react-icons/hi';

const services = [
  { icon: HiOutlineSupport, name: 'Plumber', desc: 'Fix leaks, install pipes, water heater repair', price: '₹199' },
  { icon: HiOutlineLightningBolt, name: 'Electrician', desc: 'Wiring, switchboard, fan & light installation', price: '₹199' },
  { icon: HiOutlineTruck, name: 'Driver', desc: 'Verified drivers for your family needs', price: '₹299/hr' },
  { icon: HiOutlineHeart, name: 'Maid', desc: 'Trusted house help for daily chores', price: '₹399/day' },
  { icon: HiOutlineScissors, name: 'Carpenter', desc: 'Furniture repair, door fitting, custom work', price: '₹349' },
  { icon: HiOutlineColorSwatch, name: 'Painter', desc: 'Interior & exterior painting services', price: '₹499' },
  { icon: HiOutlineSparkles, name: 'Cleaner', desc: 'Deep cleaning, sanitization, carpet wash', price: '₹299' },
  { icon: HiOutlineAdjustments, name: 'More Services', desc: 'AC repair, pest control, plumbing & more', price: 'Varies' },
];

const whyChooseUs = [
  { icon: HiOutlineShieldCheck, title: 'Verified Professionals', desc: 'Every worker undergoes background verification and skill testing.' },
  { icon: HiOutlineClock, title: '15-Minute Emergency', desc: 'Priority dispatch for urgent home repairs. Round the clock.' },
  { icon: HiOutlineCurrencyRupee, title: 'Transparent Pricing', desc: 'No hidden charges. Know the exact cost before booking.' },
  { icon: HiOutlineStar, title: 'Quality Guarantee', desc: 'Not satisfied? We will redo the service or refund your money.' },
  { icon: HiOutlineHeart, title: 'Trust Score System', desc: 'Real ratings from real neighbors. Choose with confidence.' },
  { icon: HiOutlineLightningBolt, title: 'AI Problem Detection', desc: 'Snap a photo. Our AI identifies the issue instantly.' },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '5K+', label: 'Verified Workers' },
  { value: '15 min', label: 'Avg. Response Time' },
  { value: '4.8', label: 'Avg. Rating' },
];

const testimonials = [
  { name: 'Priya Sharma', location: 'Delhi', text: 'My geyser burst at midnight. GharSathi had a plumber at my door in 12 minutes! Absolutely lifesaving.', rating: 5 },
  { name: 'Rahul Verma', location: 'Noida', text: 'The AI photo scan diagnosed my AC issue before the technician arrived. He came prepared and fixed it in 20 mins.', rating: 5 },
  { name: 'Anjali Gupta', location: 'Gurgaon', text: 'I love the health record feature. I can track my maid\'s health checkups right from the app. Very reassuring.', rating: 5 },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                <HiOutlineLightningBolt className="w-5 h-5 text-accent-400" />
                <span className="text-sm font-medium">15-Minute Emergency Service</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Har Ghar Ka{' '}
                <span className="text-accent-400">Sathi</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg">
                Your trusted platform for verified home service professionals.
                Book plumbers, electricians, drivers, maids & more — instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking" className="btn-primary text-center text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  Book a Service <HiOutlineChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/workers" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all text-center">
                  Browse Professionals
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-8 text-sm text-gray-400">
                <span className="flex items-center gap-1"><HiOutlineShieldCheck className="w-4 h-4 text-green-400" /> Verified</span>
                <span className="flex items-center gap-1"><HiOutlineShieldCheck className="w-4 h-4 text-green-400" /> Safe</span>
                <span className="flex items-center gap-1"><HiOutlineShieldCheck className="w-4 h-4 text-green-400" /> On Time</span>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="gradient-accent rounded-2xl p-8 rotate-3">
                <div className="bg-white/10 rounded-xl p-6 -rotate-3">
                  <div className="space-y-4">
                    {['Plumber - ₹199', 'Electrician - ₹199', 'Cleaner - ₹299'].map((item, i) => (
                      <div key={i} className="bg-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
                        <span>{item}</span>
                        <HiOutlineChevronRight className="w-4 h-4" />
                      </div>
                    ))}
                    <div className="bg-accent-500 rounded-lg px-4 py-3 text-center font-semibold cursor-pointer hover:bg-accent-600 transition">
                      Book Now — Emergency Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-accent-400">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Choose from a wide range of professional home services at transparent prices.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.name} href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="card group cursor-pointer text-center hover:border-accent-500 hover:border-2 transition-all">
                    <div className="w-14 h-14 mx-auto gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.desc}</p>
                    <p className="text-accent-500 font-bold mt-3">Starting {service.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="gradient-accent text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <HiOutlineLightningBolt className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Emergency Service Available 24/7</h3>
                <p className="text-accent-100">Guaranteed 15-minute response for urgent home repairs.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-6 py-3">
                <HiOutlinePhone className="w-6 h-6" />
                <span className="font-bold text-lg">+91 1800-123-GHAR</span>
              </div>
              <Link href="/booking?emergency=true" className="bg-white text-accent-600 font-bold py-3 px-6 rounded-lg hover:bg-accent-50 transition">
                Request Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose GharSathi?</h2>
            <p className="section-subtitle">We are built on trust, speed, and transparency.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card flex gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Trusted by thousands of households across India.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiOutlineStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary-500">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            Ready to Experience the <span className="text-accent-400">GharSathi</span> Difference?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 50,000+ happy households. Book a verified professional today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking" className="btn-primary text-lg px-10 py-4">
              Book a Service
            </Link>
            <Link href="/membership" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-10 rounded-lg transition-all text-lg">
              View Membership Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
