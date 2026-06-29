"use client";

import { useState } from "react";
import { SUBSCRIPTION_TIERS, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setLoading(tier);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Subscribed to ${tier} plan!`);
      router.refresh();
    } catch {
      toast.error("Subscription failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Membership Plans</h1>
        <p className="text-gray-600 mt-2">Choose the plan that fits your home service needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SUBSCRIPTION_TIERS.map((plan) => (
          <div
            key={plan.tier}
            className={`card relative ${
              plan.tier === "PREMIUM"
                ? "ring-2 ring-blue-500 shadow-lg scale-105"
                : ""
            }`}
          >
            {plan.tier === "PREMIUM" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                Most Popular
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                ₹{plan.price}
                <span className="text-base text-gray-500 font-normal">/mo</span>
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <FeatureRow included={plan.features.bookingPriority} label="Priority Booking" />
              <FeatureRow
                included={true}
                label={`${plan.features.freeVisits} Free Visit${plan.features.freeVisits > 1 ? "s" : ""} / Month`}
              />
              <FeatureRow included={true} label={`Up to ${plan.features.discount}% Discount`} />
              <FeatureRow included={true} label={plan.features.support} />
              {plan.tier === "BASIC" ? (
                <FeatureRow included={false} label="Service Reminders" />
              ) : (
                <FeatureRow included={true} label="Service Reminders" />
              )}
              {plan.tier === "VIP" ? (
                <FeatureRow included={true} label="Annual Health Check" />
              ) : (
                <FeatureRow included={false} label="Annual Health Check" />
              )}
            </div>
            <button
              onClick={() => handleSubscribe(plan.tier)}
              disabled={loading === plan.tier}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                plan.tier === "VIP"
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : plan.tier === "PREMIUM"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              } disabled:opacity-50`}
            >
              {loading === plan.tier ? "Subscribing..." : `Subscribe ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h2>
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="text-center py-3 px-4 font-semibold">Basic (₹99)</th>
                <th className="text-center py-3 px-4 font-semibold">Premium (₹199)</th>
                <th className="text-center py-3 px-4 font-semibold">VIP (₹299)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Booking Priority", basic: "✓", premium: "✓", vip: "✓" },
                { feature: "Free Visits / Month", basic: "1", premium: "2", vip: "4" },
                { feature: "Max Discount", basic: "10%", premium: "20%", vip: "30%" },
                { feature: "24x7 Support", basic: "✓", premium: "✓", vip: "✓" },
                { feature: "Service Reminders", basic: "-", premium: "✓", vip: "✓" },
                { feature: "Annual Health Check", basic: "-", premium: "-", vip: "✓" },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                  <td className="text-center py-3 px-4 font-medium">{row.basic}</td>
                  <td className="text-center py-3 px-4 font-medium text-blue-600">{row.premium}</td>
                  <td className="text-center py-3 px-4 font-medium text-purple-600">{row.vip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ included, label }: { included: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={included ? "text-green-500" : "text-gray-300"}>
        {included ? "✓" : "✗"}
      </span>
      <span className={included ? "text-gray-700" : "text-gray-400"}>{label}</span>
    </div>
  );
}
