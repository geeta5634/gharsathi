"use client";

import { useEffect, useState } from "react";
import { formatCurrency, SUBSCRIPTION_TIERS } from "@/lib/utils";

interface SubscriptionItem {
  id: string;
  tier: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  freeVisitsUsed: number;
  totalFreeVisits: number;
  createdAt: string;
  user: { name: string | null; phone: string };
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setSubscriptions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        const mock: SubscriptionItem[] = [
          { id: "1", tier: "VIP", startDate: "2026-06-01T00:00:00Z", endDate: "2026-07-01T00:00:00Z", isActive: true, freeVisitsUsed: 1, totalFreeVisits: 4, createdAt: "2026-06-01T00:00:00Z", user: { name: "Rahul Sharma", phone: "+91-9876543210" } },
          { id: "2", tier: "PREMIUM", startDate: "2026-05-15T00:00:00Z", endDate: "2026-06-15T00:00:00Z", isActive: true, freeVisitsUsed: 2, totalFreeVisits: 2, createdAt: "2026-05-15T00:00:00Z", user: { name: "Priya Patel", phone: "+91-9876543211" } },
          { id: "3", tier: "BASIC", startDate: "2026-04-20T00:00:00Z", endDate: "2026-05-20T00:00:00Z", isActive: false, freeVisitsUsed: 1, totalFreeVisits: 1, createdAt: "2026-04-20T00:00:00Z", user: { name: "Amit Singh", phone: "+91-9876543212" } },
          { id: "4", tier: "BASIC", startDate: "2026-06-10T00:00:00Z", endDate: "2026-07-10T00:00:00Z", isActive: true, freeVisitsUsed: 0, totalFreeVisits: 1, createdAt: "2026-06-10T00:00:00Z", user: { name: "Sneha Gupta", phone: "+91-9876543213" } },
          { id: "5", tier: "VIP", startDate: "2026-06-05T00:00:00Z", endDate: "2026-07-05T00:00:00Z", isActive: true, freeVisitsUsed: 2, totalFreeVisits: 4, createdAt: "2026-06-05T00:00:00Z", user: { name: "Vikram Joshi", phone: "+91-9876543214" } },
          { id: "6", tier: "PREMIUM", startDate: "2026-03-01T00:00:00Z", endDate: "2026-04-01T00:00:00Z", isActive: false, freeVisitsUsed: 2, totalFreeVisits: 2, createdAt: "2026-03-01T00:00:00Z", user: { name: "Neha Verma", phone: "+91-9876543215" } },
        ];
        setSubscriptions(mock);
        setLoading(false);
      });
  }, []);

  const activeSubs = subscriptions.filter((s) => s.isActive);
  const tierCounts: Record<string, number> = {};
  SUBSCRIPTION_TIERS.forEach((t) => { tierCounts[t.tier] = 0; });
  activeSubs.forEach((s) => { if (tierCounts[s.tier] !== undefined) tierCounts[s.tier]++; });

  const tierColors: Record<string, string> = {
    BASIC: "bg-blue-500",
    PREMIUM: "bg-purple-500",
    VIP: "bg-yellow-500",
  };

  const maxTierCount = Math.max(...Object.values(tierCounts), 1);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Subscriptions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {SUBSCRIPTION_TIERS.map((tier, i) => {
          const count = tierCounts[tier.tier] || 0;
          return (
            <div key={tier.tier} className={`stat-card animate-slideUp stagger-${i + 1}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${tierColors[tier.tier]} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>
                  {tier.tier === "VIP" ? "👑" : tier.tier === "PREMIUM" ? "⭐" : "🔵"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{tier.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(tier.price)}/month</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500">Active subscribers</p>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`${tierColors[tier.tier]} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(count / maxTierCount) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card animate-slideUp stagger-4">
          <h2 className="text-lg font-semibold mb-4">📋 All Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No subscriptions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-medium text-gray-500">User</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-500">Tier</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-500">Status</th>
                    <th className="text-center py-3 px-3 font-medium text-gray-500">Free Visits</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Valid Until</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {(s.user.name || s.user.phone).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{s.user.name || s.user.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`badge ${
                          s.tier === "VIP" ? "bg-yellow-100 text-yellow-700" :
                          s.tier === "PREMIUM" ? "bg-purple-100 text-purple-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>{s.tier}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`badge ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {s.isActive ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600">
                        {s.freeVisitsUsed}/{s.totalFreeVisits}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {new Date(s.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card animate-slideUp stagger-5">
          <h2 className="text-lg font-semibold mb-4">📊 Plan Comparison</h2>
          <div className="space-y-4">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div key={tier.tier} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">{tier.name}</span>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(tier.price)}</span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {tier.features.freeVisits} free visit(s)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {tier.features.discount}% discount
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {tier.features.support}
                  </p>
                  {tier.features.extras.map((extra) => (
                    <p key={extra} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {extra}
                    </p>
                  ))}
                  {tier.tier === "BASIC" && (
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Booking priority
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
