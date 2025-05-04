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
  Col,
  Tag
} from "antd";
import { 
  HomeOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined, 
  PictureOutlined,
  ClockCircleOutlined,
  RightOutlined,
  SearchOutlined,
  CloseOutlined,
  DollarOutlined
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
        return <Tag color="success" className="status-tag">Renting</Tag>;
      case "Pending":
        return <Tag color="warning" className="status-tag">Pending</Tag>;
      case "Expired":
        return <Tag color="error" className="status-tag">Expired</Tag>;
      default:
        return <Tag color="default" className="status-tag">{status}</Tag>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
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
        </div>
      </div>

      <div className="rooms-content">
        <div className="filter-section">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16} lg={16}>
              <Input.Search
                placeholder="Search by location"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="search-input"
              />
            </Col>
            <Col xs={24} md={8} lg={8} className="rooms-count">
              <div className="total-rooms">
                Total Rooms: <span>{pagination.total}</span>
              </div>
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
                        alt="Room"
                        onClick={() => handleImageClick(room.imageUrls[0])}
                      />
                      {room.imageUrls.length > 1 && (
                        <div className="more-images-badge">
                          <PictureOutlined /> +{room.imageUrls.length - 1} photos
                        </div>
                      )}
                    </div>
                    <div className="room-number-badge">
                      Room #{room.roomNumber}
                    </div>
                  </div>

                  <div className="room-card-content">
                    <div className="room-header">
                      <div className="room-price">
                        <DollarOutlined />
                        {room.roomPrices && room.roomPrices.length > 0 ? (
                          <span>{formatPrice(room.roomPrices[0].price)}</span>
                        ) : (
                          <span>Price not available</span>
                        )}
                      </div>
                      <div className="room-status">
                        {getStatusBadge(room.status)}
                      </div>
                    </div>

                    <div className="room-info">
                      <div className="amenities-container">
                        <h4 className="amenities-title">Amenities</h4>
                        <div className="amenities-list">
                          {room.roomAmenties && room.roomAmenties.length > 0 ? (
                            room.roomAmenties.map((amenity) => (
                              <Tag key={amenity.amenityId} className="amenity-tag">
                                {amenity.amenityName}
                              </Tag>
                            ))
                          ) : (
                            <Text type="secondary">No amenities available</Text>
                          )}
                        </div>
                      </div>
                      
                      <div className="info-row">
                        <div className="info-item">
                          <EnvironmentOutlined /> {room.location}
                        </div>
                      </div>
                      
                      <div className="info-row">
                        <div className="info-item">
                          <CalendarOutlined /> 
                          <span className="date-range">
                            {formatDate(room.startDate)} - {formatDate(room.endDate)}
                          </span>
                        </div>
                      </div>

                      <div className="info-row contract-info">
                        <div className="remaining-days">
                          <ClockCircleOutlined /> {calculateRemainingDays(room.endDate)} days remaining
                        </div>
                      </div>
                    </div>

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
          <div className="no-data">
            <Empty 
              description="No rented rooms available" 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          </div>
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
              icon={<CloseOutlined />}
              onClick={handleCloseImagePreview}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RentedRoomManagement;