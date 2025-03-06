    import axiosClient from "./axios/config";

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
        
        // Thêm từng ảnh vào FormData
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
        throw error.response ? error.response.data : new Error("An error occurred during landlord registration");
    }
};
