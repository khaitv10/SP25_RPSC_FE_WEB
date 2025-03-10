import { useEffect, useState } from "react";
import getAllRoomTypePending from  "../../Services/Admin/roomTypeAPI";
import "../../pages/Admin/RequestManagement/RequestManagement.scss";


const RoomTypeApproval = () => {
  const [pendingRoomTypes, setPendingRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRoomTypes();
  }, []);

  const fetchPendingRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllRoomTypePending.getPendingRoomTypes(1, 10);
      setPendingRoomTypes(data);
    } catch (error) {
      console.error("Failed to fetch pending room types:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">Room Type Approval Requests</h2>
      {loading ? (
        <p>Loading pending requests...</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Room Type Name</th>
              <th>Landlord Name</th>
              <th>Deposit</th>
              <th>Square</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRoomTypes.length > 0 ? (
              pendingRoomTypes.map((room) => (
                <tr key={room.roomTypeId}>
                  <td>{room.roomTypeName}</td>
                  <td>{room.landlordName}</td>
                  <td>${room.deposite}</td>
                  <td>{room.square} m²</td>
                  <td>{room.status}</td>
                  <td>
                    <button className="approve-btn">Approve</button>
                    <button className="reject-btn">Reject</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No pending room types.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoomTypeApproval;
