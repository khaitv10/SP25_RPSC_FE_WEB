import axios from 'axios';

const BASE_URL = 'http://localhost:5262/api/room';

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
  }
};

export default roomAPI; 