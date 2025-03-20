import axiosClient from "./axios/config";

export const getAllServicePackage = async (
  pageIndex = 0,
  pageSize = 0,
  search = "",
) => {
  try {
    const params = new URLSearchParams();
    if (pageIndex > 0) params.append("pageIndex", pageIndex);
    if (pageSize > 0) params.append("pageSize", pageSize);
    if (search.trim()) params.append("searchQuery", search);

    const response = await axiosClient.get(
      `/api/packageservice?${params.toString()}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("An error occurred");
  }
};

export const getServiceDetailByPackageId = async (packageId) => {
  try {
    const response = await axiosClient.get(
      `/api/packageservice/get-service-details/${packageId}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("An error occurred");
  }
};

export const getServicePackageByLandlord = async () => {
  try {
    const response = await axiosClient.get(
      `/api/packageservice/get-service-package-by-landlord`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("An error occurred");
  }
};

export const updatePrice = async (
  priceId,
  newPrice,
  newName,
  newDuration,
  newDescription,
) => {
  if (!priceId || typeof newPrice !== "number" || newPrice <= 0) {
    throw new Error("Invalid priceId or newPrice must be a positive number.");
  }

  try {
    const { data } = await axiosClient.put(
      `/api/packageservice/update-price/${priceId}`,
      { newPrice, newName, newDuration, newDescription },
      { headers: { "Content-Type": "application/json" } },
    );
    return data;
  } catch (error) {
    console.error("Error updating price and service details:", error);
    throw new Error(
      error.response?.data?.message || "An error occurred while updating.",
    );
  }
};

export const createService = async (packageData) => {
  try {
    const response = await axiosClient.post(
      `/api/packageservice/create-service`,
      packageData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw (
      error.response?.data?.message ||
      "An error occurred while creating service."
    );
  }
};

export const createServiceDetail = async (serviceDetailData) => {
  try {
    if (!serviceDetailData) {
      throw new Error("Service detail data is required.");
    }

    const response = await axiosClient.post(
      `/api/packageservice/create-service-detail`,
      serviceDetailData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating service detail:", error);
    throw (
      error.response?.data?.message ||
      "An error occurred while creating service detail."
    );
  }
};
