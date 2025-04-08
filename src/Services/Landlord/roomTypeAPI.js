import axiosClient from "../axios/config";

export const getRoomTypesByLandlordId = async (searchQuery = "", pageIndex = 1, pageSize = 10, status = "") => {
  try {
    const params = new URLSearchParams();
    params.append("searchQuery", searchQuery);
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    
    // Nếu status không rỗng thì thêm vào URL
    if (status) {
      params.append("status", status);
    }

    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (!token) throw new Error("Authorization token is missing");

    const response = await axiosClient.get(`/api/roomtype/getroomtypesbylandlordid?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log(response.data); // Kiểm tra dữ liệu API trả về

    return response.data.data;  // Trả về dữ liệu từ API, bao gồm room types và tổng số phòng
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