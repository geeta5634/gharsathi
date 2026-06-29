"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SERVICE_CATEGORIES } from "@/lib/utils";
import toast from "react-hot-toast";

interface WorkerProfile {
  id: string;
  serviceCategory: string;
  bio: string | null;
  skills: string[];
  hourlyRate: number;
  visitCharge: number;
  yearsOfExperience: number;
  isAvailable: boolean;
  isVerified: boolean;
  kycStatus: string;
  city: string | null;
  area: string | null;
  trustScore: number;
  rating: number;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankIfscCode: string | null;
  user: { name: string | null; email: string | null };
  kycDocuments: { id: string; type: string; status: string; createdAt: string }[];
}

export default function WorkerProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/workers/${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        let skillList: string[] = [];
        if (typeof data.skills === "string") {
          try { skillList = JSON.parse(data.skills); } catch { skillList = []; }
        } else if (Array.isArray(data.skills)) {
          skillList = data.skills;
        }
        setForm({
          bio: data.bio || "",
          skills: skillList.join(", "),
          hourlyRate: data.hourlyRate || 0,
          visitCharge: data.visitCharge || 0,
          yearsOfExperience: data.yearsOfExperience || 0,
          city: data.city || "",
          area: data.area || "",
          isAvailable: data.isAvailable,
          bankAccountName: data.bankAccountName || "",
          bankAccountNumber: data.bankAccountNumber || "",
          bankIfscCode: data.bankIfscCode || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/workers/${profile!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: JSON.stringify(
            form.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          ),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {profile?.user?.name?.[0] || "W"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {profile?.user?.name || session?.user?.phone}
            </h2>
            <p className="text-gray-500">
              {SERVICE_CATEGORIES.find((s) => s.id === profile?.serviceCategory)?.name}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                profile?.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {profile?.isVerified ? "Verified ✓" : "Unverified"}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                profile?.kycStatus === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              }`}>
                KYC: {profile?.kycStatus}
              </span>
              <span className="text-sm text-gray-500">Trust Score: {profile?.trustScore.toFixed(0)}%</span>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary text-sm"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="input-field resize-none"
                placeholder="Tell customers about yourself"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="input-field"
                  placeholder="e.g., pipe repair, faucet installation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={form.yearsOfExperience}
                  onChange={(e) => setForm({ ...form, yearsOfExperience: parseFloat(e.target.value) })}
                  className="input-field"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Charge (₹)</label>
                <input
                  type="number"
                  value={form.visitCharge}
                  onChange={(e) => setForm({ ...form, visitCharge: parseFloat(e.target.value) })}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) })}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
              </label>
              <span className="text-sm font-medium text-gray-700">
                Available for work ({form.isAvailable ? "Online" : "Offline"})
              </span>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">🏦 Bank Account Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={form.bankAccountName}
                    onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={form.bankAccountNumber}
                    onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={form.bankIfscCode}
                    onChange={(e) => setForm({ ...form, bankIfscCode: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <button onClick={handleSave} className="btn-primary w-full">
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {profile?.bio && (
              <div>
                <p className="text-sm text-gray-500 mb-1">About</p>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Visit Charge</p>
                <p className="font-semibold">₹{profile?.visitCharge}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="font-semibold">₹{profile?.hourlyRate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold">{profile?.yearsOfExperience} yrs</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-semibold">{profile?.rating.toFixed(1)} ★</p>
              </div>
            </div>
            {(() => {
              const skillArr = typeof profile?.skills === "string"
                ? JSON.parse(profile.skills || "[]")
                : (profile?.skills || []);
              if (skillArr.length === 0) return null;
              return (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skillArr.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">KYC Documents</p>
                  <p className="text-sm text-gray-500">
                    {profile?.kycDocuments.length} document(s) uploaded
                  </p>
                </div>
                <button className="btn-outline text-sm">Upload KYC</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
