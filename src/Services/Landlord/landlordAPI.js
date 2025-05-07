import axios from 'axios';

const BASE_URL = 'https://opal.io.vn/api/landlord';

const landlordAPI = {
    getLeaveRoomRequests: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/tenant-leave-room-requests`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching leave room requests:', error);
            throw error;
        }
    },

    acceptLeaveRoomRequest: async (requestId) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/accept-tenant-leave-room-request/${requestId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error accepting leave room request:', error);
            throw error;
        }
    },
    getLeaveRoomRequestDetail: async (id) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/detail-tenant-leave-room-request/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
            console.error('Error fetching leave room request detail:', error);
            throw error;
        }
    }
};

export default landlordAPI; 