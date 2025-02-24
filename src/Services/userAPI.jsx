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
