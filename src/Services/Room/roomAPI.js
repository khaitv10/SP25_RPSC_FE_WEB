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
  },
  getRoomsForPost: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/Get-Room-for-post`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms for post:', error);
      throw error;
    }
  },
  createPostRoom: async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/Create-PostRoom`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating post room:', error);
      throw error;
    }
  }
  

};

export default roomAPI;
