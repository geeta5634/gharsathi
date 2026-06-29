"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const SERVICE_OPTIONS = [
  { value: "PLUMBER", label: "Plumber" },
  { value: "ELECTRICIAN", label: "Electrician" },
  { value: "DRIVER", label: "Driver" },
  { value: "MAID", label: "Maid/Bai" },
  { value: "CARPENTER", label: "Carpenter" },
  { value: "HOUSE_PAINTER", label: "House Painter" },
  { value: "HOUSE_CLEANER", label: "House Cleaning" },
  { value: "LOCKSMITH", label: "Locksmith" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("PLUMBER");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (phone.length < 10 || !name) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        phone,
        otp: "123456",
        role: "WORKER",
        serviceCategory,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Registration failed");
        return;
      }
      toast.success("Registration successful!");
      router.push("/worker/dashboard");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">GharSathi</h1>
          <p className="text-gray-600 mt-2">Join as a Service Professional</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Worker Registration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter your 10-digit phone number"
                className="input-field"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Category
              </label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="input-field"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRegister}
              disabled={loading || !name || phone.length < 10}
              className="btn-primary w-full"
            >
              {loading ? "Registering..." : "Register & Login"}
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
