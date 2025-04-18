import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const validateForm = () => {
    const newErrors = {};
    ["companyName", "licenseNumber", "bankName", "bankNumber"].forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
      }
    });
    
    if (formData.workshopImages.length === 0) {
      newErrors.workshopImages = "Business images are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please try again.");
      return;
    }
    
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await registerLandlord(
        email,
        formData.companyName,
        formData.licenseNumber,
        formData.bankName,
        formData.bankNumber,
        formData.workshopImages
      );
      
      toast.success("Registration successful! Redirecting to login page...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.message ||
        err.message ||
        "Registration failed. Please try again.";
      
      toast.error(errorMessage);
      setErrors(err.response?.data?.errors || {});
    }
  };

  return (
    <div className="login-container register-landlord-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <img src={logo} alt="EasyRoomie Logo" className="otp-logo" />

      <div className="login-box">
        <div className="login-left">
          <img src={imageRegister} alt="Register" />
          <div className="welcome-text">
            <h2>Join as a Landlord</h2>
            <p>Complete your registration to start listing your properties on EasyRoomie</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-header">
            <h3>Landlord Registration</h3>
            <p>Please fill in your business details to continue</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
              />
              {errors.companyName && <span className="error-message">{errors.companyName}</span>}
            </div>

            <div className="input-field">
              <label>License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="Enter your business license number"
                required
              />
              {errors.licenseNumber && <span className="error-message">{errors.licenseNumber}</span>}
            </div>

            <div className="input-field">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter your bank name"
                required
              />
              {errors.bankName && <span className="error-message">{errors.bankName}</span>}
            </div>

            <div className="input-field">
              <label>Bank Account Number</label>
              <input
                type="text"
                name="bankNumber"
                value={formData.bankNumber}
                onChange={handleChange}
                placeholder="Enter your bank account number"
                required
              />
              {errors.bankNumber && <span className="error-message">{errors.bankNumber}</span>}
            </div>

            <div className="input-field file-field">
              <label>Business Images</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-label">
                  Choose Files
                </label>
                <span className="file-name">
                  {formData.workshopImages.length > 0 
                    ? `${formData.workshopImages.length} file(s) selected` 
                    : "No file chosen"}
                </span>
              </div>
              {errors.workshopImages && <span className="error-message">{errors.workshopImages}</span>}
            </div>

            {imagePreview.length > 0 && (
              <div className="image-preview">
                {imagePreview.map((src, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={src} alt={`preview-${index}`} />
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="login-btn">Complete Registration</button>
          </form>
          
          <p className="signup-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterLandlord;