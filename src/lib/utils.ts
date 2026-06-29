import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GS-${timestamp}-${random}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    WORKER_ASSIGNED: "bg-indigo-100 text-indigo-800",
    WORKER_ON_THE_WAY: "bg-purple-100 text-purple-800",
    SERVICE_STARTED: "bg-orange-100 text-orange-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    WORKER_ASSIGNED: "Worker Assigned",
    WORKER_ON_THE_WAY: "Worker On The Way",
    SERVICE_STARTED: "Service Started",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
}

export const SERVICE_CATEGORIES = [
  { id: "PLUMBER", name: "Plumber", icon: "🔧", color: "bg-blue-500" },
  { id: "ELECTRICIAN", name: "Electrician", icon: "⚡", color: "bg-yellow-500" },
  { id: "DRIVER", name: "Driver", icon: "🚗", color: "bg-green-500" },
  { id: "MAID", name: "Maid/Bai", icon: "🧹", color: "bg-pink-500" },
  { id: "CARPENTER", name: "Carpenter", icon: "🪚", color: "bg-orange-500" },
  { id: "HOUSE_PAINTER", name: "House Painter", icon: "🎨", color: "bg-purple-500" },
  { id: "HOUSE_CLEANER", name: "House Cleaning", icon: "🧽", color: "bg-teal-500" },
  { id: "LOCKSMITH", name: "Locksmith", icon: "🔐", color: "bg-red-500" },
] as const;

export const SUBSCRIPTION_TIERS = [
  {
    tier: "BASIC",
    name: "Basic",
    price: 99,
    features: {
      bookingPriority: true,
      freeVisits: 1,
      discount: 10,
      support: "24x7 Support",
      extras: [],
    },
  },
  {
    tier: "PREMIUM",
    name: "Premium",
    price: 199,
    features: {
      bookingPriority: true,
      freeVisits: 2,
      discount: 20,
      support: "24x7 Support",
      extras: ["Service Reminders"],
    },
  },
  {
    tier: "VIP",
    name: "VIP",
    price: 299,
    features: {
      bookingPriority: true,
      freeVisits: 4,
      discount: 30,
      support: "24x7 Support",
      extras: ["Service Reminders", "Annual Health Check"],
    },
  },
] as const;

export function getDiscountMultiplier(tier: string | null): number {
  switch (tier) {
    case "VIP": return 0.7;
    case "PREMIUM": return 0.8;
    case "BASIC": return 0.9;
    default: return 1;
  }
}
