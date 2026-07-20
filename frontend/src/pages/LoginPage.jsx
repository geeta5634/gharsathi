import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [debugOtp, setDebugOtp] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.requestOTP(phone);
      setDebugOtp(res.data.debug_otp);
      setStep("otp");
      setTimer(60);
      toast.success("OTP sent successfully!");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(phone, otpCode);
      login(res.data.token, res.data.user);
      toast.success("Welcome to GharSathi!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await authAPI.requestOTP(phone);
      setDebugOtp(res.data.debug_otp);
      setTimer(60);
      toast.success("OTP resent!");
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">🏠</div>
          <h1>GharSathi</h1>
          <p>Your Trusted Home Services Partner</p>
        </div>

        {step === "phone" ? (
          <>
            <h2>Get Started</h2>
            <p className="subtitle">
              Enter your mobile number to sign up or log in
            </p>
            <form onSubmit={handleRequestOTP}>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="phone-input-group">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    maxLength={10}
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading || phone.length < 10}
              >
                {loading ? "Sending OTP..." : "Continue with Phone"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Verify OTP</h2>
            <p className="subtitle">
              Enter the 6-digit code sent to +91 {phone}
            </p>

            {debugOtp && (
              <div
                style={{
                  background: "rgba(108,99,255,0.1)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  color: "#A7A9BE",
                }}
              >
                <strong style={{ color: "#6C63FF" }}>Dev Mode:</strong> OTP is{" "}
                <strong style={{ color: "#6C63FF" }}>{debugOtp}</strong>
              </div>
            )}

            <div className="otp-input-group">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="tel"
                  className="otp-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {loading && (
              <div style={{ marginTop: "20px" }}>
                <div className="spinner" />
              </div>
            )}

            <div className="otp-timer">
              {timer > 0 ? (
                <p>
                  Resend OTP in <span>{timer}s</span>
                </p>
              ) : (
                <button
                  className="resend-otp"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              className="btn btn-secondary btn-block"
              style={{ marginTop: "16px" }}
              onClick={() => {
                setStep("phone");
                setOtp(["", "", "", "", "", ""]);
                setDebugOtp("");
              }}
            >
              Change Number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
