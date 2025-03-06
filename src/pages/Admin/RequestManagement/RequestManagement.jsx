import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "react-feather"; 
import { FaEye } from "react-icons/fa";
import getAllRoomTypePending from "../../../Services/Admin/roomTypeAPI";
import getAllLandlordRequests from "../../../Services/Admin/landlordAPI";
import "./RequestManagement.scss";

const RequestManagement = () => {
  const [activeTab, setActiveTab] = useState("roomTypes");
  const [pendingRoomTypes, setPendingRoomTypes] = useState([]);
  const [pendingLandlords, setPendingLandlords] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [loadingLandlords, setLoadingLandlords] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "roomTypes") {
      fetchPendingRoomTypes();
    } else {
      fetchPendingLandlords();
    }
  }, [activeTab]);

  const fetchPendingRoomTypes = async () => {
    try {
      setLoadingRoomTypes(true);
      const roomTypes = await getAllRoomTypePending.getPendingRoomTypes(1, 10);
      setPendingRoomTypes(roomTypes || []);
    } catch (error) {
      console.error("Failed to fetch pending room types:", error);
    } finally {
      setLoadingRoomTypes(false);
    }
  };

  const fetchPendingLandlords = async () => {
    try {
      setLoadingLandlords(true);
      const data = await getAllLandlordRequests.getPendingLandlords(1, 10);
      setPendingLandlords(data);
    } catch (error) {
      console.error("Failed to fetch pending landlord requests:", error);
    } finally {
      setLoadingLandlords(false);
    }
  };

  const handleViewRoomDetails = (roomTypeId) => {
    navigate(`/admin/request/room-type/${roomTypeId}`);
  };

  const handleViewLandlordDetails = (landlordId) => {
    navigate(`/admin/request-management/landlord/${landlordId}`);
  };

  return (
    <div className="request-management-container">
      <h1 className="title">Request Management</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button className={activeTab === "roomTypes" ? "active" : ""} onClick={() => setActiveTab("roomTypes")}>
          Room Type Approvals
        </button>
        <button className={activeTab === "landlords" ? "active" : ""} onClick={() => setActiveTab("landlords")}>
          Landlord Account Approvals
        </button>
      </div>

      {/* Room Type Requests */}
      {activeTab === "roomTypes" && (
        <div className="section">
          {loadingRoomTypes ? (
            <p>Loading pending room types...</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>Room Type Name</th>
                  <th>Deposit</th>
                  <th>Square (m²)</th>
                  <th>Created At</th>
                  <th>Landlord</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRoomTypes.length > 0 ? (
                  pendingRoomTypes.map((room) => (
                    <tr key={room.roomTypeId}>
                      <td>{room.roomTypeName}</td>
                      <td>${room.deposite}</td>
                      <td>{room.square}</td>
                      <td>{new Date(room.createdAt).toLocaleDateString()}</td>
                      <td>{room.landlordName}</td>
                      <td>
                        <button className="icon-btn" onClick={() => handleViewRoomDetails(room.roomTypeId)}>
                          <span>Details</span>
                          <FaEye size={20} /> 
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No pending room types.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Landlord Requests */}
      {activeTab === "landlords" && (
        <div className="section">
          {loadingLandlords ? (
            <p>Loading pending landlord requests...</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>License Number</th>
                  <th>Number of Rooms</th>
                  <th>Bank Name</th>
                  <th>Bank Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLandlords.length > 0 ? (
                  pendingLandlords.map((landlord) => (
                    <tr key={landlord.landlordId}>
                      <td>{landlord.companyName}</td>
                      <td>{landlord.licenseNumber}</td>
                      <td>{landlord.numberRoom}</td>
                      <td>{landlord.bankName}</td>
                      <td>{landlord.bankNumber}</td>
                      <td>
                        <button className="icon-btn" onClick={() => handleViewLandlordDetails(landlord.landlordId)}>
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No pending landlord requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestManagement;
