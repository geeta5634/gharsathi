import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function StatsCard({ icon: Icon, label, value, trend, trendUp }) {
  return (
    <div className="stat-card">
      <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="text-2xl text-primary-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {trend && (
          <p className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? <FaArrowUp /> : <FaArrowDown />}
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
