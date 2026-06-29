"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatCurrency, SERVICE_CATEGORIES } from "@/lib/utils";
import toast from "react-hot-toast";

function NewBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workerId = searchParams.get("workerId");
  const serviceCategory = searchParams.get("service");

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "ONLINE">("CASH_ON_DELIVERY");
  const [problemPhoto, setProblemPhoto] = useState<File | null>(null);
  const [problemDescription, setProblemDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const timeSlots = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
    "17:00-18:00", "18:00-19:00",
  ];

  const handleSubmit = async () => {
    if (!date || !timeSlot || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const body = {
        serviceId: serviceCategory || "PLUMBER",
        scheduledDate: date,
        timeSlot,
        address,
        workerId: workerId || undefined,
        paymentMethod,
        problemDescription: problemDescription || undefined,
        isEmergency: false,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking");
      }

      const booking = await res.json();
      toast.success("Booking created successfully!");
      router.push(`/customer/bookings/${booking.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
      <p className="text-gray-600 mb-8">Fill in the details to schedule your service</p>

      <div className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Category *
          </label>
          <select
            value={serviceCategory || "PLUMBER"}
            disabled
            className="input-field bg-gray-50"
          >
            {SERVICE_CATEGORIES.map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Slot *
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="input-field"
            >
              <option value="">Select time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Address *
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Enter your complete address"
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problem Description (Optional)
          </label>
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            rows={2}
            placeholder="Describe the issue briefly"
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Problem Photo (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <p className="text-gray-500 text-sm">Click to upload a photo of the issue</p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG (max 5MB)</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
              className={`p-4 rounded-xl border-2 text-center transition-colors ${
                paymentMethod === "CASH_ON_DELIVERY"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-2xl mb-1">💵</p>
              <p className="font-medium text-sm">Cash on Delivery</p>
            </button>
            <button
              onClick={() => setPaymentMethod("ONLINE")}
              className={`p-4 rounded-xl border-2 text-center transition-colors ${
                paymentMethod === "ONLINE"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-2xl mb-1">💳</p>
              <p className="font-medium text-sm">Online Payment</p>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Visit Charge</span>
              <span>{formatCurrency(199)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Service Charge</span>
              <span>{formatCurrency(159)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(358)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !date || !timeSlot || !address}
          className="btn-primary w-full py-3 text-lg"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="h-96 bg-gray-100 rounded-xl animate-pulse" />}>
      <NewBookingContent />
    </Suspense>
  );
}
