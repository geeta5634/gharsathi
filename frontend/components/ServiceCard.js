"use client";

import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

export default function ServiceCard({ service }) {
  const router = useRouter();
  const Icon = service.icon;

  return (
    <div
      onClick={() => router.push('/register')}
      className="card cursor-pointer group hover:border-primary-300 transition-all duration-300"
    >
      <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
      <p className="text-gray-500 text-sm mb-3">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-primary-600 font-bold">Starting ₹{service.price}</span>
        <span className="text-primary-600 group-hover:translate-x-1 transition-transform">
          <FaArrowRight />
        </span>
      </div>
    </div>
  );
}
