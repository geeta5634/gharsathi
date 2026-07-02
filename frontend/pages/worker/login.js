import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HiOutlinePhone, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function WorkerLogin() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const sendOtp = () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    toast.success('OTP sent to ' + phone);
    setStep('otp');
  };

  const verifyOtp = () => {
    if (otp.length < 4) {
      toast.error('Please enter the OTP');
      return;
    }
    toast.success('Login successful!');
    router.push('/worker/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Worker Login</h1>
          <p className="text-gray-500 mt-1">Sign in to manage your bookings and earnings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'phone' && (
            <div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm rounded-lg p-3 mb-6">
                <HiOutlineShieldCheck className="w-5 h-5" />
                <span>You will receive a 6-digit OTP for verification</span>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative mb-6">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="input-field pl-12"
                  maxLength={10}
                />
              </div>

              <button onClick={sendOtp} className="btn-primary w-full flex items-center justify-center gap-2">
                <HiOutlinePhone className="w-5 h-5" />
                Send OTP
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Enter the OTP sent to</p>
              <p className="font-semibold mb-4">+91 {phone}</p>

              <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="input-field text-center text-lg tracking-widest mb-4"
                maxLength={6}
              />

              <button onClick={verifyOtp} className="btn-primary w-full flex items-center justify-center gap-2">
                <HiOutlineLockClosed className="w-5 h-5" />
                Verify & Login
              </button>

              <div className="flex items-center justify-between mt-4">
                <button onClick={() => setStep('phone')} className="text-sm text-gray-500 hover:text-gray-700">
                  ← Change Number
                </button>
                <button onClick={sendOtp} className="text-sm text-primary-500 hover:underline">
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Looking to book a service? <Link href="/booking" className="text-primary-500 hover:underline">Book Now</Link>
        </p>
      </div>
    </div>
  );
}
