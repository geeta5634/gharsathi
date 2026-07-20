import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="logo">GharSathi</span>
        <span className="tagline">Home Services</span>
      </Link>

      <div className="navbar-nav">
        {user ? (
          <>
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Services
            </Link>
            <Link
              to="/bookings"
              className={`nav-link ${location.pathname === "/bookings" ? "active" : ""}`}
            >
              My Bookings
            </Link>
            <div className="nav-user">
              <div className="nav-avatar">
                {user.name ? user.name[0].toUpperCase() : user.phone.slice(-2)}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
