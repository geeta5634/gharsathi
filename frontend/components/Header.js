import { useState } from 'react';
import Link from 'next/link';
import { HiOutlineMenu, HiOutlineX, HiOutlineBell, HiOutlineUser, HiOutlineLocationMarker } from 'react-icons/hi';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/workers', label: 'Professionals' },
  { href: '/membership', label: 'Membership' },
  { href: '/features', label: 'Features' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-extrabold text-primary-500">
              Ghar<span className="text-accent-500">Sathi</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-500 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-primary-500 transition-colors">
              <HiOutlineBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <HiOutlineLocationMarker className="w-4 h-4 text-accent-500" />
              <span>Delhi, India</span>
            </div>
            <Link href="/worker/login" className="btn-outline text-sm py-2 px-4">
              Worker Login
            </Link>
            <Link href="/booking" className="btn-primary text-sm py-2 px-4">
              Book Now
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-primary-500 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              <Link href="/worker/login" className="block w-full text-center btn-outline text-sm py-2">
                Worker Login
              </Link>
              <Link href="/booking" className="block w-full text-center btn-primary text-sm py-2">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
