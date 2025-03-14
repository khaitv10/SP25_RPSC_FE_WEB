import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyForgotPasswordOTP, resetPassword } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Xử lý gửi yêu cầu OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    try {
      await forgotPassword(email);
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Xử lý xác minh OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Vui lòng nhập OTP!");
      return;
    }

    try {
      await verifyForgotPasswordOTP(email, otp);
      setStep(3);
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast.error("Vui lòng nhập mật khẩu mới!");
      return;
    }

    try {
      await resetPassword(email, newPassword);
      toast.success("Mật khẩu đã được đặt lại thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="forgot-password-box">
        <h2>Quên mật khẩu</h2>
        
        {step === 1 && (
          <form onSubmit={handleForgotPassword}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Gửi OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <label>Nhập OTP</label>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">Xác minh OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label>Mật khẩu mới</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit">Đặt lại mật khẩu</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
