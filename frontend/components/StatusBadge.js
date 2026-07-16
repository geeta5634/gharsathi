export default function StatusBadge({ status }) {
  const styles = {
    completed: 'bg-green-100 text-green-700',
    active: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    in_progress: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold ${styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
      {status || 'Unknown'}
    </span>
  );
}
