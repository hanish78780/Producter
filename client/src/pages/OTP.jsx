import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../assets/images/logo.png";
import runner from "../assets/images/runner.png";
import "./OTP.css";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(20);
  const navigate = useNavigate();

  const emailOrPhone = sessionStorage.getItem("emailOrPhone");

  useEffect(() => {
    if (!emailOrPhone) {
      toast.error("Session expired, please login again.");
      navigate("/");
    }
  }, [emailOrPhone, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (!/^\d{6}$/.test(enteredOtp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    try {
      const response = await axios.post("/api/auth/verify", {
        emailOrPhone,
        otp: enteredOtp,
      });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);
      toast.success("Successfully logged in!");
      
      navigate("/products");
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError(error.response?.data?.message || "Invalid OTP code");
      toast.error(error.response?.data?.message || "Invalid OTP code");
    }
  };

  const handleResend = async () => {
    setTimer(20);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();

    try {
      const response = await axios.post("/api/auth/login", { emailOrPhone });
      toast.success(`New OTP generated: ${response.data.otp}`, {
        duration: 8000,
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-left">
        <div className="logo">
          <img src={logo} alt="Productr Logo" className="logo-img" />
        </div>
        <div className="left-content">
          <img src={runner} alt="Runner illustration" className="runner-img" />
        </div>
      </div>

      <div className="otp-right">
        <div className="otp-form">
          <h1>Login to your Productr Account</h1>
          
          <label className="otp-label">Enter OTP</label>
          <div className="otp-boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}
          <button className="otp-btn" onClick={verifyOtp}>
            Enter your OTP
          </button>

          <p className="resend-text">
            Didn't receive OTP ?{" "}
            {timer > 0 ? (
              <span className="resend-timer">Resend in {timer}s</span>
            ) : (
              <span className="resend-link" onClick={handleResend}>
                Resend
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OTP;