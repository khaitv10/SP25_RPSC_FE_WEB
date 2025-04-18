import axiosClient from "../axios/config";

export const getLandlordFeedbacks = async (searchQuery = "", pageIndex = 1, pageSize = 10) => {
    try {
        const response = await axiosClient.get('/api/feedback/landlord/feedbacks', {
            params: {
                searchQuery,
                pageIndex,
                pageSize
            }
        });

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Không thể lấy danh sách feedbacks.");
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Có lỗi xảy ra khi lấy danh sách feedbacks.");
    }
};


export const getFeedbackById = async (id) => {
    try {
        const response = await axiosClient.get(`/api/feedback/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Có lỗi xảy ra khi lấy dữ liệu feedback.");
    }
};