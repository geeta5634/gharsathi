"use client";

import { useEffect, useState } from "react";
import { formatCurrency, SERVICE_CATEGORIES } from "@/lib/utils";

interface Worker {
  id: string;
  serviceCategory: string;
  rating: number;
  trustScore: number;
  isVerified: boolean;
  kycStatus: string;
  completedJobs: number;
  totalEarnings: number;
  user: { name: string | null; phone: string };
}

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workers?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data.workers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Workers</h1>
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-medium">Name</th>
                <th className="text-left py-3 px-3 font-medium">Phone</th>
                <th className="text-left py-3 px-3 font-medium">Service</th>
                <th className="text-center py-3 px-3 font-medium">Rating</th>
                <th className="text-center py-3 px-3 font-medium">Trust Score</th>
                <th className="text-center py-3 px-3 font-medium">Verified</th>
                <th className="text-center py-3 px-3 font-medium">KYC</th>
                <th className="text-right py-3 px-3 font-medium">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{w.user.name || "N/A"}</td>
                  <td className="py-3 px-3 text-gray-500">{w.user.phone}</td>
                  <td className="py-3 px-3">{SERVICE_CATEGORIES.find(s => s.id === w.serviceCategory)?.name || w.serviceCategory}</td>
                  <td className="py-3 px-3 text-center">{w.rating.toFixed(1)}</td>
                  <td className="py-3 px-3 text-center">{w.trustScore.toFixed(0)}%</td>
                  <td className="py-3 px-3 text-center">{w.isVerified ? "✓" : "✗"}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`badge ${w.kycStatus === "VERIFIED" ? "bg-green-100 text-green-700" : w.kycStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {w.kycStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium">{formatCurrency(w.totalEarnings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
