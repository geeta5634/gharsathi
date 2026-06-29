"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SERVICE_CATEGORIES, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface WorkerDetail {
  id: string;
  serviceCategory: string;
  bio: string | null;
  skills: string[];
  hourlyRate: number;
  visitCharge: number;
  rating: number;
  totalReviews: number;
  yearsOfExperience: number;
  trustScore: number;
  isAvailable: boolean;
  isVerified: boolean;
  city: string | null;
  area: string | null;
  completedJobs: number;
  user: { name: string | null; phone: string; avatarUrl: string | null; createdAt: string };
  reviews: { id: string; rating: number; comment: string | null; createdAt: string; reviewer: { name: string | null }; booking: { service: { name: string } } }[];
  availabilities: { dayOfWeek: number; startTime: string; endTime: string }[];
  neighborhoodRecs: { neighborhood: string; count: number }[];
}

export default function WorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/workers/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.skills === "string") {
          try { data.skills = JSON.parse(data.skills); } catch { data.skills = []; }
        }
        setWorker(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleBook = () => {
    if (worker) {
      router.push(`/customer/bookings/new?workerId=${worker.id}&service=${worker.serviceCategory}`);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-100 rounded-xl" />
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">😕</p>
        <h3 className="text-xl font-semibold">Worker not found</h3>
      </div>
    );
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 flex-shrink-0">
              {worker.user.name?.[0] || "W"}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {worker.user.name || "Worker"}
                  </h1>
                  <p className="text-gray-500">
                    {SERVICE_CATEGORIES.find((s) => s.id === worker.serviceCategory)?.name || worker.serviceCategory}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    worker.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {worker.isAvailable ? "Available" : "Busy"}
                  </span>
                  {worker.isVerified && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Verified ✓
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold">{worker.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({worker.totalReviews} reviews)</span>
                </div>
                <div className="text-sm text-gray-500">
                  {worker.yearsOfExperience} years experience
                </div>
                <div className="text-sm text-gray-500">
                  {worker.completedJobs} jobs completed
                </div>
              </div>
              {worker.bio && (
                <p className="mt-4 text-gray-700">{worker.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {worker.skills.length > 0 ? worker.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                {skill}
              </span>
            )) : (
              <p className="text-gray-400 text-sm">No skills listed</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Availability</h2>
          {worker.availabilities.length > 0 ? (
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                const avail = worker.availabilities.find((a) => a.dayOfWeek === i);
                return (
                  <div key={day} className={`p-3 rounded-lg text-center text-sm ${
                    avail ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
                  }`}>
                    <div className="font-medium">{day}</div>
                    {avail ? (
                      <div className="text-xs mt-1">{avail.startTime}-{avail.endTime}</div>
                    ) : (
                      <div className="text-xs mt-1">-</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No availability set</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            Reviews ({worker.reviews.length})
          </h2>
          {worker.reviews.length > 0 ? (
            <div className="space-y-4">
              {worker.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.reviewer.name || "Anonymous"}</span>
                    <span className="text-xs text-gray-400">
                      {review.booking.service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No reviews yet</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Visit Charge</span>
              <span className="font-semibold">{formatCurrency(worker.visitCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="font-semibold">{formatCurrency(worker.hourlyRate)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-medium">Trust Score</span>
              <span className={`font-bold ${
                worker.trustScore >= 80 ? "text-green-600" : worker.trustScore >= 50 ? "text-yellow-600" : "text-red-600"
              }`}>{worker.trustScore.toFixed(0)}%</span>
            </div>
          </div>
          {worker.neighborhoodRecs.length > 0 && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-700 mb-2">🏘️ Neighborhood Network</p>
              {worker.neighborhoodRecs.map((rec) => (
                <p key={rec.neighborhood} className="text-xs text-green-600">
                  Recommended by {rec.count} resident{rec.count > 1 ? "s" : ""} in {rec.neighborhood}
                </p>
              ))}
            </div>
          )}
          <button
            onClick={handleBook}
            disabled={!worker.isAvailable}
            className="btn-primary w-full py-3 text-lg"
          >
            {worker.isAvailable ? "Book Now" : "Currently Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}
