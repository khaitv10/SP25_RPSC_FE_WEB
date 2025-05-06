import axiosClient from "../axios/config";

const customerApi = {
  getCustomers: async (pageIndex = 1, pageSize = 10, searchQuery = "", status = "") => {
    try {
      const response = await axiosClient.get(
        `/api/user/get-customer?pageIndex=${pageIndex}&pageSize=${pageSize}` +
        (searchQuery ? `&searchQuery=${searchQuery}` : "") +
        (status ? `&status=${status}` : "")
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  inactiveCustomer: async (userId, reason) => {
    try {
      const payload = {
        userId,
        reason,
      };

      const response = await axiosClient.put("/api/customer/inactive-customer", payload);

      return response.data;
    } catch (error) {
      console.error("Error inactivating customer:", error);
      throw error;
    }
  },

  reactiveCustomer: async (userId) => {
    try {
      const response = await axiosClient.put(`/api/customer/reactive-customer?userId=${userId}`);
  
      return response.data;
    } catch (error) {
      console.error("Error reactivating customer:", error);
      throw error;
    }
  },
};

export default customerApi;
