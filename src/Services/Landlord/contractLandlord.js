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

  export const getLandlordContracts = async (
    pageIndex = 1,
    pageSize = 10,
    status = "",
    search = ""
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("pageIndex", pageIndex);
      params.append("pageSize", pageSize);
      if (status && status !== "All") params.append("status", status);
      if (search.trim()) params.append("search", search);
  
      const token = localStorage.getItem("authToken");
  
      const response = await axiosClient.get(
        `/api/landlordcontract/get-landlordcontract-landlordid?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`  // Gửi token vào header
          }
        }
      );
  
      return response.data.data;  // Dữ liệu hợp đồng trả về từ API
    } catch (error) {
      console.error("❌ Error fetching landlord contracts:", error);
      throw error.response?.data || new Error("An error occurred");
    }
  };
  export const getLandlordContractById = async (contractId) => {
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await axiosClient.get(
        `/api/landlordcontract/Get-LandlordContract-ContractId?contractId=${contractId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data.data;  // Return the contract data from the API response
    } catch (error) {
      console.error("❌ Error fetching contract details:", error);
      throw error.response?.data || new Error("An error occurred while fetching contract details");
    }
  };



  export const extendLandlordPackage = async (landlordId, packageId, serviceDetailId) => {
    try {
      const formData = new FormData();
      formData.append("LandlordId", landlordId);
      formData.append("PackageId", packageId);
      formData.append("ServiceDetailId", serviceDetailId);
  
      const token = localStorage.getItem("authToken");
      
      const response = await axiosClient.post(
        "/api/payment/package/extend",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("❌ Error extending landlord package:", error);
      throw error.response?.data || new Error("An error occurred while extending the package");
    }
  };

  export const viewAllRequestExtendContract = async (pageIndex = 1, pageSize = 10) => {
    try {
      const token = localStorage.getItem("authToken");
  
      const params = new URLSearchParams();
      params.append("pageIndex", pageIndex);
      params.append("pageSize", pageSize);
  
      const response = await axiosClient.get(
        `/api/requestextendcontract/View-All-Request-by-landlord?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      return response.data.data; // Trả về danh sách yêu cầu gia hạn hợp đồng
    } catch (error) {
      console.error("❌ Error fetching extend contract requests:", error);
      throw error.response?.data || new Error("An error occurred while fetching extend contract requests");
    }
  };
  

  export const getExtendRequestDetailByContractId = async (contractId) => {
    try {
      const response = await axiosClient.get(
        `/api/requestextendcontract/View-Detail-Request-By-Contract`,
        {
          params: { contractId }
        }
      );
  
      return response.data.data; // Trả về dữ liệu chi tiết yêu cầu gia hạn
    } catch (error) {
      console.error("❌ Error fetching extend request detail:", error);
      throw error.response?.data || new Error("An error occurred while fetching extend request detail");
    }
  };
  
  export const approveExtendContractRequest = async (requestId, messageLandlord = "") => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosClient.post(
        "/api/requestextendcontract/Approve-ExtendContract",
        {
          requestId,
          messageLandlord
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error approving extend request:", error);
      throw error.response?.data || new Error("An error occurred while approving the request");
    }
  };
  
  export const rejectExtendContractRequest = async (requestId, messageLandlord = "") => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosClient.post(
        "/api/requestextendcontract/Reject-ExtendContract",
        {
          requestId,
          messageLandlord
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error rejecting extend request:", error);
      throw error.response?.data || new Error("An error occurred while rejecting the request");
    }
  };
  