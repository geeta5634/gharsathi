"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import BookingCard from '@/components/BookingCard';
import StatusBadge from '@/components/StatusBadge';
import { FaSpinner, FaPhone, FaPlayCircle, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';

const filters = ['All', 'Active', 'Completed', 'Cancelled'];

export default function WorkerBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/bookings')
      .then(res => setBookings(res.data.data || []))
      .catch(() => {
        setBookings([
          { _id: 'wb1', serviceType: 'Plumber', status: 'active', scheduledDate: '2024-01-18', totalAmount: 199, customer: { name: 'Ravi Singh', phone: '+91 9876543210' }, address: '123 MG Road, Mumbai' },
          { _id: 'wb2', serviceType: 'Electrician', status: 'completed', scheduledDate: '2024-01-15', totalAmount: 179, customer: { name: 'Neha Gupta', phone: '+91 9123456780' }, address: '45 Nehru Nagar, Delhi' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

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

      {loading ? (
        <div className="text-center py-12 text-gray-500"><FaSpinner className="animate-spin text-2xl mx-auto mb-2" /> Loading...</div>
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
                {b.status === 'confirmed' && (
                  <button onClick={() => updateStatus(b._id, 'active')} disabled={updating === b._id} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100">
                    {updating === b._id ? <FaSpinner className="animate-spin" /> : <FaPlayCircle />} Start Service
                  </button>
                )}
                {b.status === 'active' && (
                  <button onClick={() => updateStatus(b._id, 'completed')} disabled={updating === b._id} className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-100">
                    {updating === b._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Complete
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
