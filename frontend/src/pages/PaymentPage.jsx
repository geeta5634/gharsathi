import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingsAPI, paymentsAPI } from "../services/api";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const res = await bookingsAPI.getOne(bookingId);
      setBooking(res.data.booking);
      if (res.data.booking.status === "CONFIRMED") {
        navigate(`/success/${bookingId}`);
      }
    } catch (err) {
      toast.error("Booking not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const orderRes = await paymentsAPI.createOrder(bookingId);
      const { orderId, amount, currency, keyId, mock } = orderRes.data;

      if (mock) {
        await paymentsAPI.verify({
          razorpay_order_id: orderId,
          razorpay_payment_id: "pay_mock_" + Date.now(),
          razorpay_signature: "mock_signature",
        });
        toast.success("Payment successful!");
        navigate(`/success/${bookingId}`);
        return;
      }

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "GharSathi",
        description: `Payment for ${booking.serviceName}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await paymentsAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            navigate(`/success/${bookingId}`);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: booking.user?.name || "",
          contact: booking.user?.phone || "",
        },
        theme: {
          color: "#6C63FF",
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
            toast.error("Payment cancelled");
          },
        },
      };

      if (typeof window.Razorpay !== "undefined") {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await paymentsAPI.verify({
          razorpay_order_id: orderId,
          razorpay_payment_id: "pay_" + Date.now(),
          razorpay_signature: "dev_" + Date.now(),
        });
        toast.success("Payment successful (dev mode)!");
        navigate(`/success/${bookingId}`);
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
      setPaying(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!booking) return null;

  return (
    <div className="payment-page">
      <div className="payment-icon">💳</div>
      <h2>Complete Payment</h2>
      <p className="subtitle">Secure payment powered by Razorpay</p>

      <div className="payment-amount">
        <small>₹</small>{booking.servicePrice.toLocaleString()}
      </div>

      <div className="summary-card" style={{ textAlign: "left", marginBottom: "32px" }}>
        <div className="summary-row">
          <span className="label">Service</span>
          <span className="value">{booking.serviceName}</span>
        </div>
        <div className="summary-row">
          <span className="label">Date</span>
          <span className="value">{booking.slotDate}</span>
        </div>
        <div className="summary-row">
          <span className="label">Time</span>
          <span className="value">{booking.slotTime}</span>
        </div>
        <div className="summary-row">
          <span className="label">Address</span>
          <span className="value">{booking.address}</span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block btn-lg"
        onClick={handlePayment}
        disabled={paying}
      >
        {paying ? "Processing..." : "Pay ₹" + booking.servicePrice.toLocaleString()}
      </button>

      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "16px" }}>
        🔒 Your payment is secured with 256-bit SSL encryption
      </p>

      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: "12px" }}
        onClick={() => navigate(-1)}
        disabled={paying}
      >
        Go Back
      </button>
    </div>
  );
}
