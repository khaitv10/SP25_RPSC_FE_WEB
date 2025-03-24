import axiosClient from "../axios/config";

const roomRentalService = {
  getRequiresRoomRental: async (pageIndex = 1, pageSize = "", searchQuery = "") => {
    try {
      const response = await axiosClient.get(
        `/api/room/get-requires-room-rental?pageIndex=${pageIndex}&pageSize=${pageSize}` +
        (searchQuery ? `&searchQuery=${searchQuery}` : "")
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching room rental requirements:", error);
      throw error;
    }
  },

  getCustomersByRoomRentRequestId: async (roomRentRequestsId) => {
    try {
      const response = await axiosClient.get(
        `/api/roomrentrequest/get-customers-by-roomrentrequestid?roomRentRequestsId=${roomRentRequestsId}`
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching customers by room rent request ID:", error);
      throw error;
    }
  },

  acceptCustomerRentRoom: async (roomRentRequestsId, selectedCustomerId) => {
    if (!roomRentRequestsId || !selectedCustomerId) {
      throw new Error("Missing required parameters");
    }
  
    console.log("Calling API with parameters:", { roomRentRequestsId, selectedCustomerId });
  
    try {
      const params = new URLSearchParams({
        roomRentRequestsId,
        selectedCustomerId
      });
  
      const url = `/api/roomrentrequest/accept-customer-and-reject-others?${params.toString()}`;
      console.log("Generated API URL:", url);
  
      // Gọi API với POST và không cần body (vì tham số đã được gửi qua query string)
      const response = await axiosClient.post(url);
  
      console.log("API Response:", response);
  
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error accepting customer for room rental:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  }
};

export default roomRentalService;