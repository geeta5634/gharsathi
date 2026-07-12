"use client";

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import BookingCard from '../../../components/BookingCard';
import { FaSpinner, FaCalendarCheck } from 'react-icons/fa';

const filters = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data.bookings || res.data || []);
      } catch {
        setBookings([
          { _id: 'b1', serviceType: 'Plumber', status: 'completed', scheduledDate: '2024-01-15', totalAmount: 199, worker: { name: 'Rajesh Kumar' }, address: '123 MG Road, Mumbai' },
          { _id: 'b2', serviceType: 'Electrician', status: 'pending', scheduledDate: '2024-01-20', totalAmount: 179, worker: { name: 'Amit Sharma' }, address: '45 Nehru Nagar, Delhi' },
          { _id: 'b3', serviceType: 'House Cleaning', status: 'active', scheduledDate: '2024-01-18', totalAmount: 149, worker: { name: 'Priya Devi' }, address: '78 Gandhi Street, Pune' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = filter === 'All' ? bookings : bookings.filter((b) => b.status?.toLowerCase() === filter.toLowerCase());

  return (
    <div>
      <h1 className="page-header">My Bookings</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500"><FaSpinner className="animate-spin text-2xl mx-auto mb-2" /> Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <FaCalendarCheck className="text-4xl text-gray-300 mx-auto mb-3" />
          No bookings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => <BookingCard key={b._id} booking={b} />)}
        </div>
      )}
    </div>
  );
}
