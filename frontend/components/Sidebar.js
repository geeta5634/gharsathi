"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function Sidebar({ links, title }) {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-white border-r shadow-sm flex-shrink-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-primary-600 transition-colors text-sm">
          <FaArrowLeft /> Back to Home
        </Link>
        <h2 className="text-lg font-bold text-gray-800 mb-6">{title}</h2>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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
  );
}
