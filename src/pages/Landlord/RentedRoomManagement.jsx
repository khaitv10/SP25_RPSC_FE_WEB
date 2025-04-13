import React, { useState, useEffect } from "react";
import { 
  Skeleton, 
  Card, 
  Badge, 
  Typography, 
  Divider, 
  Empty, 
  Button, 
  Input, 
  Pagination,
  Row,
  Col
} from "antd";
import { 
  HomeOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  PictureOutlined,
  ClockCircleOutlined,
  RightOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getRoomStaysByLandlord } from "../../Services/Landlord/roomStayApi";
import "./RentedRoomManagement.scss";

const { Title, Text, Paragraph } = Typography;

const RentedRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentedRooms();
  }, [pagination.current, pagination.pageSize, searchQuery]);

  const fetchRentedRooms = async () => {
    try {
      setLoading(true);
      const response = await getRoomStaysByLandlord(
        pagination.current,
        pagination.pageSize,
        searchQuery
      );
      
      if (response?.data?.roomStays?.length > 0) {
        setRooms(response.data.roomStays);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalRoomStays
        }));
      } else {
        setRooms([]);
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

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
      total: pagination.total
    });
  };
  
  return (
    <div className="rented-room-management">
      <div className="dashboard-header">
        <div className="header-content">
          <Title level={2} className="title">
            <HomeOutlined /> Rented Room Management
          </Title>
          <Text className="subtitle">
            Manage all your rented rooms in one place
          </Text>
        </div>
      </div>

      <div className="rooms-content">
        <div className="filter-section">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16} lg={16}>
              <Input.Search
                placeholder="Search by title or location"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="search-input"
              />
            </Col>
            <Col xs={24} md={8} lg={8} className="rooms-count">
              <Text className="total-rooms">
                Total Rooms: <span>{pagination.total}</span>
              </Text>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div className="rooms-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="room-card skeleton-card">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </Card>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="rooms-grid">
              {rooms.map((room) => (
                <Card 
                  key={room.roomStayId} 
                  className="room-card"
                  hoverable
                >
                  <div className="room-card-top">
                    <div className="room-image">
                      <img 
                        src={room.imageUrls[0]} 
                        alt={room.title} 
                        onClick={() => handleImageClick(room.imageUrls[0])}
                      />
                      {room.imageUrls.length > 1 && (
                        <div className="more-images-badge">
                          <PictureOutlined /> +{room.imageUrls.length - 1}
                        </div>
                      )}
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
            
            <div className="pagination-container">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
                hideOnSinglePage={false}
              />
            </div>
          </>
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