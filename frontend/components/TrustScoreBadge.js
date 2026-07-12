import { FaStar } from 'react-icons/fa';

export default function TrustScoreBadge({ score }) {
  let color = 'bg-red-100 text-red-700 border-red-200';
  if (score >= 80) color = 'bg-green-100 text-green-700 border-green-200';
  else if (score >= 50) color = 'bg-yellow-100 text-yellow-700 border-yellow-200';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      <FaStar className="text-xs" />
      Trust: {score}
    </span>
  );
}
