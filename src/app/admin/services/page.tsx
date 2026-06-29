"use client";

import { useEffect, useState } from "react";
import { SERVICE_CATEGORIES, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface Service {
  id: string;
  category: string;
  name: string;
  description: string | null;
  baseCharge: number;
  isEmergency: boolean;
  isActive: boolean;
  _count: { bookings: number };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Services</h1>
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => {
            const cat = SERVICE_CATEGORIES.find(c => c.id === svc.category);
            return (
              <div key={svc.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{cat?.icon || "🔧"}</span>
                  <div>
                    <h3 className="font-semibold">{svc.name}</h3>
                    <p className="text-sm text-gray-500">{svc.description || svc.category}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base: {formatCurrency(svc.baseCharge)}</span>
                  <span className="text-gray-500">{svc._count.bookings} bookings</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {svc.isEmergency && <span className="badge bg-red-100 text-red-700">Emergency</span>}
                  <span className={`badge ${svc.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {svc.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
