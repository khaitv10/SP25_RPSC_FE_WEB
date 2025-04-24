import React, { useState, useEffect } from "react";
import {
  getLandlordByUserId,
  updateUserProfile,
  updateLandlordProfile,
} from "../../../Services/userAPI";
import { toast } from "react-toastify";
import "./LandlordProfile.scss";
import avatarFallback from "../../../assets/default_avatar.jpg";

const LandlordProfile = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({
    user: false,
    landlord: false,
  });
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    dob: "",
    address: "",
    gender: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState(null); // Separate state for file object
  const [avatarPreview, setAvatarPreview] = useState(null); // Separate state for preview
  const [landlordData, setLandlordData] = useState({
    landlordId: "",
    companyName: "",
    numberRoom: 0,
    licenseNumber: "",
    bankName: "",
    bankNumber: "",
    template: null,
    status: "",
    createdDate: "",
    updatedDate: "",
    businessImages: [],
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await getLandlordByUserId();
      if (response.isSuccess) {
        setUserData(response.data.user);
        setLandlordData(response.data.landlord);
        // Set avatar preview if exist
        if (response.data.user.avatar) {
          setAvatarPreview(response.data.user.avatar);
        }
      }
    } catch (error) {
      toast.error("Unable to load profile information");
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file object for sending to the server
      setAvatarFile(file);
      
      // Create preview URL for displaying
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleLandlordChange = (e) => {
    const { name, value } = e.target;
    setLandlordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        address: userData.address || "",
        gender: userData.gender,
        dob: userData.dob || null,
        avatar: avatarFile // Pass the actual File object, not base64
      };
      
      const response = await updateUserProfile(updateData);
      
      if (response.isSuccess) {
        toast.success("Personal information updated successfully");
        setEditMode((prev) => ({ ...prev, user: false }));
        fetchProfileData();
        // Clear the file object after successful update
        setAvatarFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Information update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLandlordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateLandlordProfile({
        companyName: landlordData.companyName,
        licenseNumber: landlordData.licenseNumber,
        bankName: landlordData.bankName,
        bankNumber: landlordData.bankNumber,
        template: landlordData.template || null,
      });
      
      if (response.isSuccess) {
        toast.success("Landlord information updated successfully");
        setEditMode((prev) => ({ ...prev, landlord: false }));
        fetchProfileData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Information update failed");
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return (
    <div className="landlord-profile-container">
      <div className="profile-header">
        <h1>Landlord Profile</h1>
        <p>Manage your personal and business information</p>
      </div>

      <div className="profile-content">
        {/* User Information Section */}
        <div className="info-card user-info">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button
              className="edit-btn"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, user: !prev.user }))
              }
            >
              {editMode.user ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="card-body">
            <div className="avatar-section">
              <img
                src={avatarPreview || userData.avatar || avatarFallback}
                alt="Avatar"
                className="avatar"
              />
              {editMode.user && (
                <label className="avatar-upload">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                  />
                  <span>Change image</span>
                </label>
              )}
            </div>
            <form onSubmit={handleUserSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="disabled-input"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={userData.dob || ""}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address || ""}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {editMode.user && (
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Updating..." : "Save changes"}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="info-card landlord-info">
          {/* Landlord form implementation remains unchanged */}
          <div className="card-header">
            <h2>Business Information</h2>
            <button
              className="edit-btn"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, landlord: !prev.landlord }))
              }
            >
              {editMode.landlord ? "Cancel" : "Edit"}
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleLandlordSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={landlordData.companyName}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
                <div className="form-group">
                  <label>Remaining Posts</label>
                  <input
                    type="number"
                    name="numberRoom"
                    value={landlordData.numberRoom}
                    disabled
                    className="disabled-input"
                  />
                </div>
                <div className="form-group">
                  <label>License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={landlordData.licenseNumber}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={landlordData.bankName}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="bankNumber"
                    value={landlordData.bankNumber}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
              </div>
              
              {landlordData.businessImages && landlordData.businessImages.length > 0 && (
                <div className="business-images-section">
                  <label className="images-label">Business Images</label>
                  <div className="images-grid">
                    {landlordData.businessImages.map((image, index) => (
                      <div className="image-item" key={index}>
                        <img src={image} alt={`Business image ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editMode.landlord && (
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Updating..." : "Save changes"}
                </button>
              )}
            </form>
            <div className="meta-info">
              <p>
                <span>Created:</span>{" "}
                {new Date(landlordData.createdDate).toLocaleDateString("en-US")}
              </p>
              <p>
                <span>Last updated:</span>{" "}
                {new Date(landlordData.updatedDate).toLocaleDateString("en-US")}
              </p>
              <p>
                <span>Status:</span>{" "}
                {landlordData.status === "Active" ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordProfile;