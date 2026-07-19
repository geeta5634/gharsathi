"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import BookingCard from '@/components/BookingCard';
import { useBookings, useWorkerAction } from '@/lib/hooks';
import { BookingCardSkeleton } from '@/components/Skeletons';
import { FaPhone, FaPlayCircle, FaCheckCircle, FaCalendarCheck, FaSpinner } from 'react-icons/fa';

const filters = ['All', 'Active', 'Completed', 'Cancelled'];

const activeStatuses = ['accepted', 'en_route', 'in_progress'];

export default function WorkerBookings() {
  const { data: bookings = [], isLoading } = useBookings();
  const [filter, setFilter] = useState('All');
  const workerAction = useWorkerAction();

  const updateStatus = (id, action) => {
    workerAction.mutate({ id, action }, {
      onSuccess: () => toast.success(`Booking ${action}`),
      onError: () => toast.error('Update failed'),
    });
  };

  const filtered = filter === 'All' ? bookings
    : filter === 'Active' ? bookings.filter(b => activeStatuses.includes(b.status))
    : bookings.filter(b => b.status === filter.toLowerCase());

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
        <div className="card text-center py-12 text-gray-500"><FaCalendarCheck className="text-4xl text-gray-300 mx-auto mb-3" /> No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <BookingCard key={b._id} booking={b} actions={
              <>
                {b.customer?.phone && (
                  <a href={`tel:${b.customer.phone}`} className="text-sm bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary-100">
                    <FaPhone /> Call
                  </a>
                )}
                {b.status === 'accepted' && (
                  <button onClick={() => updateStatus(b._id, 'start')} disabled={workerAction.isPending} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100">
                    {workerAction.isPending ? <FaSpinner className="animate-spin" /> : <FaPlayCircle />} Start Service
                  </button>
                )}
                {b.status === 'in_progress' && (
                  <button onClick={() => updateStatus(b._id, 'complete')} disabled={workerAction.isPending} className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-100">
                    {workerAction.isPending ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Complete
                  </button>
                )}
              </>
            } />
          ))}
        </div>
      )}
    </div>
  );
}
