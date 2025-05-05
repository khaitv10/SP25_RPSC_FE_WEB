import axiosClient from "../axios/config";

const postAPI = {
  getLandlordCustomerPosts: async () => {
    try {
      const response = await axiosClient.get('/api/post/posts/landlord/customer-roommate');
      return response.data;
    } catch (error) {
      console.error('Error fetching landlord customer posts:', error);
      throw error;
    }
  },

  inactivatePost: async (postId) => {
    try {
      const response = await axiosClient.put(`/api/post/inactivate-roommate-post-by-landlord/${postId}`, {});
      return response.data;
    } catch (error) {
      console.error('Error inactivating post:', error);
      throw error;
    }
  },

  getRoommatePostDetail: async (postId) => {
    try {
      const response = await axiosClient.get('/api/post/Get-Roommate-Post-Detail', {
        params: { postId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching roommate post detail:', error);
      throw error;
    }
  }
};

export default postAPI;
