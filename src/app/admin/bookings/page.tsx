"use client";

import { useEffect, useState } from "react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Booking {
  id: string;
  bookingId: string;
  status: string;
  scheduledDate: string;
  finalAmount: number;
  service: { name: string };
  customer: { name: string | null; phone: string };
  worker: { name: string | null } | null;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentBookings) setBookings(data.recentBookings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Bookings</h1>
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-medium">Booking ID</th>
                <th className="text-left py-3 px-3 font-medium">Customer</th>
                <th className="text-left py-3 px-3 font-medium">Service</th>
                <th className="text-left py-3 px-3 font-medium">Worker</th>
                <th className="text-left py-3 px-3 font-medium">Date</th>
                <th className="text-right py-3 px-3 font-medium">Amount</th>
                <th className="text-center py-3 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-blue-600">{b.bookingId}</td>
                  <td className="py-3 px-3">{b.customer.name || b.customer.phone}</td>
                  <td className="py-3 px-3">{b.service.name}</td>
                  <td className="py-3 px-3">{b.worker?.name || "—"}</td>
                  <td className="py-3 px-3">{new Date(b.scheduledDate).toLocaleDateString()}</td>
                  <td className="py-3 px-3 text-right font-medium">{formatCurrency(b.finalAmount)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`badge ${getStatusColor(b.status)}`}>{getStatusLabel(b.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
