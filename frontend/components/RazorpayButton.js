"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
      const orderRes = await api.post('/payments/create-order', { amount, bookingId });
      const { orderId, key } = orderRes.data;

      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: amount * 100,
        currency: 'INR',
        name: 'GharSathi',
        description: description || 'Service Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });
            setStatus('success');
            toast.success('Payment successful!');
            if (onSuccess) onSuccess(verifyRes.data);
          } catch {
            setStatus('error');
            toast.error('Payment verification failed');
          }
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initialization failed');
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
      {loading ? (
        <>
          <FaSpinner className="animate-spin" /> Processing...
        </>
      ) : (
        `Pay ₹${amount} with Razorpay`
      )}
    </button>
  );
}
