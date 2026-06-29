"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Booking {
  id: string;
  bookingId: string;
  status: string;
  scheduledDate: string;
  timeSlot: string;
  finalAmount: number;
  service: { name: string };
  worker: { name: string } | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = filter ? `?status=${filter}` : "";
    fetch(`/api/bookings${params}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  const tabs = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "WORKER_ASSIGNED", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Link href="/customer/workers" className="btn-primary">
          + New Booking
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-4">Book your first service today!</p>
          <Link href="/customer/workers" className="btn-primary">Find Workers</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="card flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                  🔧
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{booking.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })} at {booking.timeSlot}
                  </p>
                  {booking.worker && (
                    <p className="text-xs text-gray-400">Worker: {booking.worker.name}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(booking.finalAmount)}</p>
                <span className={`badge ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
