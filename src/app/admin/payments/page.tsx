"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface PaymentInfo {
  id: string;
  bookingId: string;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  customer: { name: string | null; phone: string };
  worker: { name: string | null } | null;
  service: { name: string };
  scheduledDate: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentBookings) setPayments(data.recentBookings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCollected = payments
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((s, p) => s + p.finalAmount, 0);
  const totalPending = payments
    .filter((p) => p.paymentStatus === "PENDING")
    .reduce((s, p) => s + p.finalAmount, 0);
  const totalRefunded = payments
    .filter((p) => p.paymentStatus === "REFUNDED")
    .reduce((s, p) => s + p.finalAmount, 0);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-sm text-gray-500">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
              <p className="text-xs text-gray-400">{payments.filter((p) => p.paymentStatus === "PAID").length} transactions</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">⏳</div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-gray-400">{payments.filter((p) => p.paymentStatus === "PENDING").length} transactions</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-xl">↩️</div>
            <div>
              <p className="text-sm text-gray-500">Refunded</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalRefunded)}</p>
              <p className="text-xs text-gray-400">{payments.filter((p) => p.paymentStatus === "REFUNDED").length} transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Payment Transactions</h2>
        {payments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No payment transactions found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-medium text-gray-500">Booking ID</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Customer</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">Amount</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Method</th>
                <th className="text-center py-3 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-mono text-blue-600 text-xs font-medium">{p.bookingId}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {(p.customer.name || p.customer.phone).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{p.customer.name || p.customer.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold">{formatCurrency(p.finalAmount)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`badge ${p.paymentMethod === "ONLINE" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}>
                      {p.paymentMethod === "CASH_ON_DELIVERY" ? "CASH" : "ONLINE"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`badge ${
                      p.paymentStatus === "PAID" ? "bg-green-100 text-green-700" :
                      p.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
