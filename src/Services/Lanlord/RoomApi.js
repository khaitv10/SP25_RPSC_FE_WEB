import axiosClient from "../axios/config";

export const createRoomTypeAPI = async (roomData) => {
  try {
    const token = localStorage.getItem("token"); 
    console.log("🔑 Token:", token);

    if (!token) {
      console.error("❌ No token found!");
      throw new Error("Token is missing.");
    }

    console.log("🚀 Calling API: /api/roomtype/create-roomtype");

    const response = await axiosClient.post(`/api/roomtype/create-roomtype?token=${token}`, roomData);

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating room type:", error.response?.data || error);
    throw error;
  }
};

