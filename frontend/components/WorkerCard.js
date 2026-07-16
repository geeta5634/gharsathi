"use client";

import { FaStar, FaShieldAlt, FaBriefcase, FaCheckCircle } from 'react-icons/fa';

export default function WorkerCard({ worker, onHire }) {
  return (
    <div className="card hover:border-primary-300 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-primary-600">{worker.name?.charAt(0) || 'W'}</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{worker.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-yellow-500"><FaStar className="text-xs" /> {worker.rating?.toFixed(1)}</span>
            <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-semibold ${worker.trustScore >= 80 ? 'bg-green-100 text-green-700' : worker.trustScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              <FaShieldAlt className="text-xs" /> {worker.trustScore}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1"><FaBriefcase className="text-xs" /> {worker.experience}yr exp</span>
        <span className="flex items-center gap-1"><FaCheckCircle className="text-xs text-green-500" /> Verified</span>
      </div>
      <button
        onClick={() => onHire?.(worker)}
        className="w-full btn-primary text-sm py-2"
      >
        Hire Now
      </button>
    </div>
  );
}
