import React, { useState, useEffect } from "react";
import { Skeleton, Card, Badge, Typography, Divider, Empty, Tabs, Button } from "antd";
import { 
  HomeOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  PictureOutlined,
  ClockCircleOutlined,
  RightOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getRoomStaysByLandlord } from "../../Services/Landlord/roomStayApi";
import "./RentedRoomManagement.scss";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const RentedRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentedRooms();
  }, []);

  const fetchRentedRooms = async () => {
    try {
      setLoading(true);
      const response = await getRoomStaysByLandlord();
      console.log("API Response:", response);

      if (response?.data?.roomStays?.length > 0) {
        setRooms(response.data.roomStays);
        console.log("Updated rooms state:", response.data.roomStays);
      } else {
        setRooms([]);
        console.log("No rented rooms found.");
      }
    } catch (error) {
      console.error("Error fetching rented rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge status="success" text="Active" />;
      case "Pending":
        return <Badge status="warning" text="Pending" />;
      case "Expired":
        return <Badge status="error" text="Expired" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImagePreview = () => {
    setSelectedImage(null);
  };

  const filterRooms = (tab) => {
    if (tab === "all") return rooms;
    return rooms.filter(room => room.status.toLowerCase() === tab.toLowerCase());
  };

  return (
    <div className="rented-room-management">
      <div className="dashboard-header">
        <div className="header-content">
          <Title level={2} className="title">
            <HomeOutlined /> Rented Room Management
          </Title>
        </div>
      </div>

      <div className="rooms-content">


        {loading ? (
          <div className="rooms-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="room-card skeleton-card">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </Card>
            ))}
          </div>
        ) : filterRooms(activeTab).length > 0 ? (
          <div className="rooms-grid">
            {filterRooms(activeTab).map((room) => (
              <Card 
                key={room.roomStayId} 
                className="room-card"
                hoverable
              >
                <div className="room-card-top">
                  <div className="room-image-gallery">
                    <div className="main-image">
                      <img 
                        src={room.imageUrls[0]} 
                        alt={room.title} 
                        onClick={() => handleImageClick(room.imageUrls[0])}
                      />
                    </div>
                    <div className="image-thumbnails">
                      {room.imageUrls.slice(1, 4).map((url, idx) => (
                        <div 
                          key={idx} 
                          className="thumbnail"
                          onClick={() => handleImageClick(url)}
                        >
                          <img src={url} alt={`${room.title} - image ${idx + 2}`} />
                        </div>
                      ))}
                      {room.imageUrls.length > 4 && (
                        <div className="more-images">
                          <PictureOutlined />
                          <span>+{room.imageUrls.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="room-card-content">
                  <div className="room-header">
                    <div className="room-title-area">
                      <Title level={4}>{room.title}</Title>
                      <div className="room-status">
                        {getStatusBadge(room.status)}
                      </div>
                    </div>
                    <div className="room-number">
                      Room #{room.roomNumber}
                    </div>
                  </div>

                  <div className="room-info">
                    <Paragraph ellipsis={{ rows: 2 }} className="room-description">
                      {room.description}
                    </Paragraph>
                    
                    <div className="info-row">
                      <div className="info-item">
                        <EnvironmentOutlined /> {room.location}
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-item">
                        <CalendarOutlined /> {formatDate(room.startDate)} - {formatDate(room.endDate)}
                      </div>
                    </div>

                    <div className="info-row contract-info">
                      <div className="remaining-days">
                        <ClockCircleOutlined /> {calculateRemainingDays(room.endDate)} days remaining
                      </div>
                    </div>
                  </div>

                  <Divider className="card-divider" />

                  <div className="card-actions">
                    <Button 
                      type="primary" 
                      className="details-btn"
                      onClick={() => navigate(`/landlord/rented-room/${room.roomStayId}`)}
                    >
                      View Details <RightOutlined />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty 
            className="no-data" 
            description="No rented rooms available" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </div>

      {selectedImage && (
        <div className="image-preview-overlay" onClick={handleCloseImagePreview}>
          <div className="image-preview-container" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Preview" />
            <Button 
              className="close-preview" 
              type="primary" 
              shape="circle" 
              onClick={handleCloseImagePreview}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentedRoomManagement;