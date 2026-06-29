"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="card max-w-2xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {session?.user?.name?.[0] || "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {session?.user?.name || "Customer"}
            </h2>
            <p className="text-gray-500">{session?.user?.phone}</p>
            {session?.user?.email && (
              <p className="text-gray-500">{session.user.email}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">Phone</label>
            <p className="font-medium">{session?.user?.phone}</p>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Role</label>
            <p className="font-medium capitalize">{session?.user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
