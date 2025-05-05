import axiosClient from "../axios/config";

export const getAllAmenities = async (
  searchQuery = "",
  pageIndex = 1,
  pageSize = 10,
) => {
  try {
    const params = new URLSearchParams();
    params.append("searchQuery", searchQuery);
    params.append("pageIndex", pageIndex);
    params.append("pageSize", pageSize);

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (!token) throw new Error("Authorization token is missing");

    // Cập nhật lại endpoint URL đúng với server
    const response = await axiosClient.get(
      `/api/roomamenty/getallamenties?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data; // Trả về danh sách amenities
  } catch (error) {
    console.error("❌ Error fetching amenities:", error);
    throw error.response?.data || new Error("An error occurred");
  }
};

export const createAmenity = async (amenityData) => {
  try {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (!token) throw new Error("Authorization token is missing");

    const response = await axiosClient.post(
      `/api/roomamenty/Create-RoomAmenty`,
      amenityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data; // Return the created amenity data
  } catch (error) {
    console.error("❌ Error creating amenity:", error);
    throw error.response?.data || new Error("An error occurred");
  }
};

export const UpdateAmenity = async (amenityData, amenityId) => {
  try {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (!token) throw new Error("Authorization token is missing");

    const response = await axiosClient.put(
      `/api/roomamenty/Update-Amenity/${amenityId}`,
      amenityData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("❌ Error creating amenity:", error);
    throw error.response?.data || new Error("An error occurred");
  }
};

// export const DeleteAmenity = async (amenityId) => {
//   try {
//     const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
//     if (!token) throw new Error("Authorization token is missing");

//     const response = await axiosClient.delete(
//       `/api/roomamenty/Delete-Amenity/${amenityId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     return response.data.data;
//   } catch (error) {
//     console.error("❌ Error creating amenity:", error);
//     throw error.response?.data || new Error("An error occurred");
//   }
// };
