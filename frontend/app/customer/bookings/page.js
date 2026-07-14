"use client";

import { useState } from 'react';
import BookingCard from '@/components/BookingCard';
import { useBookings } from '@/lib/hooks';
import { BookingCardSkeleton } from '@/components/Skeletons';
import { FaCalendarCheck } from 'react-icons/fa';

const filters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

export default function CustomerBookings() {
  const { data: bookings = [], isLoading } = useBookings();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status?.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <h1 className="page-header">My Bookings</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <FaCalendarCheck className="text-4xl text-gray-300 mx-auto mb-3" />
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => <BookingCard key={b._id} booking={b} />)}
        </div>
      )}
    </div>
  );
}
