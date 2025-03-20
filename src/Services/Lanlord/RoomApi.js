import axios from "axios";

export const createRoomTypeAPI = async (roomData, token) => {
  try {
    console.log("Calling API: /api/roomtype/create-roomtype");
    const response = await axios.post(
      "https://localhost:7159/api/roomtype/create-roomtype",
      { roomData, token },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating room tydpe:",
      error.response ? error.response.data : error,
    );
    throw error;
  }
};
