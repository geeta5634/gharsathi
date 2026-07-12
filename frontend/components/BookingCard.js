import StatusBadge from './StatusBadge';
import { FaUser, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';

export default function BookingCard({ booking, actions }) {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{booking.service?.name || booking.serviceType || 'Service'}</h3>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FaUser className="text-xs" />
            {booking.worker?.name || booking.customer?.name || 'N/A'}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-primary-500" />
          {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}
          {booking.scheduledTime ? ` at ${booking.scheduledTime}` : ''}
        </div>
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-green-500" />
          ₹{booking.totalAmount || booking.price || 0}
        </div>
      </div>
      {booking.address && (
        <p className="text-sm text-gray-500 mb-3">📍 {booking.address}</p>
      )}
      {actions && <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">{actions}</div>}
    </div>
  );
}
