"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SERVICE_CATEGORIES, formatCurrency, cn, getInitials } from "@/lib/utils";

interface Worker {
  id: string;
  serviceCategory: string;
  hourlyRate: number;
  visitCharge: number;
  rating: number;
  totalReviews: number;
  yearsOfExperience: number;
  isAvailable: boolean;
  trustScore: number;
  city: string | null;
  user: { id: string; name: string | null; avatarUrl: string | null };
}

function WorkersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get("category") || "";
  const emergencyFilter = searchParams.get("emergency") === "true";

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [sortBy, setSortBy] = useState("rating");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy) params.set("sortBy", sortBy);
    if (search) params.set("search", search);
    if (emergencyFilter) params.set("category", "PLUMBER,ELECTRICIAN,LOCKSMITH");

    fetch(`/api/workers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data.workers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory, sortBy, search, emergencyFilter]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn(i < Math.round(rating) ? "text-yellow-400" : "text-gray-200", "text-sm")}>★</span>
    ));

  const getTrustBadge = (score: number) => {
    if (score >= 80) return { color: "bg-green-50 text-green-700 border-green-200", label: "Verified" };
    if (score >= 50) return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Standard" };
    return { color: "bg-red-50 text-red-700 border-red-200", label: "Low" };
  };

  const svgSearchIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );

  const svgSortIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  );

  const svgEmptySearch = (
    <svg className="w-24 h-24 mx-auto mb-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideUp opacity-0 [animation-fill-mode:forwards]">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {emergencyFilter ? (
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600 text-xl">🚨</span>
              Emergency Services
            </span>
          ) : (
            <span className="text-gradient">Find Workers</span>
          )}
        </h1>
        <p className="text-gray-500 mt-1.5 text-lg">
          Browse trusted professionals near you
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2.5 animate-slideUp stagger-1 opacity-0 [animation-fill-mode:forwards]">
        <button
          onClick={() => { setSelectedCategory(""); router.push("/customer/workers"); }}
          className={cn(
            "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
            !selectedCategory
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-1 ring-blue-700"
              : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
          )}
        >
          All
        </button>
        {SERVICE_CATEGORIES.map((svc) => (
          <button
            key={svc.id}
            onClick={() => { setSelectedCategory(svc.id); router.push(`/customer/workers?category=${svc.id}`); }}
            className={cn(
              "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
              selectedCategory === svc.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-1 ring-blue-700"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
            )}
          >
            <span className="text-base leading-none">{svc.icon}</span>
            {svc.name}
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slideUp stagger-2 opacity-0 [animation-fill-mode:forwards]">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {svgSearchIcon}
          </div>
          <input
            type="text"
            placeholder="Search workers by name, skill, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 pr-4"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-48">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {svgSortIcon}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field pl-9 pr-8 appearance-none bg-white cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="trustScore">Trust Score</option>
            <option value="yearsOfExperience">Most Experienced</option>
            <option value="visitCharge">Lowest Price</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={cn("card", `stagger-${Math.min(i, 5)}`, "animate-slideUp opacity-0 [animation-fill-mode:forwards]")}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="w-3.5 h-3.5 shimmer rounded" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="h-4 shimmer rounded w-16" />
                <div className="h-4 shimmer rounded w-16" />
                <div className="h-4 shimmer rounded w-12" />
              </div>
              <div className="mt-4 h-10 shimmer rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && workers.length === 0 && (
        <div className="text-center py-16 animate-slideUp stagger-3 opacity-0 [animation-fill-mode:forwards]">
          <div className="mb-4">{svgEmptySearch}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find any workers matching your current filters. Try adjusting your search or category.
          </p>
          <button
            onClick={() => { setSelectedCategory(""); setSearch(""); setSortBy("rating"); router.push("/customer/workers"); }}
            className="btn-primary"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Worker Grid */}
      {!loading && workers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((worker, index) => {
            const trustBadge = getTrustBadge(worker.trustScore);
            const gradientColors = [
              "from-blue-500 to-purple-600",
              "from-emerald-500 to-teal-600",
              "from-orange-500 to-pink-600",
              "from-indigo-500 to-blue-600",
              "from-rose-500 to-red-600",
            ];
            const avatarGradient = gradientColors[index % gradientColors.length];

            return (
              <Link
                key={worker.id}
                href={`/customer/workers/${worker.id}`}
                className={cn(
                  "card card-hover group relative overflow-hidden",
                  `stagger-${(index % 5) + 1}`,
                  "animate-slideUp opacity-0 [animation-fill-mode:forwards]"
                )}
              >
                {/* Top accent bar */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                  worker.isAvailable ? "from-green-400 to-emerald-500" : "from-gray-300 to-gray-400"
                )} />

                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-lg",
                    avatarGradient
                  )}>
                    {getInitials(worker.user.name || "W")}
                    {/* Availability ring */}
                    <span className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white",
                      worker.isAvailable ? "bg-green-500" : "bg-red-400"
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                      {worker.user.name || "Worker"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <span className="text-base leading-none">
                        {SERVICE_CATEGORIES.find((s) => s.id === worker.serviceCategory)?.icon}
                      </span>
                      {SERVICE_CATEGORIES.find((s) => s.id === worker.serviceCategory)?.name || worker.serviceCategory}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(worker.rating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{worker.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({worker.totalReviews.toLocaleString()})</span>
                    </div>
                  </div>

                  {/* City badge */}
                  {worker.city && (
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 whitespace-nowrap">
                      {worker.city}
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Visit Charge</p>
                    <p className="font-bold text-gray-900 mt-0.5">{formatCurrency(worker.visitCharge)}</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Experience</p>
                    <p className="font-bold text-gray-900 mt-0.5">{worker.yearsOfExperience} yrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Trust</p>
                    <p className="mt-0.5">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border", trustBadge.color)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", worker.trustScore >= 80 ? "bg-green-500" : worker.trustScore >= 50 ? "bg-yellow-500" : "bg-red-500")} />
                        {trustBadge.label}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Book Now button */}
                <div className="mt-4">
                  <span className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 block text-center",
                    worker.isAvailable
                      ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-default"
                  )}>
                    {worker.isAvailable ? "Book Now" : "Currently Busy"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-10 w-72 shimmer rounded-lg" />
        <div className="h-10 shimmer rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="w-3.5 h-3.5 shimmer rounded" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="h-4 shimmer rounded w-16" />
                <div className="h-4 shimmer rounded w-16" />
                <div className="h-4 shimmer rounded w-12" />
              </div>
              <div className="mt-4 h-10 shimmer rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    }>
      <WorkersContent />
    </Suspense>
  );
}
