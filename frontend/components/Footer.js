import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-white">GharSathi</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for all home services. Safe, verified, and always on time.
            </p>

          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link href="/#services" className="hover:text-primary-400 transition-colors">Services</Link></li>
              <li><Link href="/register" className="hover:text-primary-400 transition-colors">Become a Worker</Link></li>
              <li><Link href="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/customer/book" className="hover:text-primary-400 transition-colors">Book a Service</Link></li>
              <li><Link href="/listings" className="hover:text-primary-400 transition-colors">All Services</Link></li>
              <li><Link href="/register" className="hover:text-primary-400 transition-colors">Become a Worker</Link></li>
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FaPhone className="text-primary-400" /> +91 8690094699</li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-primary-400" /> support@gharsathi.com</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary-400" /> Jodhpur, Rajasthan</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} GharSathi. All rights reserved. Made with ❤ for Indian homes.</p>
      </div>
    </footer>
  );
}
