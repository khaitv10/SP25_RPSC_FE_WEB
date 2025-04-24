import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField, Button, MenuItem, Checkbox,
  FormControlLabel, Box, Typography, Paper, IconButton, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logoEasyRommie.png";
import backgroundImg from "../../assets/1.jpg";
import { register } from "../../Services/userAPI";
import "./Register.scss";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { fullName, email, phoneNumber, password, confirmPassword, gender } = formData;

    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!gender) newErrors.gender = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    try {
        console.log("Sending request to register API...");
        await register(
            formData.email,
            formData.password,
            formData.confirmPassword,
            formData.fullName,
            formData.phoneNumber,
            formData.gender
        );
        console.log("Registration successful, navigating to OTP Register");

        toast.success("Registration successful!");
        navigate("/otpRegister", { state: { email: formData.email } });
    } catch (error) {
        console.error("Full error object:", error);

        if (error.errors) {
            const validKeys = Object.keys(error.errors).filter((key) => key !== "$id");
            if (validKeys.length > 0) {
                const firstErrorMessage = error.errors[validKeys[0]][0];
                toast.error(firstErrorMessage);
            } else {
                toast.error("Unexpected error format");
            }
        } else {
            toast.error(error.title || "An error occurred during registration.");
        }
    }
  };
  
  return (
    <Box className="register-container">
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />
      <Paper elevation={3} className="register-box">
        <Box className="left">
          <img src={backgroundImg} alt="Signup Illustration" />
          <Box className="welcome-text">
            <Typography variant="h2">Welcome to EasyRoomie</Typography>
            <Typography variant="body1">Find your perfect roommate with just a few clicks</Typography>
          </Box>
        </Box>
        <Box className="right">
          <Box className="register-header">
            <Typography variant="h4">Create Account</Typography>
            <Typography variant="body2">Join our community and find your ideal living space</Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <TextField
              name="fullName"
              label="Full Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            
            <div className="form-row">
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </div>

            <div className="password-fields">
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.password && (
                <span className="password-strength">
                  Password strength: {formData.password.length > 8 ? "Strong" : "Weak"}
                </span>
              )}
            </div>

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              name="gender"
              label="Gender"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.gender}
              onChange={handleChange}
              error={!!errors.gender}
              helperText={errors.gender}
            >
              {["Male", "Female", "Other"].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>

            <Button type="submit" variant="contained" fullWidth>
              Create account
            </Button>
          </form>
          
          
          <Typography className="login-text">
            Already have an account?<Link to="/login">Sign in</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;