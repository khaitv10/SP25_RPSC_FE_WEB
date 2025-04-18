import axiosClient from "../axios/config";

export const getRoomStaysByLandlord = async (
    pageIndex = 1,
    pageSize = 10,
    query = "",
    status = ""
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("pageIndex", pageIndex);
      params.append("pageSize", pageSize);
      if (query.trim()) params.append("query", query);
      if (status) params.append("status", status);
  
      const response = await axiosClient.get(`/api/roomstay/by-landlord?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("An error occurred");
    }
  };
  

  export const getRoomStaysCustomerByRoomStayId = async (roomStayId) => {
    try {
        console.log(`🚀 Fetching room details for roomStayId: ${roomStayId}`);
        const response = await axiosClient.get(`/api/roomstay/customers/${roomStayId}`);
        console.log("✅ API Response:", response);
        return response.data;
    } catch (error) {
        console.error("❌ API Error:", error);
        throw error;
    }
};

export const getRoomCountsByLandlord = async () => {
  try {
    const response = await axiosClient.get("/api/room/Get-Room-Counts");
    return response.data.data; // ✅ Lấy đúng phần `data`
  } catch (error) {
    console.error("❌ Error fetching room counts:", error);
    throw error;
  }
};