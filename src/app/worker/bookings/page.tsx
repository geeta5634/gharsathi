"use client";

import { useEffect, useState } from "react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  bookingId: string;
  status: string;
  scheduledDate: string;
  timeSlot: string;
  address: string;
  finalAmount: number;
  service: { name: string };
  customer: { name: string | null; phone: string };
}

export default function WorkerBookingsPage() {
  const { data: session } = useSession();
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

  const handleAccept = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "WORKER_ASSIGNED", workerId: session?.user?.id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Job accepted!");
      setFilter("");
    } catch {
      toast.error("Failed to accept");
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", cancellationReason: "Worker rejected" }),
      });
      toast.success("Job rejected");
      setFilter("");
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success(`Status updated to ${getStatusLabel(status)}`);
      setFilter("");
    } catch {
      toast.error("Failed to update");
    }
  };

  const tabs = [
    { value: "", label: "All" },
    { value: "PENDING", label: "New Requests" },
    { value: "WORKER_ASSIGNED", label: "Accepted" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const nextStatus: Record<string, string> = {
    WORKER_ASSIGNED: "WORKER_ON_THE_WAY",
    WORKER_ON_THE_WAY: "SERVICE_STARTED",
    SERVICE_STARTED: "COMPLETED",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Jobs</h1>

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
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-24" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">New bookings will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{booking.service.name}</span>
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>📅 {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.timeSlot}</p>
                    <p>📍 {booking.address}</p>
                    <p>👤 {booking.customer.name || "Customer"} - {booking.customer.phone}</p>
                    <p>💰 {formatCurrency(booking.finalAmount)}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                {booking.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleAccept(booking.id)}
                      className="btn-primary text-sm"
                    >
                      Accept Job
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="btn-secondary text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                {nextStatus[booking.status] && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, nextStatus[booking.status])}
                    className="btn-primary text-sm"
                  >
                    Mark as {getStatusLabel(nextStatus[booking.status])}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
