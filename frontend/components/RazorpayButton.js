"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function RazorpayButton({ amount, bookingId, description, onSuccess }) {
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
      const orderRes = await api.post('/payments/create-order', {
        bookingId,
        amount,
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to create order');
      }

      const { orderId, amount: orderAmount, currency, key, mockMode } = orderRes.data.data;

      if (mockMode) {
        await api.post('/payments/verify', {
          razorpayOrderId: orderId,
          razorpayPaymentId: 'mock_pay_' + Date.now(),
          razorpaySignature: 'mock_sig_' + Date.now(),
          bookingId,
        });
        setStatus('success');
        toast.success('Payment successful! (Mock)');
        if (onSuccess) onSuccess();
        return;
      }

      const options = {
        key,
        amount: orderAmount,
        currency,
        name: 'GharSathi',
        description: description || 'Service Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId,
            });
            setStatus('success');
            toast.success('Payment successful!');
            if (onSuccess) onSuccess();
          } catch {
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
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initialization failed');
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
