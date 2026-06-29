"use client";

import { useEffect, useState } from "react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

interface AdminStats {
  totalWorkers: number;
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  workersGrowth: number;
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
  bookingsTrend: { date: string; count: number; revenue: number }[];
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
  gradient: string;
  shadowColor: string;
  stagger: string;
}

function StatCard({ label, value, change, icon, gradient, shadowColor, stagger }: StatCardProps) {
  return (
    <div
      className={`animate-slideUp opacity-0 [animation-fill-mode:forwards] ${stagger}`}
    >
      <div
        className="stat-card group relative overflow-hidden"
        style={{
          boxShadow: `0 4px 20px -4px ${shadowColor}20, 0 2px 4px -2px rgb(0 0 0 / 0.05)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-60" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
            {change && (
              <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {change}
              </p>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: gradient, boxShadow: `0 4px 12px ${shadowColor}40` }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>
        </div>
        <div
          className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full opacity-[0.06] group-hover:scale-[2] transition-transform duration-700"
          style={{ background: gradient }}
        />
      </div>
    </div>
  );
}

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className || ""}`} />;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <ShimmerBlock className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ShimmerBlock className="lg:col-span-2 h-72" />
          <ShimmerBlock className="h-72" />
        </div>
        <ShimmerBlock className="h-80" />
      </div>
    );
  }

  const statCards: StatCardProps[] = [
    {
      label: "Total Workers",
      value: stats?.totalWorkers ?? 0,
      change: stats ? `+${stats.workersGrowth} this week` : undefined,
      icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
      gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      shadowColor: "#3b82f6",
      stagger: "stagger-1",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      gradient: "linear-gradient(135deg, #059669, #3b82f6)",
      shadowColor: "#059669",
      stagger: "stagger-2",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
      shadowColor: "#f59e0b",
      stagger: "stagger-3",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
      shadowColor: "#6366f1",
      stagger: "stagger-4",
    },
  ];

  const COLORS_10 = [
    "#3b82f6", "#059669", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="animate-slideUp opacity-0 [animation-fill-mode:forwards]">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="animate-slideUp opacity-0 [animation-fill-mode:forwards] stagger-1 card h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Bookings Overview</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">This Week</span>
            </div>
            {stats?.bookingsTrend && stats.bookingsTrend.length > 0 ? (
              <div className="relative">
                <div className="flex items-end justify-between gap-2 h-48">
                  {stats.bookingsTrend.map((day, i) => {
                    const maxCount = Math.max(...stats.bookingsTrend.map((d) => d.count), 1);
                    const height = (day.count / maxCount) * 100;
                    const dayIndex = new Date(day.date).getDay();
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.count}
                        </span>
                        <div className="w-full flex justify-center">
                          <div
                            className="w-full max-w-[32px] rounded-full transition-all duration-700 ease-out group-hover:scale-105 relative"
                            style={{
                              height: `${Math.max(height, 6)}%`,
                              background: "linear-gradient(180deg, #3b82f6, #8b5cf6)",
                              boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
                              animation: `slideUp 0.6s ease-out ${i * 0.08}s both`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {weekDays[dayIndex]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {stats.bookingsTrend.some((d) => d.revenue > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total revenue this week</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(stats.bookingsTrend.reduce((s, d) => s + d.revenue, 0))}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">No booking data available</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="animate-slideUp opacity-0 [animation-fill-mode:forwards] stagger-2 card h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Bookings by Service</h2>
              {stats?.bookingsByService && stats.bookingsByService.length > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {stats.bookingsByService.reduce((s, v) => s + v.count, 0)} total
                </span>
              )}
            </div>
            {stats?.bookingsByService && stats.bookingsByService.length > 0 ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative w-28 h-28">
                    {(() => {
                      const total = stats.bookingsByService.reduce((s, v) => s + v.count, 0);
                      const segments = stats.bookingsByService.map((svc, i) => {
                        const pct = total > 0 ? (svc.count / total) * 100 : 0;
                        const prevSum = stats.bookingsByService
                          .slice(0, i)
                          .reduce((s, v) => s + (v.count / total) * 100, 0);
                        return { pct, prevSum, color: COLORS_10[i % COLORS_10.length] };
                      });
                      const conic = segments
                        .map(
                          (s) =>
                            `${s.color} ${s.prevSum}% ${s.prevSum + s.pct}%`
                        )
                        .join(", ");
                      return (
                        <div
                          className="w-full h-full rounded-full animate-scaleIn opacity-0 [animation-fill-mode:forwards]"
                          style={{
                            background: `conic-gradient(${conic})`,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                          }}
                        >
                          <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-800">
                              {total}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
                  {stats.bookingsByService.slice(0, 8).map((svc, i) => {
                    const total = stats.bookingsByService.reduce((s, v) => s + v.count, 0);
                    const pct = total > 0 ? (svc.count / total) * 100 : 0;
                    const color = COLORS_10[i % COLORS_10.length];
                    return (
                      <div key={svc.name} className="group">
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-gray-700 truncate font-medium">{svc.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900 shrink-0 ml-2">
                            {svc.count}
                            <span className="text-gray-400 font-normal ml-1">
                              ({pct.toFixed(0)}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: color,
                              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-sm">No service data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="animate-slideUp opacity-0 [animation-fill-mode:forwards] stagger-3 card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          {stats?.recentBookings && stats.recentBookings.length > 0 && (
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Booking ID</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Customer</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Service</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Worker</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Date</th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentBookings.map((booking, i) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-blue-50/50 transition-colors duration-150 group"
                    style={{ animation: `slideUp 0.4s ease-out ${i * 0.04}s both` }}
                  >
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="font-mono font-medium text-blue-600 hover:text-blue-800 transition-colors underline underline-offset-2 decoration-blue-200 hover:decoration-blue-400"
                      >
                        {booking.bookingId}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {(booking.customer.name || booking.customer.phone).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-900 font-medium truncate">
                            {booking.customer.name || "N/A"}
                          </p>
                          <p className="text-gray-400 text-xs">{booking.customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{booking.service.name}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {booking.worker?.name || (
                        <span className="text-gray-300 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      {formatCurrency(booking.finalAmount)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`badge ${getStatusColor(booking.status)} inline-flex items-center gap-1`}>
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{
                            backgroundColor: booking.status === "COMPLETED" ? "#16a34a"
                              : booking.status === "CANCELLED" ? "#dc2626"
                              : booking.status === "CONFIRMED" ? "#2563eb"
                              : booking.status === "PENDING" ? "#d97706"
                              : "#6366f1",
                          }}
                        />
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">No bookings yet</p>
            <p className="text-xs text-gray-300 mt-1">Bookings will appear here once customers start ordering.</p>
          </div>
        )}
      </div>
    </div>
  );
}
