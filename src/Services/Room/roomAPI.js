import axiosClient from "../axios/config";

const roomAPI = {
  getLandlordRooms: async (pageNumber, pageSize) => {
    try {
      const response = await axiosClient.get('/api/room/landlord/rooms', {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching landlord rooms:', error);
      throw error;
    }
  },

  getRoomDetail: async (roomId) => {
    try {
      const response = await axiosClient.get(`/api/room/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room detail:', error);
      throw error;
    }
  },

  getRoomsForPost: async () => {
    try {
      const response = await axiosClient.get('/api/room/Get-Room-for-post');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms for post:', error);
      throw error;
    }
  },

  createPostRoom: async (postData) => {
    try {
      const response = await axiosClient.post('/api/room/Create-PostRoom', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post room:', error);
      throw error;
    }
  },

  updatePostRoom: async (postRoomId, updateData) => {
    try {
      const response = await axiosClient.put(`/api/room/Update-PostRoom/${postRoomId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating post room:', error);
      throw error;
    }
  },

  inactivePostRoom: async (postRoomId) => {
    try {
      const response = await axiosClient.put(`/api/room/Inactive-PostRoom/${postRoomId}`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating post room:', error);
      throw error;
    }
  }
};

export default roomAPI;
