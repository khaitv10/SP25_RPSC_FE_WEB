import axiosClient from "./axios/config";
import { toast } from "react-toastify";

export const login = async (phoneNumber, password) => {
  try {
    const response = await axiosClient.post('/api/authentication/login', { phoneNumber, password });  
    if (!response.data || !response.data.data) {
      toast.error("Đăng nhập thất bại: Dữ liệu không hợp lệ");
      return;
    }  
    const { 
      userId, 
      phoneNumber: userPhone, 
      avatar,
      email, 
      fullName, 
      role, 
      token, 
      refreshToken,
      roleUserId
    } = response.data.data;  
    if (!token || !userId) {
      toast.error("Đăng nhập thất bại: Thiếu thông tin cần thiết");
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('role', role);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('phoneNumber', userPhone);
    localStorage.setItem('email', email);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('roleUserId', roleUserId);   
    toast.success("Đăng nhập thành công!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    throw error.response ? error.response.data : new Error('An error occurred');
  }
};
    

export const register = async (email, password, confirmPassword, fullName, phoneNumber, gender) => {
    try {
        const response = await axiosClient.post('/api/authentication/register', {
            email,
            password,
            confirmPassword,
            fullName,
            phoneNumber,
            gender
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred during registration');
    }
};

export const verifyOTP = async (email, otp) => {
    try {
        const response = await axiosClient.put('/api/otp/verify-email', {
            email,
            otp
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred during OTP verification');
    }
};

export const registerLandlord = async (email, companyName, licenseNumber, bankName, bankNumber, workshopImages) => {
    try {
        const formData = new FormData();
        formData.append("CompanyName", companyName);
        formData.append("LicenseNumber", licenseNumber);
        formData.append("BankName", bankName);
        formData.append("BankNumber", bankNumber);
        
        workshopImages.forEach((image) => {
            formData.append("WorkshopImages", image);
        });

        const response = await axiosClient.post(`/api/user/register-landlord?email=${encodeURIComponent(email)}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred during landlord registration";
        toast.error(`Registration failed: ${errorMessage}`); // 🔥 Hiển thị lỗi trên Toast
        throw error.response ? error.response.data : new Error(errorMessage);
    }
};

export const getLandlordRegistrations = async (
    pageIndex = 0,
    pageSize = 0,
    searchQuery = "",
    status = ""
  ) => {
    try {
      const response = await axiosClient.get(`/api/user/get-landlord-regis`, {
        params: {
          pageIndex,
          pageSize,
          searchQuery,
          status
        }
      });
  
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("An error occurred while fetching landlord registrations");
    }
  };
  


export const getLandlordById = async (landlordId) => {
    try {
      const response = await axiosClient.get(`/api/user/get-landlord-by-id`, {
        params: { landlordId },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Error fetching landlord detail");
    }
  };
  
  export const updateLandlordStatus = async (landlordId, isApproved, rejectionReason = "") => {
    try {
        const response = await axiosClient.put(`/api/user/Update-Landlord-Status`, null, {
            params: { landlordId, isApproved, rejectionReason }, // Thêm rejectionReason vào params
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An error occurred while updating landlord status");
    }
};


export const forgotPassword = async (email) => {
    try {
        const response = await axiosClient.post('/api/authentication/forgot-password', { email });
        toast.success("OTP đã được gửi đến email của bạn.");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu quên mật khẩu.");
        throw error.response ? error.response.data : new Error("Error in forgot password");
    }
};
export const verifyForgotPasswordOTP = async (email, otp) => {
    try {
        const response = await axiosClient.post('/api/otp/verify-otp-forgot-password', {
            email,
            otp
        });
        toast.success("Xác minh OTP thành công. Vui lòng đặt lại mật khẩu.");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
        throw error.response ? error.response.data : new Error("Error in OTP verification");
    }
};
export const resetPassword = async (email, newPassword) => {
    try {
        const response = await axiosClient.post('/api/authentication/reset-password', {
            email,
            newPassword
        });
        toast.success("Mật khẩu của bạn đã được đặt lại thành công.");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
        throw error.response ? error.response.data : new Error("Error in reset password");
    }
};

export const getTotalUsers = async () => {
    try {
        const response = await axiosClient.get('/api/user/get-total-users');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An error occurred while fetching total users");
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Create FormData object
        const formData = new FormData();
        
        // Append all fields to FormData
        if (userData.fullName) formData.append('FullName', userData.fullName);
        if (userData.phoneNumber) formData.append('PhoneNumber', userData.phoneNumber);
        if (userData.address) formData.append('Address', userData.address);
        if (userData.gender) formData.append('Gender', userData.gender);
        if (userData.dob) formData.append('Dob', userData.dob);
        
        // Append avatar file if it exists
        if (userData.avatar instanceof File) {
            formData.append('Avatar', userData.avatar);
        }

        const response = await axiosClient.put('/api/user/Update-User-Profile', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        
        toast.success("Cập nhật hồ sơ thành công!");
        return response.data;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data?.message || "Cập nhật hồ sơ thất bại");
            throw error.response.data;
        } else if (error.request) {
            toast.error("Không thể kết nối đến máy chủ");
            throw new Error("Server connection failed");
        } else {
            toast.error(error.message || "Cập nhật hồ sơ thất bại");
            throw error;
        }
    }
};

export const getLandlordByUserId = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axiosClient.get('/api/user/Get-Landlord-By-UserId', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Không thể lấy thông tin chủ trọ");
        throw error.response ? error.response.data : new Error("An error occurred while fetching landlord information");
    }
};

export const updateLandlordProfile = async (landlordData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axiosClient.put('/api/user/Edit-Landlord-Profile', landlordData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success("Cập nhật thông tin chủ trọ thành công!");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Cập nhật thông tin chủ trọ thất bại");
        throw error.response ? error.response.data : new Error("An error occurred while updating landlord profile");
    }
};


