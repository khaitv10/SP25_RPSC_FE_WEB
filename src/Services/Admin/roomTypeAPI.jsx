import axiosClient from "../axios/config";

const getAllRoomTypePending = {
  getPendingRoomTypes: async (pageIndex = 1, pageSize = 5) => {
    try {
      const response = await axiosClient.get(
        `/api/roomtype/get-all-pending?pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
      console.log("API Response:", response.data);

      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching pending room types:", error.response ? error.response.data : error);
      return [];
    }
  },
};



const getRoomTypeDetail = async (roomTypeId) => {
  try {
    console.log(`Fetching API: /api/roomtype/get-detail/${roomTypeId}`);

    const response = await axiosClient.get(`/api/roomtype/get-detail/${roomTypeId}`);

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching room type details:", error.response ? error.response.data : error);
    throw error;
  }
};


const approveRoomType = async (roomTypeId) => {
  try {
    return axiosClient.post(`/api/roomtype/approve/${roomTypeId}`);
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred while approve room type");
  }
};

const rejectRoomType = async (roomTypeId) => {
  try {
    return axiosClient.post(`/api/roomtype/deny/${roomTypeId}`);
  } catch (error) {
    throw error.response ? error.response.data : new Error("An error occurred while reject room type");
  }
};


export default getAllRoomTypePending;
export { getRoomTypeDetail, approveRoomType, rejectRoomType };
