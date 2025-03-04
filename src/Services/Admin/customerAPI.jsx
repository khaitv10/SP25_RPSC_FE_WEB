import axiosClient from "../axios/config";

const getAllCustomer = {
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
};

export default getAllCustomer;
