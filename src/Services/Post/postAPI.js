import axios from 'axios';

const BASE_URL = 'http://localhost:5262/api/post';

const postAPI = {
  getLandlordCustomerPosts: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/posts/landlord/customer-roommate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching landlord customer posts:', error);
      throw error;
    }
  },

  inactivatePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/posts/landlord/inactivate/${postId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error inactivating post:', error);
      throw error;
    }
  },
  getRoommatePostDetail: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/Get-Roommate-Post-Detail`, {
        params: { postId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching roommate post detail:', error);
      throw error;
    }
  }
  
};

export default postAPI; 