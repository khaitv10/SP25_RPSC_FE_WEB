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

export const registerLandlord = async (formData, email) => {
    try {
        const response = await axiosClient.post(`/api/authentication/Register-Landlord?email=${email}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("An error occurred during landlord registration");
    }
};
