import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegisterLandlord.scss";
import logo from "../../assets/logoEasyRommie.png";
import imageRegister from "../../assets/image-login.png";
import { registerLandlord } from "../../Services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterLandlord = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState([]);
    const [formData, setFormData] = useState({
        companyName: "",
        numberRoom: "",
        licenseNumber: "",
        bankName: "",
        bankNumber: "",
        workshopImages: []
    });

    useEffect(() => {
        const emailFromState = location.state?.email || localStorage.getItem("landlord_email");
        if (emailFromState) {
            setEmail(emailFromState);
            localStorage.setItem("landlord_email", emailFromState);
        } else {
            toast.error("Email is missing. Please start the registration again.");
            navigate("/register");
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({ ...prev, workshopImages: files }));

        // Hiển thị ảnh xem trước
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const validateForm = () => {
        const newErrors = {};
        ["companyName", "numberRoom", "licenseNumber", "bankName", "bankNumber"].forEach(field => {
            if (!formData[field].trim()) newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        });
        if (formData.workshopImages.length === 0) newErrors.workshopImages = "Workshop images are required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email is missing. Please try again.");
            return;
        }
        if (!validateForm()) return toast.error("Please fill all required fields.");
    
        try {
            await registerLandlord(
                email,
                formData.companyName,
                formData.numberRoom,
                formData.licenseNumber,
                formData.bankName,
                formData.bankNumber,
                formData.workshopImages
            );
            toast.success("Registration successful! Redirecting to login page...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setErrors(error.response?.data?.errors || {});
            toast.error(`Registration failed: ${error.response?.data?.message || "Unknown error"}`);
        }
    };
    
    return (
        <div className="register-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />
            <div className="register-box">
                <div className="register-left">
                    <h2>Register as a Landlord</h2>
                    <p>Fill in the details to register as a landlord</p>
                    <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map(key => (
                                key !== "workshopImages" ? (
                                    <div key={key} className="input-group">
                                        <label>{key
                                            .replace("companyName", "Company Name")
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()
                                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                                        </label>
                                        <input 
                                            type={key === "numberRoom" ? "number" : "text"}
                                            name={key} 
                                            value={formData[key]}
                                            onChange={handleChange} 
                                            required 
                                            className="input-field"
                                        />
                                        {errors[key] && <p className="error-text">{errors[key]}</p>}
                                    </div>
                                ) : null
                            ))}

                        <label>Upload Workshop Images</label>
                        <input type="file" multiple onChange={handleFileChange} className="input-file" />
                        {errors.workshopImages && <p className="error-text">{errors.workshopImages}</p>}
                        <div className="image-preview">
                            {imagePreview.map((src, index) => (
                                <img key={index} src={src} alt={`preview-${index}`} />
                            ))}
                        </div>
                        <button type="submit" className="register-btn">Register</button>
                    </form>
                </div>
                <div className="register-right">
                    <img src={imageRegister} alt="Register Illustration" />
                </div>
            </div>
        </div>
    );
};

export default RegisterLandlord;
