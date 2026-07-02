import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineSupport, HiOutlineLightningBolt, HiOutlineTruck, HiOutlineHeart,
  HiOutlineScissors, HiOutlineColorSwatch, HiOutlineSearch,
  HiOutlineChevronRight, HiOutlineFilter, HiOutlineAdjustments,
  HiOutlineSparkles, HiOutlineBeaker, HiOutlineHome,
} from 'react-icons/hi';

const allServices = [
  { icon: HiOutlineSupport, name: 'Plumber', desc: 'Leak repair, pipe installation, water heater, tap fitting', price: '₹199', workers: 234, rating: 4.8 },
  { icon: HiOutlineLightningBolt, name: 'Electrician', desc: 'Wiring, switchboard, fan, light, inverter installation', price: '₹199', workers: 189, rating: 4.7 },
  { icon: HiOutlineTruck, name: 'Driver', desc: 'Personal driver, family chauffeur, school pickup', price: '₹299/hr', workers: 156, rating: 4.6 },
  { icon: HiOutlineHeart, name: 'Maid', desc: 'Daily housekeeping, cooking, elderly care, babysitting', price: '₹399/day', workers: 312, rating: 4.5 },
  { icon: HiOutlineScissors, name: 'Carpenter', desc: 'Furniture repair, door fitting, modular kitchen, wardrobes', price: '₹349', workers: 98, rating: 4.7 },
  { icon: HiOutlineColorSwatch, name: 'Painter', desc: 'Interior painting, exterior painting, texture, waterproofing', price: '₹499', workers: 145, rating: 4.6 },
  { icon: HiOutlineSparkles, name: 'Cleaner', desc: 'Deep cleaning, sofa wash, carpet cleaning, sanitization', price: '₹299', workers: 178, rating: 4.4 },
  { icon: HiOutlineBeaker, name: 'AC Repair', desc: 'AC service, gas refill, installation, repair', price: '₹399', workers: 87, rating: 4.7 },
  { icon: HiOutlineAdjustments, name: 'Pest Control', desc: 'Cockroach, mosquito, termite, bed bug treatment', price: '₹599', workers: 65, rating: 4.5 },
  { icon: HiOutlineSupport, name: 'Plumbing', desc: 'Overhead tank, drainage, bathroom fitting, solar', price: '₹249', workers: 123, rating: 4.6 },
  { icon: HiOutlineHome, name: 'Interior Design', desc: 'Modular kitchen, wardrobes, false ceiling, wall design', price: '₹999', workers: 45, rating: 4.8 },
  { icon: HiOutlineHeart, name: 'Elderly Care', desc: 'Companionship, medication, daily routine assistance', price: '₹499/day', workers: 34, rating: 4.9 },
];

const categories = ['All', 'Repair', 'Cleaning', 'Driving', 'Caregiving', 'Painting', 'Installation'];

export default function Services() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = allServices.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                       s.desc.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || s.desc.includes(activeCategory);
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Our Services</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Browse all home services. Transparent pricing, verified professionals, instant booking.
            </p>
            <div className="max-w-xl mx-auto mt-8 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-accent-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'All' ? <HiOutlineFilter className="w-4 h-4 inline mr-1" /> : null}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 lg:py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.name} href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="card group cursor-pointer h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="trust-badge-verified">★ {service.rating}</span>
                          <span className="text-gray-400">{service.workers} workers</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 flex-1">{service.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent-500 font-bold text-lg">{service.price}</span>
                      <span className="text-primary-500 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Book Now <HiOutlineChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No services found. Try a different search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
