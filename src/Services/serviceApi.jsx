import axiosClient from "./axios/config";

export const getAllServicePackage = async (pageIndex = 0, pageSize = 0, search = '') => {
    try {
      const params = new URLSearchParams();
      if (pageIndex > 0) params.append('pageIndex', pageIndex);
      if (pageSize > 0) params.append('pageSize', pageSize);
      if (search.trim()) params.append('searchQuery', search);
  
      const response = await axiosClient.get(`/api/packageservice?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('An error occurred');
    }
  };
  

export const getServiceDetailByPackageId = async (packageId) => {
    try {
        const response = await axiosClient.get(`/api/packageservice/get-service-details/${packageId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('An error occurred');
    }
};

export const getServicePackageByLandlord = async () => {
  try {
      const response = await axiosClient.get(`/api/packageservice/get-service-package-by-landlord`);
      return response.data;
  } catch (error) {
      throw error.response?.data || new Error('An error occurred');
  }
};


export const updatePrice = async (priceId, newPrice) => {
  try {
      if (!priceId || typeof newPrice !== "number" || newPrice <= 0) {
          throw new Error("Invalid priceId or newPrice must be a positive number.");
      }

      // Gửi request cập nhật giá
      const response = await axiosClient.put(
          `/api/packageservice/update-price/${priceId}`,
          { newPrice }, // Dữ liệu gửi trong body
          {
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );

      return response.data;
  } catch (error) {
      // Xử lý lỗi trả về từ API
      console.error("Error updating price:", error);

      throw error.response?.data?.message || "An error occurred while updating price.";
  }
};
