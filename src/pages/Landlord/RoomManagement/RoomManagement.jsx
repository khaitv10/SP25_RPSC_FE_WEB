import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Tag, Button, Row, Col, Empty, Spin, Input, Select, Badge } from "antd";
import { HomeOutlined, DollarOutlined, EnvironmentOutlined, ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import roomRentalService from "../../../Services/Landlord/roomAPI";
import "./RoomManagement.scss";

const { Meta } = Card;
const { Option } = Select;

const RoomManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const roomTypeId = searchParams.get("roomType");

  const [roomList, setRoomList] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await roomRentalService.getRoomsByRoomTypeId(roomTypeId, 1, 100);
        if (data?.isSuccess && data?.data?.rooms) {
          setRoomList(data.data.rooms);
          setFilteredRooms(data.data.rooms);
        } else {
          setError("No rooms found.");
        }
      } catch (err) {
        setError("Error loading rooms.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomTypeId]);

  useEffect(() => {
    let result = [...roomList];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(room => 
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomNumber.toString().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(room => room.status === statusFilter);
    }
    
    setFilteredRooms(result);
  }, [searchTerm, statusFilter, roomList]);

  const handleViewDetails = (roomId) => {
    navigate(`/landlord/roomtype/room/roomdetail/${roomId}`);
  };
  

  const handleBack = () => {
    navigate(`/landlord/roomtype/${roomTypeId}`);
  };

  const handleBackToRoomTypeDetail = () => {
    navigate(`/landlord/roomtype/${roomTypeId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "#10B981";
      case "Renting":
        return "#EF4444";
      case "Maintenance":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  return (
    <div className="room-management">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
  <div className="flex flex-col gap-3 w-full md:w-auto">
    <div className="flex items-center flex-wrap">
      <h1 className="m-0 text-2xl md:text-3xl font-bold text-gray-900 mr-5 flex items-center">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack} 
          type="text" 
          className="mr-4 text-base text-gray-500 p-2 h-auto rounded-lg hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
        />
        <HomeOutlined className="mr-3 text-blue-500 text-2xl" /> My Rooms
      </h1>
    </div>
  </div>
</div>

      <div className="filters-container">
        <div className="search-box">
          <Input
            placeholder="Search by room name, number or description..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            allowClear
          />
        </div>
        <div className="status-filters">
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 140 }}
            className="status-select"
          >
            <Option value="All">All Status</Option>
            <Option value="Available">Available</Option>
            <Option value="Renting">Renting</Option>
            <Option value="Maintenance">Maintenance</Option>
          </Select>
          {(searchTerm || statusFilter !== "All") && (
            <Button onClick={clearFilters} className="reset-button">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

{/* Results Summary and Add New Room in the same row */}
<div className="flex justify-between items-center mb-5">
  {filteredRooms.length > 0 && (
    <div className="text-sm font-medium text-gray-500">
      Showing {filteredRooms.length} of {roomList.length} rooms
    </div>
  )}
  
  <Button
      type="primary"
      size="large"
      className="bg-gradient-to-r from-blue-500 to-blue-600 border-none rounded-xl shadow-md px-6 h-12 font-semibold text-base transition-all duration-300 hover:from-blue-400 hover:to-blue-500 hover:shadow-lg hover:-translate-y-0.5 ml-auto"
      onClick={() => navigate(`/landlord/roomtype/${roomTypeId}/add-room`)}
    >
      + Add New Room
    </Button>

</div>


      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <div>Loading your rooms...</div>
        </div>
        
      ) : filteredRooms.length === 0 ? (
        <div className="empty-container">
          <Empty 
            description={
              <span>
                {searchTerm || statusFilter !== "All" 
                  ? "No rooms match your current filters" 
                  : "No rooms found"}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        
        <Row gutter={[24, 24]} className="rooms-grid">
          {filteredRooms.map((room) => (
            <Col xs={24} sm={12} md={8} lg={6} key={room.roomId}>
              <Card
                hoverable
                className="room-card"
                cover={
                  <div className="card-image-container">
                    <img
                      alt={room.title}
                      src={room.roomImages?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                      className="room-image"
                    />
                    <div className="status-tag">
                      <Tag color={getStatusColor(room.status)}>
                        {room.status}
                      </Tag>
                    </div>
                  </div>
                }
                actions={[
                  <Button 
                    type="primary" 
                    onClick={() => handleViewDetails(room.roomId)}
                    className="view-details-button"
                  >
                    View Details
                  </Button>
                ]}
              >
                <div className="room-title">{room.title}</div>
                <div className="room-details">
                  <div className="room-number">Room {room.roomNumber}</div>
                  <div className="room-description">{room.description}</div>
                  <div className="card-divider" />
                  <div className="room-price">
                    <DollarOutlined /> {room.price.toLocaleString()} VND
                  </div>
                  <div className="room-location">
                    <EnvironmentOutlined /> {room.location}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RoomManagement;