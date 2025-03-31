import axiosClient from "../axios/config";

export const getRoomTypesByLandlordId = async (searchQuery = "", pageIndex = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams();
    params.append("searchQuery", searchQuery);
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);

    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (!token) throw new Error("Authorization token is missing");

    // Gọi API với params và Authorization header
    const response = await axiosClient.get(`/api/roomtype/getroomtypesbylandlordid?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Truyền token trong header
      }
    });

    return response.data.data;  // Trả về danh sách room types
  } catch (error) {
    console.error("❌ Error fetching room types:", error);
    throw error.response?.data || new Error("An error occurred");
  }
};

export const getRoomTypeDetailByRoomTypeId = async (roomTypeId) => {
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!token) throw new Error("Authorization token is missing");

    const response = await axiosClient.get(`/api/roomtype/GetRoomTypeDetailByRoomTypeId`, {
      params: { roomTypeId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data; // Trả về dữ liệu chi tiết loại phòng
  } catch (error) {
    console.error("❌ Error fetching room type detail:", error);
    throw error.response?.data || new Error("An error occurred");
  }
};