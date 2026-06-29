"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, SERVICE_CATEGORIES } from "@/lib/utils";
import BookingStatusBadge from "@/components/shared/BookingStatusBadge";

interface BookingSummary {
  id: string;
  bookingId: string;
  status: string;
  scheduledDate: string;
  timeSlot: string;
  finalAmount: number;
  service: { name: string };
  worker: { name: string } | null;
}

const STATS_CONFIG = [
  {
    label: "Active Bookings",
    key: "active" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    gradient: "from-blue-600 to-blue-400",
    shadow: "shadow-blue-500/20",
  },
  {
    label: "Completed",
    key: "completed" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-emerald-600 to-emerald-400",
    shadow: "shadow-emerald-500/20",
  },
  {
    label: "Total Spent",
    key: "spent" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-violet-600 to-violet-400",
    shadow: "shadow-violet-500/20",
  },
  {
    label: "Membership",
    key: "membership" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    gradient: "from-amber-600 to-amber-400",
    shadow: "shadow-amber-500/20",
  },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/bookings?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeBookings = bookings.filter(
    (b) => !["COMPLETED", "CANCELLED"].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const totalSpent = bookings.reduce((s, b) => s + b.finalAmount, 0);

  const stats = {
    active: activeBookings.length,
    completed: completedBookings.length,
    spent: formatCurrency(totalSpent),
    membership: "Active",
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()},{" "}
              <span className="text-gradient">
                {session?.user?.name?.split(" ")[0] || "Customer"}
              </span>
              <span className="inline-block animate-bounce ml-1">👋</span>
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>{formatDate(currentTime)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="font-mono text-sm text-blue-600 font-medium">
                {formatTime(currentTime)}
              </span>
            </p>
          </div>
          <Link
            href="/customer/bookings/new"
            className="btn-primary inline-flex items-center gap-2 self-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Booking
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map((stat, i) => (
          <div
            key={stat.label}
            className={`stat-card card-hover animate-slideUp stagger-${i + 1}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadow} shadow-lg flex items-center justify-center text-white`}
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 truncate">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats[stat.key]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Services */}
      <div className="animate-slideUp stagger-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Quick Services</h2>
          <Link
            href="/customer/workers"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/customer/workers?category=${cat.id}`}
              className={`card card-hover flex flex-col items-center justify-center gap-2 p-4 transition-all duration-300 hover:${cat.color.replace("bg-", "bg-").replace("-500", "-100")}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 animate-slideUp stagger-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Bookings
              </h2>
              <Link
                href="/customer/bookings"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 shimmer">
                    <div className="w-10 h-10 rounded-lg bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                  🔧
                </div>
                <p className="text-gray-500 font-medium">No bookings yet</p>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  Book your first service and track it here
                </p>
                <Link href="/customer/workers" className="btn-primary inline-flex items-center gap-2">
                  Find Workers
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {bookings.map((booking, i) => (
                  <Link
                    key={booking.id}
                    href={`/customer/bookings/${booking.id}`}
                    className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                        {booking.service.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {booking.service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at {booking.timeSlot}
                        </p>
                        {booking.worker && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            {booking.worker.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(booking.finalAmount)}
                      </p>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-slideUp stagger-5">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/customer/workers"
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 hover:from-blue-100 hover:to-blue-100 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.123-2.123l5.647-5.646m2.122 0L16.66 7.88l2.47 2.47m-9.316 6.82l2.47-2.47 2.122 2.122M11.954 5.873l4.243 4.243" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Book a Service</p>
                  <p className="text-xs text-blue-500/70">Find workers near you</p>
                </div>
                <svg className="w-4 h-4 ml-auto text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link
                href="/customer/health-records"
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 hover:from-emerald-100 hover:to-emerald-100 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Health Records</p>
                  <p className="text-xs text-emerald-500/70">View medical history</p>
                </div>
                <svg className="w-4 h-4 ml-auto text-emerald-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link
                href="/customer/subscription"
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50/50 text-amber-700 hover:from-amber-100 hover:to-amber-100 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Membership</p>
                  <p className="text-xs text-amber-500/70">Upgrade your plan</p>
                </div>
                <svg className="w-4 h-4 ml-auto text-amber-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link
                href="/customer/profile"
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-50/50 text-gray-700 hover:from-gray-100 hover:to-gray-100 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-400 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">My Profile</p>
                  <p className="text-xs text-gray-400">Manage your account</p>
                </div>
                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* AI Problem Detection */}
          <div
            className={`card transition-all duration-300 ${
              dragOver ? "border-blue-400 bg-blue-50/50 shadow-lg shadow-blue-500/10" : ""
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              AI Problem Detection
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload a photo and let AI identify the service you need
            </p>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {dragOver ? "Drop your image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
