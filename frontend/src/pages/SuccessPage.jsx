import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bookingsAPI } from "../services/api";

export default function SuccessPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const res = await bookingsAPI.getOne(bookingId);
      setBooking(res.data.booking);
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!booking) return null;

  return (
    <div className="success-page">
      <div className="success-check">✓</div>
      <h2>Booking Confirmed!</h2>
      <p>
        Your {booking.serviceName} has been booked successfully. You will receive
        a confirmation shortly.
      </p>

      <div className="summary-card" style={{ textAlign: "left", marginBottom: "32px" }}>
        <h3>Booking Details</h3>
        <div className="summary-row">
          <span className="label">Booking ID</span>
          <span className="value" style={{ fontFamily: "monospace", fontSize: "12px" }}>
            {booking.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
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
        <div className="summary-row">
          <span className="label">Status</span>
          <span className="value">
            <span className="status-badge confirmed">Confirmed</span>
          </span>
        </div>
        <div className="summary-total">
          <span className="label">Amount Paid</span>
          <span className="value">₹{booking.servicePrice.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <Link to="/bookings" className="btn btn-primary">
          View My Bookings
        </Link>
        <Link to="/" className="btn btn-secondary">
          Book Another Service
        </Link>
      </div>
    </div>
  );
}
