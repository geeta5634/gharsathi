"use client";

import Sidebar from '../../components/Sidebar';
import { FaHome, FaCalendarCheck, FaCrown, FaUser } from 'react-icons/fa';

const links = [
  { href: '/customer', label: 'Home', icon: FaHome },
  { href: '/customer/bookings', label: 'My Bookings', icon: FaCalendarCheck },
  { href: '/customer/membership', label: 'Membership', icon: FaCrown },
  { href: '/customer/profile', label: 'Profile', icon: FaUser },
];

export default function CustomerLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar links={links} title="Customer Portal" />
      <main className="flex-1 p-6 md:p-8 bg-gray-50">{children}</main>
    </div>
  );
}
