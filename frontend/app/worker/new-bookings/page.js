"use client";

import toast from 'react-hot-toast';
import { useWorkerAvailableBookings, useWorkerAction } from '@/lib/hooks';
import { BookingCardSkeleton } from '@/components/Skeletons';
import { FaUser, FaMapMarkerAlt, FaCalendar, FaMoneyBillWave, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

export default function WorkerNewBookings() {
  const { data: bookings = [], isLoading } = useWorkerAvailableBookings();
  const workerAction = useWorkerAction();

  const handleAccept = (id) => {
    workerAction.mutate({ id, action: 'accept' }, {
      onSuccess: () => toast.success('Booking accepted!'),
      onError: () => toast.error('Failed to accept'),
    });
  };

  const handleReject = (id) => {
    workerAction.mutate({ id, action: 'reject' }, {
      onSuccess: () => toast.success('Booking rejected'),
      onError: () => toast.error('Failed to reject'),
    });
  };

  return (
    <div>
      <h1 className="page-header">New Bookings</h1>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)}</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <p className="text-lg">No new bookings available right now.</p>
          <p className="text-sm mt-2">We&apos;ll notify you when a new booking comes in.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{b.service?.name || 'Service'}</h3>
                    {b.isEmergency && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">Emergency</span>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FaUser className="text-primary-500" /> {b.customer?.name || 'Customer'}</div>
                    <div className="flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> ₹{b.price?.total || 0}</div>
                    <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" /> {b.address?.street || 'N/A'}</div>
                    <div className="flex items-center gap-2"><FaCalendar className="text-blue-500" /> {b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : 'N/A'} {b.scheduledTime ? `at ${b.scheduledTime}` : ''}</div>
                  </div>
                  {b.description && <p className="text-sm text-gray-500 mt-2">{b.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(b._id)} disabled={workerAction.isPending} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-green-600 disabled:opacity-50">
                    {workerAction.isPending ? <FaSpinner className="animate-spin" /> : <FaCheck />} Accept
                  </button>
                  <button onClick={() => handleReject(b._id)} disabled={workerAction.isPending} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-red-600 disabled:opacity-50">
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
