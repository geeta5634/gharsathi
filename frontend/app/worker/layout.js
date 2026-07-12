"use client";

import Sidebar from '../../components/Sidebar';
import { FaHome, FaBell, FaCalendarCheck, FaMoneyBillWave, FaUser } from 'react-icons/fa';

const links = [
  { href: '/worker', label: 'Dashboard', icon: FaHome },
  { href: '/worker/new-bookings', label: 'New Bookings', icon: FaBell },
  { href: '/worker/bookings', label: 'My Bookings', icon: FaCalendarCheck },
  { href: '/worker/earnings', label: 'Earnings', icon: FaMoneyBillWave },
  { href: '/worker/profile', label: 'Profile', icon: FaUser },
];

export default function WorkerLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar links={links} title="Worker Portal" />
      <main className="flex-1 p-6 md:p-8 bg-gray-50">{children}</main>
    </div>
  );
}
