import { FaCheckCircle, FaClock, FaTimesCircle, FaSpinner, FaPlayCircle } from 'react-icons/fa';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: FaClock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: FaCheckCircle, label: 'Confirmed' },
  active: { color: 'bg-blue-100 text-blue-700', icon: FaPlayCircle, label: 'Active' },
  'in-progress': { color: 'bg-blue-100 text-blue-700', icon: FaSpinner, label: 'In Progress' },
  completed: { color: 'bg-green-100 text-green-700', icon: FaCheckCircle, label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, label: 'Cancelled' },
  rejected: { color: 'bg-red-100 text-red-700', icon: FaTimesCircle, label: 'Rejected' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <Icon className="text-xs" />
      {config.label}
    </span>
  );
}
