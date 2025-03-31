import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Spin, Empty, Carousel, Descriptions, List, Divider, Typography } from "antd";
import { 
  HomeOutlined, 
  DollarOutlined, 
  EnvironmentOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import roomRentalService from "../../../Services/Landlord/roomAPI";
import "./RoomDetail.scss";

const { Title, Paragraph } = Typography;

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [roomDetail, setRoomDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomDetail = async () => {
      setLoading(true);
      try {
        const data = await roomRentalService.getRoomDetailByRoomId(roomId);
        console.log("Room Detail Data:", data);
  
        if (data?.isSuccess && data?.data?.rooms && data.data.rooms.length > 0) {
          setRoomDetail(data.data.rooms[0]);
        } else {
          setError("No room details found.");
        }
      } catch (err) {
        setError("Error loading room details.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRoomDetail();
  }, [roomId]);
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleBackToManagement = () => {
    // Kiểm tra nếu roomTypeId có giá trị
    if (roomDetail?.roomTypeId) {
      navigate(`/landlord/roomtype/room?roomType=${roomDetail.roomTypeId}`);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <div>Loading room details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="button-group">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            type="primary"
            className="back-button"
          >
            Back
          </Button>
          <Button 
            icon={<AppstoreOutlined />} 
            onClick={handleBackToManagement}
            className="management-button"
          >
            Back to Room Management
          </Button>
        </div>
        <Empty 
          description={<span className="error-text">{error}</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </div>
    );
  }

  if (!roomDetail) {
    return (
      <div className="empty-container">
        <div className="button-group">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            type="primary"
            className="back-button"
          >
            Back
          </Button>
          <Button 
            icon={<AppstoreOutlined />} 
            onClick={handleBackToManagement}
            className="management-button"
          >
            Back to Room Management
          </Button>
        </div>
        <Empty description="No room details found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div className="room-detail">
      <div className="button-group">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          type="primary"
          className="back-button"
        >
          Back
        </Button>
        <Button 
          icon={<AppstoreOutlined />} 
          onClick={handleBackToManagement}
          className="management-button"
        >
          Back to Room Management
        </Button>
      </div>
      
      <Card className="room-detail-card">
        <Title level={2} className="room-title">{roomDetail.title}</Title>
        
        {/* Room Status Badge */}
        <div className="status-badge">
          <Tag color={roomDetail.status === "Available" ? "success" : "error"} className="status-tag">
            {roomDetail.status}
          </Tag>
        </div>
        
        {/* Room Image Carousel */}
        <div className="carousel-container">
          {roomDetail.roomImages && roomDetail.roomImages.length > 0 ? (
            <Carousel autoplay className="room-image-carousel">
              {roomDetail.roomImages.map((image, index) => (
                <div key={index}>
                  <div className="image-wrapper">
                    <img 
                      src={image} 
                      alt={`${roomDetail.title} - Image ${index + 1}`} 
                      className="room-image"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="image-wrapper no-image">
              <img
                alt="No Image Available"
                src="https://via.placeholder.com/300x200?text=No+Image"
                className="room-image"
              />
            </div>
          )}
        </div>
        
        <div className="room-content">
          <div className="room-summary">
            <div className="summary-item">
              <HomeOutlined className="summary-icon" />
              <div className="summary-text">
                <div className="summary-label">Room</div>
                <div className="summary-value">{roomDetail.roomNumber}</div>
              </div>
            </div>
            
            <div className="summary-item">
              <DollarOutlined className="summary-icon price-icon" />
              <div className="summary-text">
                <div className="summary-label">Price</div>
                <div className="summary-value price-value">
                  {roomDetail.price ? roomDetail.price.toLocaleString() : "N/A"} VND
                </div>
              </div>
            </div>
            
            <div className="summary-item">
              <EnvironmentOutlined className="summary-icon location-icon" />
              <div className="summary-text">
                <div className="summary-label">Location</div>
                <div className="summary-value">{roomDetail.location}</div>
              </div>
            </div>
          </div>
          
          <Divider className="section-divider" />
          
          <div className="details-section">
            <Title level={4} className="section-title">Details</Title>
            
            <Descriptions bordered column={1} className="room-descriptions">
              <Descriptions.Item label="Room Type">
                {roomDetail.roomTypeName}
              </Descriptions.Item>
              
              <Descriptions.Item label="Description">
                <Paragraph className="room-description">
                  {roomDetail.description}
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </div>
          
          {/* Amenities Section */}
          {roomDetail.amenties && roomDetail.amenties.length > 0 && (
            <>
              <Divider className="section-divider" />
              <div className="amenities-section">
                <Title level={4} className="section-title">Amenities</Title>
                <div className="amenities-grid">
                  {roomDetail.amenties.map((item, index) => (
                    <div key={index} className="amenity-card">
                      <CheckCircleOutlined className="amenity-icon" />
                      <div className="amenity-content">
                        <div className="amenity-name">{item.name}</div>
                        {item.compensation && (
                          <div className="amenity-compensation">
                            {item.compensation.toLocaleString()} VND
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RoomDetail;