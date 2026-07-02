import { useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineStar, HiOutlineSearch, HiOutlineLocationMarker,
  HiOutlineFilter, HiOutlineChevronRight, HiOutlineShieldCheck,
  HiOutlinePhone, HiOutlineChat,
} from 'react-icons/hi';

const workers = [
  { id: 1, name: 'Rajesh Kumar', service: 'Plumber', exp: '8 years', rating: 4.8, jobs: 1250, price: '₹199', location: 'Delhi, India', verified: true, available: true, img: 'RK' },
  { id: 2, name: 'Suresh Patel', service: 'Electrician', exp: '12 years', rating: 4.9, jobs: 2100, price: '₹199', location: 'Noida, India', verified: true, available: true, img: 'SP' },
  { id: 3, name: 'Amit Singh', service: 'Carpenter', exp: '6 years', rating: 4.6, jobs: 876, price: '₹349', location: 'Delhi, India', verified: true, available: false, img: 'AS' },
  { id: 4, name: 'Vijay Sharma', service: 'Painter', exp: '10 years', rating: 4.7, jobs: 1567, price: '₹499', location: 'Gurgaon, India', verified: true, available: true, img: 'VS' },
  { id: 5, name: 'Priya Devi', service: 'Maid', exp: '5 years', rating: 4.5, jobs: 654, price: '₹399/day', location: 'Delhi, India', verified: true, available: true, img: 'PD' },
  { id: 6, name: 'Manoj Verma', service: 'Driver', exp: '15 years', rating: 4.8, jobs: 3456, price: '₹299/hr', location: 'Noida, India', verified: true, available: true, img: 'MV' },
  { id: 7, name: 'Sunita Gupta', service: 'Cleaner', exp: '4 years', rating: 4.4, jobs: 432, price: '₹299', location: 'Delhi, India', verified: true, available: false, img: 'SG' },
  { id: 8, name: 'Deepak Yadav', service: 'Plumber', exp: '7 years', rating: 4.7, jobs: 987, price: '₹199', location: 'Gurgaon, India', verified: true, available: true, img: 'DY' },
  { id: 9, name: 'Anita Sharma', service: 'Maid', exp: '6 years', rating: 4.6, jobs: 543, price: '₹399/day', location: 'Delhi, India', verified: true, available: true, img: 'AS2' },
  { id: 10, name: 'Ravi Kumar', service: 'Electrician', exp: '9 years', rating: 4.7, jobs: 1432, price: '₹199', location: 'Faridabad, India', verified: true, available: true, img: 'RK2' },
  { id: 11, name: 'Pooja Jain', service: 'Cleaner', exp: '3 years', rating: 4.3, jobs: 321, price: '₹299', location: 'Delhi, India', verified: true, available: true, img: 'PJ' },
  { id: 12, name: 'Mohammad Ali', service: 'Carpenter', exp: '11 years', rating: 4.9, jobs: 2134, price: '₹349', location: 'Noida, India', verified: true, available: true, img: 'MA' },
];

const services = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Maid', 'Driver', 'Cleaner'];

export default function Workers() {
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = workers
    .filter(w => {
      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                         w.service.toLowerCase().includes(search.toLowerCase());
      const matchService = filterService === 'All' || w.service === filterService;
      return matchSearch && matchService;
    })
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : b.jobs - a.jobs);

  return (
    <div>
      <section className="gradient-hero text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Our Professionals</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              All workers are verified, trained, and rated by real customers.
            </p>
            <div className="max-w-xl mx-auto mt-8 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-accent-500 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {services.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterService(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filterService === s ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 outline-none"
            >
              <option value="rating">Sort by Rating</option>
              <option value="jobs">Sort by Jobs Done</option>
            </select>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((worker) => (
              <div key={worker.id} className="card group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary-500 text-lg">{worker.img}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{worker.name}</h3>
                      <p className="text-sm text-gray-500">{worker.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-green-700">{worker.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="trust-badge-verified"><HiOutlineShieldCheck className="w-3 h-3" /> Verified</span>
                  <span className="trust-badge-safe">Safe</span>
                  <span className="trust-badge-ontime">On Time</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                  <div className="bg-gray-50 rounded-lg py-2">
                    <div className="font-semibold text-gray-800">{worker.exp}</div>
                    <div className="text-gray-400 text-xs">Experience</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <div className="font-semibold text-gray-800">{worker.jobs.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">Jobs Done</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <div className="font-semibold text-accent-500">{worker.price}</div>
                    <div className="text-gray-400 text-xs">Starting</div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <HiOutlineLocationMarker className="w-4 h-4 mr-1" />
                  {worker.location}
                  {worker.available && (
                    <span className="ml-auto flex items-center gap-1 text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Available
                    </span>
                  )}
                  {!worker.available && (
                    <span className="ml-auto flex items-center gap-1 text-gray-400">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Busy
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/workers/${worker.id}`} className="flex-1 btn-primary text-sm py-2 text-center">
                    Book Now
                  </Link>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <HiOutlineChat className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <HiOutlinePhone className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
