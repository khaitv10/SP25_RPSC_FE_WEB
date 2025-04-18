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
      toast.error("Không thể tải thông tin hồ sơ");
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
        toast.success("Cập nhật thông tin cá nhân thành công");
        setEditMode((prev) => ({ ...prev, user: false }));
        fetchProfileData();
        // Clear the file object after successful update
        setAvatarFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
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
        toast.success("Cập nhật thông tin chủ trọ thành công");
        setEditMode((prev) => ({ ...prev, landlord: false }));
        fetchProfileData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
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
        <h1>Hồ Sơ Chủ Trọ</h1>
        <p>Quản lý thông tin cá nhân và doanh nghiệp của bạn</p>
      </div>

      <div className="profile-content">
        {/* User Information Section */}
        <div className="info-card user-info">
          <div className="card-header">
            <h2>Thông Tin Cá Nhân</h2>
            <button
              className="edit-btn"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, user: !prev.user }))
              }
            >
              {editMode.user ? "Hủy" : "Chỉnh sửa"}
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
                  <span>Thay đổi ảnh</span>
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
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={userData.dob || ""}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address || ""}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleUserChange}
                    disabled={!editMode.user}
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
              </div>
              {editMode.user && (
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="info-card landlord-info">
          {/* Landlord form implementation remains unchanged */}
          <div className="card-header">
            <h2>Thông Tin Doanh Nghiệp</h2>
            <button
              className="edit-btn"
              onClick={() =>
                setEditMode((prev) => ({ ...prev, landlord: !prev.landlord }))
              }
            >
              {editMode.landlord ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleLandlordSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên công ty</label>
                  <input
                    type="text"
                    name="companyName"
                    value={landlordData.companyName}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
                <div className="form-group">
                  <label>Số bài post còn lại</label>
                  <input
                    type="number"
                    name="numberRoom"
                    value={landlordData.numberRoom}
                    disabled
                    className="disabled-input"
                  />
                </div>
                <div className="form-group">
                  <label>Số giấy phép</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={landlordData.licenseNumber}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
                <div className="form-group">
                  <label>Ngân hàng</label>
                  <input
                    type="text"
                    name="bankName"
                    value={landlordData.bankName}
                    onChange={handleLandlordChange}
                    disabled={!editMode.landlord}
                  />
                </div>
                <div className="form-group">
                  <label>Số tài khoản</label>
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
                  <label className="images-label">Hình ảnh doanh nghiệp</label>
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
                  {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
              )}
            </form>
            <div className="meta-info">
              <p>
                <span>Ngày tạo:</span>{" "}
                {new Date(landlordData.createdDate).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span>Cập nhật lần cuối:</span>{" "}
                {new Date(landlordData.updatedDate).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <span>Trạng thái:</span>{" "}
                {landlordData.status === "Active" ? "Hoạt động" : "Không hoạt động"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordProfile;