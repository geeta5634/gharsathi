import { useRouter } from 'next/router';
import Link from 'next/link';
import { HiOutlineChevronLeft, HiOutlineStar, HiOutlineShieldCheck, HiOutlineClock, HiOutlineCheck } from 'react-icons/hi';

const serviceData = {
  'plumber': { name: 'Plumber', desc: 'Expert plumbing services for your home. From fixing leaks to installing new fixtures.', price: '₹199', workers: 234, rating: 4.8, features: ['Leak repair & detection', 'Pipe installation & replacement', 'Water heater service', 'Drainage & sewage cleaning', 'Bathroom & kitchen fitting', 'Emergency plumbing support'] },
  'electrician': { name: 'Electrician', desc: 'Professional electrical solutions for all your home and office needs.', price: '₹199', workers: 189, rating: 4.7, features: ['Wiring & rewiring', 'Switchboard installation', 'Fan & light fitting', 'Inverter installation', 'MCB & DB box repair', 'Home electrification'] },
  'driver': { name: 'Driver', desc: 'Verified, trained drivers for your daily commute and family transportation needs.', price: '₹299/hr', workers: 156, rating: 4.6, features: ['Personal chauffeur', 'School pickup & drop', 'Family outings', 'Airport transfers', 'Full-time/part-time', 'Verified & insured'] },
  'maid': { name: 'Maid', desc: 'Trusted house help for daily chores, cooking, and caregiving services.', price: '₹399/day', workers: 312, rating: 4.5, features: ['Daily housekeeping', 'Cooking & meal prep', 'Elderly care', 'Babysitting', 'Deep cleaning', 'Health verified'] },
  'carpenter': { name: 'Carpenter', desc: 'Skilled carpenters for furniture, doors, and custom woodwork.', price: '₹349', workers: 98, rating: 4.7, features: ['Furniture repair', 'Door & window fitting', 'Modular kitchen', 'Wardrobe installation', 'Custom woodwork', 'Polishing & finishing'] },
  'painter': { name: 'Painter', desc: 'Transform your space with professional painting services.', price: '₹499', workers: 145, rating: 4.6, features: ['Interior painting', 'Exterior painting', 'Texture & design', 'Waterproofing', 'Wood polishing', 'Wallpaper installation'] },
  'cleaner': { name: 'Cleaner', desc: 'Deep cleaning and sanitization services for a healthier home.', price: '₹299', workers: 178, rating: 4.4, features: ['Deep cleaning', 'Sofa & carpet wash', 'Bathroom scrubbing', 'Kitchen degreasing', 'Sanitization', 'Move-in/out cleaning'] },
};

export default function ServiceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const service = serviceData[id] || serviceData['plumber'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <HiOutlineChevronLeft className="w-4 h-4" /> Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="gradient-hero text-white p-8 lg:p-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold mb-2">{service.name}</h1>
                <p className="text-primary-200 text-lg max-w-lg">{service.desc}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-accent-400">{service.price}</div>
                <div className="text-sm text-primary-200">Starting price</div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <span className="flex items-center gap-1"><HiOutlineStar className="w-5 h-5 text-yellow-400 fill-current" /> {service.rating}</span>
              <span className="text-primary-200">|</span>
              <span>{service.workers} Verified Workers</span>
              <span className="text-primary-200">|</span>
              <span className="flex items-center gap-1"><HiOutlineClock className="w-5 h-5" /> 15-min emergency available</span>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <h3 className="text-xl font-bold mb-4">What&apos;s Included</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <HiOutlineCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm rounded-xl p-4 mb-8">
              <HiOutlineShieldCheck className="w-5 h-5" />
              <span>All {service.name.toLowerCase()} professionals are background-verified, trained, and insured.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/booking" className="flex-1 btn-primary text-center py-3">
                Book {service.name} — {service.price}
              </Link>
              <Link href="/workers" className="flex-1 btn-outline text-center py-3">
                View All {service.name}s
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
