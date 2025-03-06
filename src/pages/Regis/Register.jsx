import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Box, Typography, Paper } from "@mui/material";
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

  const toTitleCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await register(
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.fullName,
        formData.phoneNumber,
        formData.gender
      );
      toast.success("Registration successful!");
      navigate("/otpRegister", { state: { email: formData.email } });
    } catch (error) {
      if (error.response && error.response.data) {
        const { title, errors } = error.response.data;
        if (errors) {
          Object.values(errors).forEach((errorMessages) => {
            errorMessages.forEach((message) => toast.error(message));
          });
        } else {
          toast.error(title || "An error occurred during registration.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Box className="register-container">
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />
      <Paper elevation={3} className="register-box">
        <Box className="left">
          <img src={backgroundImg} alt="Signup Illustration" />
        </Box>
        <Box className="right">
          <Typography variant="h4" fontWeight="bold">Sign Up</Typography>
          <Typography variant="body2" color="textSecondary">Let's sign up to manage your own room</Typography>
          <form onSubmit={handleSubmit}>
            {["fullName", "email", "phoneNumber", "password", "confirmPassword"].map((field, index) => (
              <TextField
                key={index}
                name={field}
                label={toTitleCase(field.replace(/([A-Z])/g, " $1").trim())}
                type={field.includes("password") ? "password" : "text"}
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData[field]}
                onChange={handleChange}
                error={!!errors[field]}
                helperText={errors[field]}
              />
            ))}
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
            <FormControlLabel control={<Checkbox color="primary" />} label="I agree to the Terms and Policies" />
            <Button type="submit" variant="contained" color="success" fullWidth>
              Create account
            </Button>
          </form>
          <Typography className="login-text">Already have an account? <Link to="/login">Login</Link></Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
