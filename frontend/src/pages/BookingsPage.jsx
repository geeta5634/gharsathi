import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsAPI } from "../services/api";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await bookingsAPI.getAll();
      setBookings(res.data.bookings);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="section-header">
        <h2>My Bookings</h2>
        <Link to="/" className="btn btn-primary btn-sm">
          + New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Book your first home service to get started!</p>
          <Link to="/" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.serviceName}</h3>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-card-details">
                <div className="booking-detail">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{booking.slotDate}</span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{booking.slotTime}</span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">
                    ₹{booking.servicePrice.toLocaleString()}
                  </span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Payment</span>
                  <span className="detail-value">
                    {booking.payment?.status === "SUCCESS" ? (
                      <span style={{ color: "var(--success)" }}>Paid</span>
                    ) : (
                      <Link
                        to={`/payment/${booking.id}`}
                        style={{ color: "var(--warning)", textDecoration: "underline" }}
                      >
                        Pay Now
                      </Link>
                    )}
                  </span>
                </div>
              </div>
              {booking.address && (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  📍 {booking.address}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
