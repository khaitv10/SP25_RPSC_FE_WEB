import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
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

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    <div className="register-container">
      <div className="register-box">
        <div className="left"><img src={backgroundImg} alt="Signup Illustration" /></div>
        <div className="right">
          <h2>Sign up</h2>
          <p>Let's sign up to manage your own room</p>
          <form onSubmit={handleSubmit}>
            {[
              { name: "fullName", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "phoneNumber", label: "Phone Number" },
              { name: "password", label: "Password", type: "password" },
              { name: "confirmPassword", label: "Confirm Password", type: "password" },
            ].map(({ name, label, type }) => (
              <TextField
                key={name}
                name={name}
                label={label}
                type={type || "text"}
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData[name]}
                onChange={handleChange}
                error={!!errors[name]}
                helperText={errors[name]}
                inputProps={{ style: { textAlign: "left" } }}
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
              inputProps={{ style: { textAlign: "left" } }}

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
          <p className="login-text">Already have an account? <Link to="/login">Login</Link></p>
          <div className="social-signup">
            <p>Or sign up with</p>
            <div className="icons">
              <Facebook className="social-icon" />
              <Google className="social-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
