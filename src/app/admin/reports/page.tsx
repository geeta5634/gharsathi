"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface ReportStats {
  totalBookings: number;
  totalRevenue: number;
  totalWorkers: number;
  totalCustomers: number;
  recentBookings: {
    id: string;
    bookingId: string;
    status: string;
    scheduledDate: string;
    finalAmount: number;
    service: { name: string };
    customer: { name: string | null; phone: string };
    worker: { name: string | null } | null;
  }[];
  bookingsByService: { name: string; count: number; revenue: number }[];
}

type DateRange = "TODAY" | "WEEK" | "MONTH" | "ALL";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("ALL");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const avgRating = 4.3;
  const activeWorkers = stats?.totalWorkers || 0;

  const ranges: { key: DateRange; label: string }[] = [
    { key: "TODAY", label: "Today" },
    { key: "WEEK", label: "Week" },
    { key: "MONTH", label: "Month" },
    { key: "ALL", label: "All" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setDateRange(r.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  dateRange === r.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => console.log("Export clicked")}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card stagger-1 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📋</div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              <p className="text-xs text-green-600">+12% from last period</p>
            </div>
          </div>
        </div>
        <div className="stat-card stagger-2 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
              <p className="text-xs text-green-600">+8% from last period</p>
            </div>
          </div>
        </div>
        <div className="stat-card stagger-3 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">⭐</div>
            <div>
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="stat-card stagger-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">👷</div>
            <div>
              <p className="text-sm text-gray-500">Active Workers</p>
              <p className="text-2xl font-bold text-gray-900">{activeWorkers}</p>
              <p className="text-xs text-green-600">{stats?.totalCustomers || 0} customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card stagger-2 animate-slideUp">
          <h2 className="text-lg font-semibold mb-4">📊 Revenue by Service</h2>
          {stats?.bookingsByService && stats.bookingsByService.length > 0 ? (
            <div className="space-y-4">
              {stats.bookingsByService.map((svc, i) => {
                const pct = stats.totalRevenue > 0 ? (svc.revenue / stats.totalRevenue) * 100 : 0;
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500"];
                return (
                  <div key={svc.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{svc.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs">{svc.count} bookings</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(svc.revenue)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`${colors[i % colors.length]} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No revenue data available</p>
          )}
        </div>

        <div className="card stagger-3 animate-slideUp">
          <h2 className="text-lg font-semibold mb-4">📈 Performance Metrics</h2>
          <div className="space-y-5">
            {[
              { label: "Booking Completion Rate", value: 87, color: "bg-green-500" },
              { label: "Customer Satisfaction", value: 94, color: "bg-blue-500" },
              { label: "Worker Retention", value: 76, color: "bg-purple-500" },
              { label: "Service Utilization", value: 68, color: "bg-orange-500" },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{metric.label}</span>
                  <span className="font-semibold">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${metric.color} h-2.5 rounded-full transition-all duration-700`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card stagger-4 animate-slideUp">
        <h2 className="text-lg font-semibold mb-4">📋 Recent Activity</h2>
        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="space-y-3">
            {stats.recentBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                    {b.bookingId.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {b.service.name} — <span className="text-gray-500">{b.customer.name || b.customer.phone}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(b.finalAmount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}
