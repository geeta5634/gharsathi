import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { servicesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await servicesAPI.getAll();
      setServices(res.data.services);
    } catch (err) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>
          Your Home, <br />
          <span className="gradient-text">Perfectly Serviced</span>
        </h1>
        <p>
          Book trusted professionals for all your home service needs. Quick,
          reliable, and at your doorstep.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="number">10K+</div>
            <div className="label">Happy Customers</div>
          </div>
          <div className="hero-stat">
            <div className="number">500+</div>
            <div className="label">Verified Pros</div>
          </div>
          <div className="hero-stat">
            <div className="number">4.8</div>
            <div className="label">Avg. Rating</div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Our Services</h2>
        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {services.length} services available
        </span>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/booking/${service.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="service-card">
                <div className="icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p className="desc">{service.description}</p>
                <div className="duration">
                  ⏱️ {service.duration}
                </div>
                <div className="meta" style={{ marginTop: "12px" }}>
                  <div className="price">
                    ₹{service.price.toLocaleString()}
                    <small> / session</small>
                  </div>
                  <div className="rating">
                    ⭐ {service.rating} ({service.reviews})
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
