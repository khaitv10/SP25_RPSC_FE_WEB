import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../Services/userAPI";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import imageLogin from "../../assets/otttp.jpg";
import logo from "../../assets/logoEasyRommie.png";
import "./OtpRegis.scss";

const OtpRegis = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [showOtp, setShowOtp] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const handleVerify = async () => {
        if (!otp) {
            setError("Please enter the OTP");
            return;
        }
        try {
            await verifyOTP(email, otp);
            toast.success("OTP verified successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Invalid OTP";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="otp-container">
            {/* Logo góc trái */}
            <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />
            
            <div className="otp-content">
                <div className="otp-box">
                    <h2>Verify OTP</h2>
                    <p>Enter your OTP sent in your email</p>
                    <div className="otp-input-wrapper">
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
                    {error && <p className="error-text">{error}</p>}
                    <button onClick={handleVerify} className="verify-btn">Verify</button>
                    <p onClick={() => navigate("/login")} className="back-to-login">Back to login</p>
                </div>
                <div className="otp-image">
                    <img src={imageLogin} alt="Verification Illustration" />
                </div>
            </div>
        </div>
    );
};

export default OtpRegis;