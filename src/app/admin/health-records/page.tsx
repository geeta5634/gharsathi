"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface HealthRecord {
  id: string;
  title: string;
  description: string | null;
  type: string;
  serviceDate: string | null;
  nextDueDate: string | null;
  amount: number | null;
  notes: string | null;
  createdAt: string;
}

const RECORD_TYPES: Record<string, { label: string; color: string }> = {
  CHECKUP: { label: "Checkup", color: "bg-blue-100 text-blue-700" },
  VACCINATION: { label: "Vaccination", color: "bg-green-100 text-green-700" },
  MEDICATION: { label: "Medication", color: "bg-purple-100 text-purple-700" },
  SURGERY: { label: "Surgery", color: "bg-red-100 text-red-700" },
  TEST: { label: "Lab Test", color: "bg-yellow-100 text-yellow-700" },
  EMERGENCY: { label: "Emergency", color: "bg-orange-100 text-orange-700" },
  OTHER: { label: "Other", color: "bg-gray-100 text-gray-700" },
};

export default function AdminHealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health-records")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        const mock: HealthRecord[] = [
          { id: "1", title: "Annual Health Checkup", description: "Full body checkup", type: "CHECKUP", serviceDate: "2026-06-15T00:00:00Z", nextDueDate: "2026-12-15T00:00:00Z", amount: 2500, notes: null, createdAt: "2026-06-15T00:00:00Z" },
          { id: "2", title: "Flu Vaccination", description: "Seasonal flu shot", type: "VACCINATION", serviceDate: "2026-05-20T00:00:00Z", nextDueDate: "2027-05-20T00:00:00Z", amount: 800, notes: null, createdAt: "2026-05-20T00:00:00Z" },
          { id: "3", title: "Blood Test", description: "Complete blood count", type: "TEST", serviceDate: "2026-04-10T00:00:00Z", nextDueDate: null, amount: 1200, notes: "Results sent to patient", createdAt: "2026-04-10T00:00:00Z" },
          { id: "4", title: "Dental Surgery", description: "Root canal treatment", type: "SURGERY", serviceDate: "2026-03-05T00:00:00Z", nextDueDate: "2026-09-05T00:00:00Z", amount: 8000, notes: "Follow-up required", createdAt: "2026-03-05T00:00:00Z" },
          { id: "5", title: "Blood Pressure Medication", description: "Monthly prescription", type: "MEDICATION", serviceDate: "2026-06-01T00:00:00Z", nextDueDate: "2026-07-01T00:00:00Z", amount: 500, notes: null, createdAt: "2026-06-01T00:00:00Z" },
        ];
        setRecords(mock);
        setLoading(false);
      });
  }, []);

  const totalRecords = records.length;
  const upcomingDue = records.filter((r) => r.nextDueDate && new Date(r.nextDueDate) > new Date()).length;
  const totalSpent = records.reduce((s, r) => s + (r.amount || 0), 0);

  const getTypeBadge = (type: string) => {
    const t = RECORD_TYPES[type] || RECORD_TYPES.OTHER;
    return <span className={`badge ${t.color}`}>{t.label}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Health Records</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card animate-slideUp stagger-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📄</div>
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
            </div>
          </div>
        </div>
        <div className="stat-card animate-slideUp stagger-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">⏰</div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Due</p>
              <p className="text-2xl font-bold text-yellow-600">{upcomingDue}</p>
            </div>
          </div>
        </div>
        <div className="stat-card animate-slideUp stagger-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card animate-slideUp stagger-4">
        <h2 className="text-lg font-semibold mb-4">All Health Records</h2>
        {records.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No health records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Service Date</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Next Due</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">{getTypeBadge(r.type)}</td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium text-gray-800">{r.title}</p>
                        {r.description && <p className="text-xs text-gray-400">{r.description}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {r.serviceDate ? new Date(r.serviceDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="py-3 px-3">
                      {r.nextDueDate ? (
                        <span className={`text-sm ${new Date(r.nextDueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? "text-orange-600 font-medium" : "text-gray-600"}`}>
                          {new Date(r.nextDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      {r.amount ? formatCurrency(r.amount) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
