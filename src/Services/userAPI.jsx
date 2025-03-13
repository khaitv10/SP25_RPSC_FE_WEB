    import axiosClient from "./axios/config";
    import { toast } from "react-toastify";

    export const login = async (phoneNumber, password) => {
    try {
        const response = await axiosClient.post('/api/authentication/login', { phoneNumber, password });
        
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        
        return response.data;
    } catch (error) {
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

export const registerLandlord = async (email, companyName, numberRoom, licenseNumber, bankName, bankNumber, workshopImages) => {
    try {
        const formData = new FormData();
        formData.append("CompanyName", companyName);
        formData.append("NumberRoom", numberRoom);
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

export const getLandlordRegistrations = async (pageIndex = 0, pageSize = 0, searchQuery = "") => {
    try {
        const response = await axiosClient.get(`/api/user/get-landlord-regis`, {
            params: {
                pageIndex,
                pageSize,
                searchQuery
            }
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An error occurred while fetching landlord registrations");
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
  
  export const updateLandlordStatus = async (landlordId, isApproved) => {
    try {
        const response = await axiosClient.put(`/api/user/Update-Landlord-Status`, null, {
            params: { landlordId, isApproved },
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