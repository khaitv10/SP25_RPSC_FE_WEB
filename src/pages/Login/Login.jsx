import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { login } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(phone, password);

      if (response?.data?.token) {
        const { role, token } = response.data;


        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("loggedIn", "true");


        if (role === "Admin") {
          navigate("/admin/dashboard");
        } else if (role === "Landlord") {
          console.log("Navigating to /landlord/dashboard");
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
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="login-box">
        <div className="login-left">
          <h1 className="logo">EasyRoomie</h1>
          <h2>Login</h2>
          <p>Welcome back to your website</p>

          <form onSubmit={handleSubmit}>
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />

            <label>Password</label>
            <div className="password-input">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span className="eye-icon">👁</span>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          <div className="social-login">
            <p>Or login with</p>
            <div className="social-icons">
              <button className="facebook">
                <FaFacebook /> Facebook
              </button>
              <button className="google">
                <FaGoogle /> Google
              </button>
            </div>
          </div>
        </div>

        <div className="login-right">
          <img src="/assets/login-illustration.png" alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
