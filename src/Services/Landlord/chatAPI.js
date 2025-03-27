import axiosClient from "../axios/config";
import { toast } from "react-toastify";

export const sendMessageToUser = async (senderId, receiverId, message) => {
    try {
        const response = await axiosClient.post('/api/chat/send-message-to-user', {
            senderId,    // userId của người gửi
            receiverId,  // userId của người nhận
            message      // nội dung tin nhắn
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error sending message:", error);
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi gửi tin nhắn.");
        throw error.response ? error.response.data : new Error("Error in sending message");
    }
};




// 📌 Lấy lịch sử tin nhắn giữa người dùng hiện tại (từ token) và user2
export const getChatHistory = async (user2) => {
    try {
        const response = await axiosClient.get('/api/chat/history', {
            params: { user2 }
        });

        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lấy lịch sử tin nhắn.");
        throw error.response ? error.response.data : new Error("Error in fetching chat history");
    }
};


// 📌 Lấy lịch sử chat của user theo token
export const getHistoryByUserId = async () => {
    try {
        const response = await axiosClient.get('/api/chat/history-by-user');
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lấy lịch sử chat.");
        throw error.response ? error.response.data : new Error("Error in fetching chat history by user");
    }
};
