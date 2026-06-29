"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface EarningsStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  dailyBreakdown: { date: string; count: number; earnings: number }[];
  completedJobs: number;
}

export default function EarningsPage() {
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/worker-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Earnings & Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(stats?.totalEarnings || 0)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">This Month</p>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats?.thisMonthEarnings || 0)}
          </p>
          {stats && stats.lastMonthEarnings > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              vs {formatCurrency(stats.lastMonthEarnings)} last month
            </p>
          )}
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Completed Jobs</p>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.completedJobs || 0}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Daily Earnings (Last 30 Days)</h2>
        {stats?.dailyBreakdown && stats.dailyBreakdown.length > 0 ? (
          <div className="space-y-2">
            {stats.dailyBreakdown.map((day) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short"
                  })}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{day.count} job{day.count > 1 ? "s" : ""}</span>
                  <span className="font-semibold text-sm">{formatCurrency(day.earnings)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No earnings data yet</p>
        )}
      </div>

      <div className="card mt-4">
        <h2 className="text-lg font-semibold mb-4">Payout History</h2>
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🏦</p>
          <p className="text-gray-500">Payouts are processed every Monday</p>
          <p className="text-sm text-gray-400 mt-1">Configure your bank details in Profile</p>
        </div>
      </div>
    </div>
  );
}
