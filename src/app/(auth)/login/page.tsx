"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP sent to " + phone);
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) {
      toast.error("Please enter OTP");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        phone,
        otp,
        role,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid OTP");
        return;
      }
      toast.success("Login successful!");
      const redirectPath =
        role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
      router.push(redirectPath);
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">GharSathi</h1>
          <p className="text-gray-600 mt-2">Your trusted home services platform</p>
        </div>
        <div className="card">
          {step === "phone" ? (
            <>
              <h2 className="text-xl font-semibold mb-6">Welcome Back</h2>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setRole("CUSTOMER")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    role === "CUSTOMER"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => setRole("WORKER")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    role === "WORKER"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Worker
                </button>
              </div>
              <div className="space-y-4">
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
                <button
                  onClick={sendOtp}
                  disabled={loading || phone.length < 10}
                  className="btn-primary w-full"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
              <p className="text-sm text-gray-500 mb-6">
                OTP sent to {phone}
                <button
                  onClick={() => setStep("phone")}
                  className="text-blue-600 ml-1 hover:underline"
                >
                  Change
                </button>
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="input-field text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length < 4}
                  className="btn-primary w-full"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </div>
            </>
          )}
        </div>
        {role === "WORKER" && step === "phone" && (
          <p className="text-center text-sm text-gray-500 mt-4">
            New worker?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
