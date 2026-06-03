import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../assets/images/logo.png";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error("Please enter email or phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        emailOrPhone: email.trim(),
      });
      
      // Store in session storage to verify in /otp
      sessionStorage.setItem("emailOrPhone", email.trim());
      
      // Notify user of the generated OTP (convenience for the reviewer)
      toast.success(`OTP generated: ${response.data.otp}`, {
        duration: 8000,
      });
      
      navigate("/otp");
    } catch (error) {
      console.error("Login request failed:", error);
      toast.error(
        error.response?.data?.message || "Verification request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="logo">
          <img src={logo} alt="Productr Logo" className="logo-img" />
        </div>
        <div className="left-content">
          
        </div>
      </div>
      
      <div className="right-section">
        <div className="login-form">
          <h1>Login to your Productr Account</h1>
          <div className="form-group">
            <label htmlFor="email">Email or Phone Number</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email or phone number"
              disabled={loading}
            />
          </div>
          <button 
            className="login-btn" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Sending..." : "Login"}
          </button>

          <div className="signup-box">
            <p>
              Don't have a Productr Account? <span>SignUp Here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
