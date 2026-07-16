"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function RazorpayButton({ amount, onSuccess, bookingId, description }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: amount * 100,
        currency: 'INR',
        name: 'GharSathi',
        description: description || 'Service Payment',
        order_id: bookingId || 'order_' + Date.now(),
        handler: async () => {
          setStatus('success');
          toast.success('Payment successful!');
          if (onSuccess) onSuccess();
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#2563eb' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Payment gateway not loaded. Try again.');
      }
    } catch {
      toast.error('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-600 font-semibold py-3">
        <FaCheckCircle /> Payment Successful
      </div>
    );
  }

  return (
    <button onClick={handlePayment} disabled={loading} className="w-full btn-accent flex items-center justify-center gap-2">
      {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : `Pay ₹${amount} with Razorpay`}
    </button>
  );
}
