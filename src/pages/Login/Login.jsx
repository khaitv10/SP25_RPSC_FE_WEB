import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageLogin from "../../assets/image-login.png";
import logo from "../../assets/logoEasyRommie.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone.trim() || !password.trim()) {
      toast.error("Phone and password are required!");
      return;
    }

    try {
      const response = await login(phone, password);

      if (response?.data?.token) {
        const { role, token } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("loggedIn", "true");

        toast.success("Login successful!");

        if (role === "Admin") {
          navigate("/admin/dashboard");
        } else if (role === "Landlord") {
          navigate("/landlord/dashboard");
        } else {
          toast.error("You do not have permission to access.");
        }
      } else {
        console.error("Unexpected API response structure:", response);
        toast.error("Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />

      <div className="login-box">
        <div className="login-left">
          <h1 className="logo">EasyRoomie</h1>
          <h2>Login</h2>
          <p>Welcome back to website</p>

          <form onSubmit={handleSubmit}>
            {/* Phone Number Input */}
            <label>Phone or email</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />

            {/* Password Input */}
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn">Login</button>
          </form>

          {/* Sign Up Link */}
          <p className="signup-text">
            Do not have an account? <Link to="/register">Sign up</Link>
          </p>

          
        </div>

        {/* Illustration Image */}
        <div className="login-right">
          <img src={imageLogin} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
