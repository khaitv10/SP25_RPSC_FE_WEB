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


