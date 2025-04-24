import axios from 'axios';

const BASE_URL = 'https://opal.io.vn/api/room';

const roomAPI = {
  getLandlordRooms: async (pageNumber, pageSize) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/landlord/rooms`, {
        params: {
          pageNumber,
          pageSize
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching landlord rooms:', error);
      throw error;
    }
  },

  getRoomDetail: async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });
      return response.data; // This is already the room data
    } catch (error) {
      console.error('Error fetching room detail:', error);
      throw error;
    }
  }
};

export default roomAPI;
