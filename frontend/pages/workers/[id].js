import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  HiOutlineStar, HiOutlineShieldCheck, HiOutlineLocationMarker,
  HiOutlinePhone, HiOutlineChat, HiOutlineCheckCircle,
  HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineClock,
  HiOutlineChevronLeft,
} from 'react-icons/hi';

const workerData = {
  1: { name: 'Rajesh Kumar', service: 'Plumber', exp: '8 years', rating: 4.8, jobs: 1250, price: '₹199', location: 'Delhi, India', verified: true, available: true, img: 'RK', phone: '+91 98765 43210', about: 'Expert plumber with 8+ years of experience in residential and commercial plumbing. Specialized in pipe fitting, water heater installation, drainage systems, and bathroom renovation.' },
  2: { name: 'Suresh Patel', service: 'Electrician', exp: '12 years', rating: 4.9, jobs: 2100, price: '₹199', location: 'Noida, India', verified: true, available: true, img: 'SP', phone: '+91 98765 43211', about: 'Master electrician with over a decade of experience. Handles wiring, switchboard installation, fan & light fitting, and complete home electrification.' },
  3: { name: 'Amit Singh', service: 'Carpenter', exp: '6 years', rating: 4.6, jobs: 876, price: '₹349', location: 'Delhi, India', verified: true, available: false, img: 'AS', phone: '+91 98765 43212', about: 'Skilled carpenter specializing in furniture repair, modular kitchen installation, door fitting, and custom woodwork.' },
};

const reviews = [
  { name: 'Rahul Verma', rating: 5, text: 'Excellent work! Fixed my leaking pipe in 15 minutes. Very professional.', date: '2 days ago' },
  { name: 'Anjali Gupta', rating: 5, text: 'On time, well-mannered, and did a thorough job. Highly recommend.', date: '1 week ago' },
  { name: 'Deepak Yadav', rating: 4, text: 'Good service. Had to wait a bit but the quality was great.', date: '2 weeks ago' },
];

export default function WorkerProfile() {
  const router = useRouter();
  const { id } = router.query;
  const worker = workerData[id] || workerData[1];

  if (!worker) return <div className="p-8 text-center">Worker not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/workers" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <HiOutlineChevronLeft className="w-4 h-4" /> Back to Professionals
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero */}
          <div className="gradient-hero text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                  {worker.img}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{worker.name}</h1>
                  <p className="text-primary-200">{worker.service}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="trust-badge-verified"><HiOutlineShieldCheck className="w-3 h-3" /> Verified</span>
                    <span className="trust-badge-safe">Safe</span>
                    <span className="trust-badge-ontime">On Time</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-accent-400">{worker.price}</div>
                <div className="text-sm text-primary-200">Starting price</div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-800">{worker.rating}</div>
                <div className="text-sm text-gray-500">Rating</div>
                <div className="flex justify-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiOutlineStar key={i} className={`w-4 h-4 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-800">{worker.jobs.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Jobs Done</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-800">{worker.exp}</div>
                <div className="text-sm text-gray-500">Experience</div>
              </div>
            </div>

            {/* About */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">About</h3>
              <p className="text-gray-600">{worker.about}</p>
            </div>

            {/* Location & Availability */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1"><HiOutlineLocationMarker className="w-4 h-4" /> {worker.location}</div>
              <div className="flex items-center gap-1"><HiOutlinePhone className="w-4 h-4" /> {worker.phone}</div>
              {worker.available && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Available Now
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Link href={`/booking?worker=${id}`} className="flex-1 btn-primary text-center py-3">
                Book Now — {worker.price}
              </Link>
              <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
                <HiOutlineChat className="w-5 h-5" /> Chat
              </button>
              <button className="px-4 border-2 border-accent-500 text-accent-500 rounded-lg hover:bg-accent-500 hover:text-white transition">
                <HiOutlinePhone className="w-5 h-5" />
              </button>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.name} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">{r.name[0]}</div>
                      <span className="font-medium text-sm">{r.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <HiOutlineStar key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">{r.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
