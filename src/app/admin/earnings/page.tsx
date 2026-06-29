"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function AdminEarningsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(data?.totalRevenue || 0)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold text-green-600">{data?.totalBookings || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Avg. Per Booking</p>
          <p className="text-3xl font-bold text-purple-600">
            {data?.totalBookings ? formatCurrency(data.totalRevenue / data.totalBookings) : "₹0"}
          </p>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Revenue by Service</h2>
        {data?.bookingsByService?.length > 0 ? (
          <div className="space-y-3">
            {data.bookingsByService.map((svc: any) => (
              <div key={svc.name} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">{svc.name}</span>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-500">{svc.count} bookings</span>
                  <span className="font-semibold">{formatCurrency(svc.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No data</p>
        )}
      </div>
    </div>
  );
}
