import TrustScoreBadge from './TrustScoreBadge';
import { FaStar, FaUser } from 'react-icons/fa';

export default function WorkerCard({ worker, onHire }) {
  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {worker.avatar ? (
            <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <FaUser className="text-2xl text-primary-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800">{worker.name}</h3>
            <TrustScoreBadge score={worker.trustScore || 0} />
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar key={s} className={`text-sm ${s <= Math.round(worker.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-500 ml-1">({worker.rating?.toFixed(1) || '0.0'})</span>
          </div>
          {worker.services && worker.services.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {worker.services.map((s, i) => (
                <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                  {typeof s === 'string' ? s : s.name}
                </span>
              ))}
            </div>
          )}
          {worker.experience && (
            <p className="text-sm text-gray-500">{worker.experience} years experience</p>
          )}
        </div>
      </div>
      {onHire && (
        <button onClick={() => onHire(worker)} className="w-full mt-4 btn-primary text-center">
          Hire Now
        </button>
      )}
    </div>
  );
}
