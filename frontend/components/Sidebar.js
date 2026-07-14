"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

export default function Sidebar({ links, title, isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-white border-r shadow-sm flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm">
              <FaArrowLeft /> Back to Home
            </Link>
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-6">{title}</h2>
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                >
                  <link.icon className="text-lg" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
