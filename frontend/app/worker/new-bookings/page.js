"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { FaSpinner, FaUser, FaMapMarkerAlt, FaCalendar, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';

export default function WorkerNewBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    api.get('/bookings/pending')
      .then(res => setBookings(res.data.bookings || res.data || []))
      .catch(() => {
        setBookings([
          { _id: 'nb1', serviceType: 'Plumber', totalAmount: 199, address: '123 MG Road, Mumbai', scheduledDate: '2024-01-20', scheduledTime: '10:00 AM', description: 'Leaking pipe in bathroom', customer: { name: 'Ravi Singh', phone: '+91 9876543210' } },
          { _id: 'nb2', serviceType: 'Electrician', totalAmount: 279, address: '45 Nehru Nagar, Delhi', scheduledDate: '2024-01-21', scheduledTime: '2:00 PM', description: 'Fan not working', isEmergency: true, customer: { name: 'Neha Gupta', phone: '+91 9123456780' } },
          { _id: 'nb3', serviceType: 'House Cleaning', totalAmount: 149, address: '78 Gandhi Street, Pune', scheduledDate: '2024-01-22', scheduledTime: '9:00 AM', description: 'Full home deep cleaning', customer: { name: 'Arun Mehta', phone: '+91 9988776655' } },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id) => {
    setActing(id);
    try {
      await api.put(`/bookings/${id}/accept`);
      setBookings(prev => prev.filter(b => b._id !== id));
      toast.success('Booking accepted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (id) => {
    setActing(id);
    try {
      await api.put(`/bookings/${id}/reject`);
      setBookings(prev => prev.filter(b => b._id !== id));
      toast.success('Booking rejected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActing(null);
    }
  };

  return (
    <div>
      <h1 className="page-header">New Bookings</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500"><FaSpinner className="animate-spin text-2xl mx-auto mb-2" /> Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <p className="text-lg">No new bookings available right now.</p>
          <p className="text-sm mt-2">We&apos;ll notify you when a new booking comes in.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{b.serviceType}</h3>
                    {b.isEmergency && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">Emergency</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FaUser className="text-primary-500" /> {b.customer?.name || 'Customer'}</div>
                    <div className="flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> ₹{b.totalAmount}</div>
                    <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" /> {b.address}</div>
                    <div className="flex items-center gap-2"><FaCalendar className="text-blue-500" /> {b.scheduledDate} {b.scheduledTime && `at ${b.scheduledTime}`}</div>
                  </div>
                  {b.description && <p className="text-sm text-gray-500 mt-2">📝 {b.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(b._id)} disabled={acting === b._id} className="btn-success text-sm flex items-center gap-1">
                    {acting === b._id ? <FaSpinner className="animate-spin" /> : <FaCheck />} Accept
                  </button>
                  <button onClick={() => handleReject(b._id)} disabled={acting === b._id} className="btn-danger text-sm flex items-center gap-1">
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
