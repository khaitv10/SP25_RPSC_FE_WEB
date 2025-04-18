import axiosClient from "../axios/config";

const getAllLandlord = {
  getLandlords: async (pageIndex = 1, pageSize = 10, searchQuery = "", status = "") => {
    try {
      const response = await axiosClient.get(
        `/api/user/get-landlord?pageIndex=${pageIndex}&pageSize=${pageSize}` +
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

const getAllLandlordContract = {
  getLandlordContracts: async (pageIndex = 1, pageSize = 10, searchQuery = "", status = "") => {
    try {
      const response = await axiosClient.get(
        `/api/landlordcontract/get-landlordcontract?pageIndex=${pageIndex}&pageSize=${pageSize}` +
        (searchQuery ? `&searchQuery=${searchQuery}` : "") +
        (status ? `&status=${status}` : "")
      );

      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching landlord contracts:", error);
      throw error;
    }
  },
};

export const getTransactionSummary = async (year) => {
  try {
    const response = await axiosClient.get(`/api/transaction/get-transaction-summary?year=${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    throw error;
  }
};

export default getAllLandlord;
export { getAllLandlordContract };

