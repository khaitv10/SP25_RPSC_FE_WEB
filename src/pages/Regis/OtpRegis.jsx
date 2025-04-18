import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOTP } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imageLogin from "../../assets/otttp.jpg";
import logo from "../../assets/logoEasyRommie.png";
import "./OtpRegis.scss";

const OtpRegis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error("Please enter the OTP code");
      return;
    }

    try {
      await verifyOTP(email, otp);
      toast.success("OTP verified successfully!");

      if (email) {
        console.log("Navigating with email:", email);
        setTimeout(() => {
          navigate("/register-landlord", { state: { email } });
        }, 1500);
      } else {
        toast.error("Email is missing, please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.message ||
        err.message ||
        "Invalid OTP. Please try again.";
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container otp-regis-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />

      <div className="login-box">
        <div className="login-left">
          <img src={imageLogin} alt="OTP Verification" />
          <div className="welcome-text">
            <h2>Verify Your Account</h2>
            <p>We've sent a verification code to your email address. Please enter it to continue your registration.</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h3>OTP Verification</h3>
            <p>Enter the verification code sent to {email}</p>
          </div>
          
          <form onSubmit={handleVerify}>
            <div className="input-field">
              <label>Verification Code</label>
              <div className="password-input">
                <input
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP code"
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">Verify OTP</button>
          </form>
          
          <p className="signup-text">
            Back to <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpRegis;