import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { forgotPassword, verifyForgotPasswordOTP, resetPassword } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageLogin from "../../assets/image-login.png";
import logo from "../../assets/logoEasyRommie.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Handle sending OTP request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Email is required!");
      return;
    }

    try {
      await forgotPassword(email);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP:", err);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.message ||
        err.message ||
        "Failed to send OTP. Please try again.";
      
      toast.error(errorMessage);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error("OTP is required!");
      return;
    }

    try {
      await verifyForgotPasswordOTP(email, otp);
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.message ||
        err.message ||
        "OTP verification failed. Please check your OTP and try again.";
      
      toast.error(errorMessage);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      toast.error("New password is required!");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      await resetPassword(email, newPassword);
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.message ||
        err.message ||
        "Password reset failed. Please try again.";
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container forgot-password-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />

      <div className="login-box">
        <div className="login-left">
          <img src={imageLogin} alt="Forgot Password" />
          <div className="welcome-text">
            <h2>Password Recovery</h2>
            <p>We'll help you reset your password and get back access to your EasyRoomie account</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h3>Forgot Password</h3>
            <p>
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the verification code sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleForgotPassword}>
              <div className="input-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button type="submit" className="login-btn">Send Reset Code</button>
              
              <p className="signup-text">
                Remember your password? <Link to="/login">Sign In</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div className="input-field">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP code"
                  required
                />
              </div>

              <button type="submit" className="login-btn">Verify Code</button>
              
              <p className="resend-text">
                Didn't receive the code? <span onClick={() => handleForgotPassword({ preventDefault: () => {} })}>Resend</span>
              </p>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="input-field">
                <label>New Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="input-field">
                <label>Confirm Password</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button type="submit" className="login-btn">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;