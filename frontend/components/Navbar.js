"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaInfoCircle, FaCogs, FaEnvelope, FaThList } from 'react-icons/fa';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (profile?.role === 'admin') return '/admin';
    if (profile?.role === 'worker') return '/worker';
    return '/customer';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-primary-800">GharSathi</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
              <FaHome className="text-sm" /> Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
              <FaInfoCircle className="text-sm" /> About
            </Link>
            <Link href="/#services" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
              <FaCogs className="text-sm" /> Services
            </Link>
            <Link href="/listings" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
              <FaThList className="text-sm" /> Listings
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
              <FaEnvelope className="text-sm" /> Contact
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href={getDashboardLink()} className="btn-primary text-sm">
                  <FaUser className="inline mr-1" /> Dashboard
                </Link>
                <button onClick={logout} className="text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">Login</Link>
                <Link href="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-600">
            {mobileOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
              <FaHome /> Home
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
              <FaInfoCircle /> About
            </Link>
            <Link href="/#services" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
              <FaCogs /> Services
            </Link>
            <Link href="/listings" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
              <FaThList /> Listings
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2">
              <FaEnvelope /> Contact
            </Link>
            <hr className="my-2" />
            {user ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block py-2 text-primary-600 font-semibold">Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-red-600 font-medium w-full text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-primary-600 font-semibold">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="block btn-primary text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
