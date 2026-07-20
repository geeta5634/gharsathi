import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesAPI, bookingsAPI } from "../services/api";
import toast from "react-hot-toast";

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      const res = await servicesAPI.getSlots(serviceId);
      setService(res.data.service);
      setDates(res.data.availableDates);
    } catch (err) {
      toast.error("Service not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedDate || !selectedSlot || !address.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingsAPI.create({
        serviceId,
        slotDate: selectedDate,
        slotTime: selectedSlot,
        address: address.trim(),
      });
      toast.success("Booking created!");
      navigate(`/payment/${res.data.booking.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;

  if (!service) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="booking-flow">
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? (step > 1 ? "completed" : "active") : ""}`}>
          <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
          <span className="step-label">Date & Time</span>
        </div>
        <div className="step-divider" />
        <div className={`step ${step >= 2 ? (step > 2 ? "completed" : "active") : ""}`}>
          <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
          <span className="step-label">Details</span>
        </div>
        <div className="step-divider" />
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <div style={{ fontSize: "40px" }}>{service.icon}</div>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "800" }}>{service.name}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            ₹{service.price.toLocaleString()} • {service.duration}
          </p>
        </div>
      </div>

      {step === 1 && (
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>Select Date</h3>
          <div className="date-grid">
            {dates.map((d) => (
              <div
                key={d.date}
                className={`date-item ${selectedDate === d.date ? "selected" : ""}`}
                onClick={() => setSelectedDate(d.date)}
              >
                <div className="day">{d.day}</div>
                <div className="date">{new Date(d.date + "T00:00:00").getDate()}</div>
                <div className="month">{formatDate(d.date).split(" ")[0]}</div>
              </div>
            ))}
          </div>

          {selectedDate && (
            <>
              <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>Select Time Slot</h3>
              <div className="time-grid">
                {dates
                  .find((d) => d.date === selectedDate)
                  ?.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`time-item ${selectedSlot === slot.time ? "selected" : ""}`}
                      onClick={() => setSelectedSlot(slot.time)}
                    >
                      {slot.time}
                    </div>
                  ))}
              </div>
            </>
          )}

          <button
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: "32px" }}
            disabled={!selectedDate || !selectedSlot}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>Service Address</h3>
          <div className="form-group">
            <label className="form-label">Full Address</label>
            <textarea
              className="form-input"
              placeholder="Enter your complete address with landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              style={{ resize: "vertical", minHeight: "80px" }}
              autoFocus
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn btn-primary btn-block btn-lg"
              disabled={!address.trim()}
              onClick={() => setStep(3)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="summary-card">
            <h3>Booking Summary</h3>
            <div className="summary-row">
              <span className="label">Service</span>
              <span className="value">{service.icon} {service.name}</span>
            </div>
            <div className="summary-row">
              <span className="label">Date</span>
              <span className="value">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="summary-row">
              <span className="label">Time</span>
              <span className="value">{selectedSlot}</span>
            </div>
            <div className="summary-row">
              <span className="label">Address</span>
              <span className="value">{address}</span>
            </div>
            <div className="summary-total">
              <span className="label">Total Amount</span>
              <span className="value">₹{service.price.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleCreateBooking}
              disabled={submitting}
            >
              {submitting ? "Creating Booking..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
