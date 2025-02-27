import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../Services/userAPI";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./OtpRegis.scss";

const OtpRegis = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [showOtp, setShowOtp] = useState(false);

    useEffect(() => {
        if (!location.state?.email) {
            navigate("/register");
        }
    }, [location, navigate]);

    const handleVerify = async () => {
        if (!otp) {
            setError("Please enter the OTP");
            return;
        }

        try {
            await verifyOTP(email, otp);
            toast.success("OTP verified successfully!");
            setTimeout(() => navigate("/login"), 1500); // Tránh toast bị chặn điều hướng
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Invalid OTP";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="otp-container">
            {/* Logo & Header */}
            <div className="header">
                <img src="/images/logo.png" alt="EasyRoomie" className="logo" />
                <h1>EasyRoomie</h1>
            </div>

            <div className="otp-content">
                {/* Form Nhập OTP */}
                <div className="otp-box">
                    <h2>Verify OTP</h2>
                    <p>Enter your OTP sent in your email</p>
                    
                    <div className="otp-input-container">
                        <input
                            type={showOtp ? "text" : "password"}
                            placeholder="Enter Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={() => setShowOtp(!showOtp)} className="eye-icon">
                            {showOtp ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                    <button onClick={handleVerify} className="verify-btn">
                        Verify
                    </button>
                    {error && <p className="error">{error}</p>}
                    
                    <p onClick={() => navigate("/login")} className="back-to-login">
                        Back to login
                    </p>
                </div>

                {/* Hình minh họa bên phải */}
                <div className="otp-image">
                    <img src="/images/otp-illustration.png" alt="OTP Illustration" />
                </div>
            </div>
        </div>
    );
};

export default OtpRegis;
