import axiosClient from "../axios/config";

export const getCustomerContracts = async (
  pageIndex = 1,
  pageSize = 10,
  term = "",
  status = ""
) => {
  try {
    const params = new URLSearchParams();
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);
    if (term.trim()) params.append("term", term);
    if (status && status !== "All") params.append("status", status);

    const response = await axiosClient.get(`/api/contractcustomer/Get-Customer-Contracts?${params.toString()}`);
    return response.data.data; 
  } catch (error) {
    console.error("❌ Error fetching customer contracts:", error);
    throw error.response?.data || new Error("An error occurred");
  }
};

export const confirmContractAndCreateRoomStay = async (contractId, contractFile) => {
    try {
      const formData = new FormData();
      formData.append("ContractId", contractId);
      formData.append("ContractFile", contractFile);
  
      const response = await axiosClient.post(
        "/api/RoomRentRequest/Upload-Contract-Create-RoomStay",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("❌ Error confirming contract:", error);
      throw error.response?.data || new Error("An error occurred");
    }
  };

  export const getContractDetail = async (contractId) => {
    try {
      const response = await axiosClient.get(`/api/contractcustomer/Get-Contract-Detail`, {
        params: { contractId }
      });
      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching contract detail:", error);
      throw error.response?.data || new Error("An error occurred");
    }
  };
  