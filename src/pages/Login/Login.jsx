import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageLogin from "../../assets/image-login.png";
import logo from "../../assets/logoEasyRommie.png";


const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        const { role, email, fullName, phoneNumber, token, roleUserId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("roleUserId", roleUserId);
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
      console.error("Error response:", err.response);

      const errorMessage =
        err.response?.data?.message || 
        err.response?.message ||      
        err.message ||               
        "Login failed. Please try again.";

      if (errorMessage.includes("password")) {
        toast.error("Incorrect password. Please try again.");
      } else if (errorMessage.includes("not found") || errorMessage.includes("does not exist")) {
        toast.error("Account does not exist. Please check your credentials.");
      } else if (errorMessage.includes("deactivated") || errorMessage.includes("banned")) {
        toast.error("Your account has been deactivated. Contact support for help.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />

      <div className="login-box">
        <div className="login-left">
          <img src={imageLogin} alt="Login" />
          <div className="welcome-text">
            <h2>Welcome Back</h2>
            <p>We're glad to see you again. Access your account to continue your journey</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h3>Sign In</h3>
            <p>Please sign in to continue to EasyRoomie</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Phone or Email</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number or email"
                required
              />
            </div>

            <div className="input-field">
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
            </div>

            <div className="options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn">Sign In</button>
          </form>
          
          <p className="signup-text">
            Don't have an account yet? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;