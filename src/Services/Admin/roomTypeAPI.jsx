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
  return axiosClient.post(`/api/roomtype/approve/${roomTypeId}`);
};

const rejectRoomType = async (roomTypeId) => {
  return axiosClient.post(`/api/roomtype/reject/${roomTypeId}`);
};


export default getAllRoomTypePending;
export { getRoomTypeDetail, approveRoomType, rejectRoomType };
