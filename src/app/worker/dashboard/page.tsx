"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface WorkerStats {
  todayBookings: number;
  todayCompleted: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  dailyBreakdown: { date: string; count: number; earnings: number }[];
  acceptedBookings: number;
  completedJobs: number;
  totalJobs: number;
  rating: number;
  trustScore: number;
}

const greetings = [
  "Good Morning",
  "Good Afternoon",
  "Good Evening",
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return greetings[0];
  if (h < 17) return greetings[1];
  return greetings[2];
}

function getIcon(color: string): string {
  const icons: Record<string, string> = {
    blue: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    green: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    purple: "M12 8c-1.657 0-3 .895-3 2m0 0c0 1.105 1.343 2 3 2s3-.895 3-2m0-2c0-1.105-1.343-2-3-2m-3 2v6m6-6v6m-3-3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    yellow: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    orange: "M13 10V3L4 14h7v7l9-11h-7z",
  };
  return icons[color] || icons.blue;
}

const gradientMap: Record<string, string> = {
  blue: "from-blue-500 to-indigo-600",
  green: "from-emerald-500 to-teal-600",
  purple: "from-purple-500 to-pink-600",
  yellow: "from-amber-400 to-orange-500",
  orange: "from-orange-500 to-red-500",
};

export default function WorkerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [animateBars, setAnimateBars] = useState(false);
  const [animateTrust, setAnimateTrust] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/worker-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
        setTimeout(() => setAnimateBars(true), 400);
        setTimeout(() => setAnimateTrust(true), 600);
      })
      .catch(() => setLoading(false));
  }, []);

  const changePercent =
    stats && stats.lastMonthEarnings > 0
      ? ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100
      : 0;

  const barMax = Math.max(
    stats?.thisMonthEarnings || 0,
    stats?.lastMonthEarnings || 0,
    1
  );

  const statCards = [
    {
      label: "Today's Bookings",
      value: stats?.todayBookings ?? 0,
      color: "blue",
      suffix: "",
    },
    {
      label: "Completed Today",
      value: stats?.todayCompleted ?? 0,
      color: "green",
      suffix: "",
    },
    {
      label: "This Month Earnings",
      value: formatCurrency(stats?.thisMonthEarnings ?? 0),
      color: "purple",
      suffix: "",
    },
    {
      label: "Rating",
      value: stats?.rating ? `${stats.rating.toFixed(1)}` : "0.0",
      color: "yellow",
      suffix: "★",
    },
  ];

  const quickActions = [
    {
      label: "My Jobs",
      href: "/worker/bookings",
      gradient: "from-blue-500 to-indigo-600",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      desc: "View & manage bookings",
    },
    {
      label: "Earnings",
      href: "/worker/earnings",
      gradient: "from-emerald-500 to-teal-600",
      icon: "M12 8c-1.657 0-3 .895-3 2m0 0c0 1.105 1.343 2 3 2s3-.895 3-2m0-2c0-1.105-1.343-2-3-2m-3 2v6m6-6v6m-3-3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      desc: "Track your income",
    },
    {
      label: "Profile",
      href: "/worker/profile",
      gradient: "from-purple-500 to-pink-600",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      desc: "Edit your details",
    },
    {
      label: "Home",
      href: "/",
      gradient: "from-amber-400 to-orange-500",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      desc: "Back to site",
    },
  ];

  const trustColor =
    (stats?.trustScore ?? 0) >= 80
      ? "bg-emerald-500"
      : (stats?.trustScore ?? 0) >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  const trustLabel =
    (stats?.trustScore ?? 0) >= 80
      ? "Excellent"
      : (stats?.trustScore ?? 0) >= 50
        ? "Good"
        : "Needs Improvement";

  if (loading) {
    return (
      <div className="space-y-5 animate-fadeIn">
        <div className="h-28 bg-white/60 rounded-2xl shimmer" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/60 rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-56 bg-white/60 rounded-2xl shimmer" />
          <div className="h-56 bg-white/60 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-slideUp stagger-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "W"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {greeting}, {session?.user?.name?.split(" ")[0] || "Worker"}!
                  </h1>
                  <span className="text-lg animate-float">👋</span>
                </div>
                <p className="text-gray-500 text-sm mt-0.5">
                  Here&apos;s your {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} overview
                </p>
              </div>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={() => setAvailable(!available)}
              className={`relative inline-flex items-center gap-3 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 active:scale-95 ${
                available
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100"
                  : "bg-gray-50 text-gray-500 border border-gray-200"
              }`}
            >
              <div
                className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${
                  available ? "bg-emerald-400" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                    available ? "left-5" : "left-1"
                  }`}
                />
              </div>
              <span>{available ? "Available" : "Offline"}</span>
              {available && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`animate-slideUp stagger-${i + 2}`}
          >
            <div className="stat-card group cursor-default hover:-translate-y-0.5 p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradientMap[stat.color]} flex items-center justify-center shrink-0 shadow-lg shadow-${stat.color}-500/20 group-hover:scale-110 transition-transform duration-300`}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={getIcon(stat.color)}
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-amber-400 text-sm">{stat.suffix}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Earnings Comparison + Trust & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Earnings Comparison */}
        <div className="animate-slideUp stagger-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Earnings Comparison</h2>
                <p className="text-xs text-gray-500 mt-0.5">Last month vs this month</p>
              </div>
              <div
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg ${
                  changePercent >= 0
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${changePercent >= 0 ? "" : "rotate-180"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>{changePercent >= 0 ? "+" : ""}{changePercent.toFixed(1)}%</span>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-center gap-8 sm:gap-12 mb-5 h-40">
              <div className="flex flex-col items-center gap-2 w-24">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(stats?.lastMonthEarnings ?? 0)}
                </span>
                <div className="w-full bg-gray-100 rounded-xl overflow-hidden h-24 relative">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-xl transition-all duration-1000 ease-out"
                    style={{
                      height: animateBars
                        ? `${((stats?.lastMonthEarnings ?? 0) / barMax) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">Last Month</span>
              </div>

              <div className="flex flex-col items-center gap-2 w-24">
                <span className="text-lg sm:text-xl font-bold text-blue-600">
                  {formatCurrency(stats?.thisMonthEarnings ?? 0)}
                </span>
                <div className="w-full bg-blue-50 rounded-xl overflow-hidden h-24 relative">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl transition-all duration-1000 ease-out shadow-lg shadow-blue-500/20"
                    style={{
                      height: animateBars
                        ? `${((stats?.thisMonthEarnings ?? 0) / barMax) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-xs text-blue-600 font-medium">This Month</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Monthly Progress</span>
                <span className="font-semibold text-gray-900">
                  {stats?.thisMonthEarnings && stats?.lastMonthEarnings
                    ? `${Math.min(100, Math.round((stats.thisMonthEarnings / Math.max(stats.lastMonthEarnings, 1)) * 100))}% of last month`
                    : "No data yet"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Performance */}
        <div className="animate-slideUp stagger-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Trust & Performance</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your reliability score</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <div className="space-y-5">
              {/* Trust Score Circle */}
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                    <circle
                      cx="36" cy="36" r="30"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                    />
                    <circle
                      cx="36" cy="36" r="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 30}`}
                      strokeDashoffset={
                        animateTrust
                          ? `${2 * Math.PI * 30 * (1 - (stats?.trustScore ?? 0) / 100)}`
                          : `${2 * Math.PI * 30}`
                      }
                      className={`transition-all duration-1500 ease-out ${
                        (stats?.trustScore ?? 0) >= 80
                          ? "text-emerald-500"
                          : (stats?.trustScore ?? 0) >= 50
                            ? "text-amber-500"
                            : "text-red-500"
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">
                      {stats?.trustScore.toFixed(0) ?? 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">Trust Score</p>
                  <p className="text-xs text-gray-500 mt-0.5">{trustLabel}</p>
                  <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${
                    (stats?.trustScore ?? 0) >= 80
                      ? "bg-emerald-50 text-emerald-600"
                      : (stats?.trustScore ?? 0) >= 50
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      (stats?.trustScore ?? 0) >= 80
                        ? "bg-emerald-500"
                        : (stats?.trustScore ?? 0) >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`} />
                    {trustLabel}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {stats?.completedJobs ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Jobs Done</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <p className="text-lg font-bold text-gray-900">
                    {stats?.rating?.toFixed(1) ?? "0.0"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {stats?.totalJobs ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Total Jobs</p>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">
                    {formatCurrency(stats?.totalEarnings ?? 0)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2m0 0c0 1.105 1.343 2 3 2s3-.895 3-2m0-2c0-1.105-1.343-2-3-2m-3 2v6m6-6v6m-3-3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-slideUp stagger-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-xs text-gray-500 mt-0.5">Navigate to key sections</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Click any card to go</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, i) => (
              <Link
                key={action.label}
                href={action.href}
                className={`group relative overflow-hidden rounded-xl p-4 sm:p-5 bg-gradient-to-br ${action.gradient} text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-white/90 mb-3 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                  </svg>
                  <p className="font-semibold text-sm sm:text-base">{action.label}</p>
                  <p className="text-xs text-white/70 mt-0.5 hidden sm:block">{action.desc}</p>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
