import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Spin, Typography, Card, Row, Col, Divider, Tag, Space,
  Descriptions, Image, Button, Carousel, Statistic, Badge, 
  List, Avatar, Breadcrumb, Alert, Modal, Rate
} from 'antd';
import {
  HomeOutlined, DollarOutlined, CalendarOutlined, 
  UserOutlined, EnvironmentOutlined, InfoCircleOutlined, 
  ArrowLeftOutlined, LoadingOutlined, CheckCircleOutlined,
  PhoneOutlined, MailOutlined, BankOutlined, AppstoreOutlined,
  HeartOutlined, ShareAltOutlined, StarFilled
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import roomAPI from '../../Services/Room/roomAPI';
import './PostDetail.scss';

const { Title, Text, Paragraph } = Typography;

const PostRoomDetail = () => {
  const params = useParams();
  const location = useLocation();
  console.log('URL Params:', params);
  console.log('Current path:', location.pathname);
  
  // Extract the roomId from URL directly if params doesn't work
  const urlParts = location.pathname.split('/');
  const roomIdFromUrl = urlParts[urlParts.length - 1];
  
  // Use either the param or extracted ID
  const roomId = params.roomId || params.roomid || roomIdFromUrl;
  console.log('Using roomId:', roomId);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomDetail, setRoomDetail] = useState(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (roomId) {
      fetchRoomDetail();
    } else {
      console.error('No roomId available');
      setLoading(false);
    }
  }, [roomId]);

  const fetchRoomDetail = async () => {
    try {
      setLoading(true);
      console.log('Fetching room details for ID:', roomId);
      const response = await roomAPI.getRoomDetail(roomId);
      
      // The response is the room data itself, not wrapped in a response object
      if (response && response.roomId) {
        setRoomDetail(response);
      } else {
        toast.error('Invalid room data received');
      }
    } catch (error) {
      toast.error('Failed to fetch room details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImagePreview = (imageUrl) => {
    setCurrentImage(imageUrl);
    setImagePreviewVisible(true);
  };

  const handleBackToList = () => {
    navigate('/landlord/post');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        <p>Loading room details...</p>
      </div>
    );
  }

  if (!roomDetail) {
    return (
      <div className="error-container">
        <Alert
          message="Room Not Found"
          description="The requested room could not be found. Please check the room ID and try again."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={handleBackToList}>
              Back to Room List
            </Button>
          }
        />
      </div>
    );
  }

  const currentPrice = roomDetail.roomPrices && roomDetail.roomPrices.length > 0 
    ? roomDetail.roomPrices[0].price 
    : 0;

  return (
    <div className="post-room-detail">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={handleBackToList}><HomeOutlined /> Room List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Room Details</Breadcrumb.Item>
        </Breadcrumb>
        
        <div className="header-actions">
          <Button 
            type="primary"
            ghost
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToList}
            className="back-button"
          >
            Back to List
          </Button>
        </div>
      </div>

      <Card className="room-detail-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="room-header">
              <div className="room-title-section">
                <Badge.Ribbon 
                  text={roomDetail.status} 
                  color={roomDetail.status === 'Available' ? 'green' : 'orange'}
                >
                  <Title level={2}>{roomDetail.title}</Title>
                </Badge.Ribbon>
                
                <div className="title-actions">
                  {roomDetail.packageLabel && (
                    <Tag color="gold" className="package-label">
                      {roomDetail.packageLabel}
                    </Tag>
                  )}
                </div>
              </div>

              <div className="room-location">
                <EnvironmentOutlined /> {roomDetail.location}
              </div>
            </div>

            <div className="room-carousel-container">
              <Carousel autoplay className="room-carousel">
                {roomDetail.roomImages.map((image, index) => (
                  <div key={index} className="carousel-item">
                    <img 
                      src={image} 
                      alt={`Room ${index + 1}`} 
                      onClick={() => handleImagePreview(image)}
                      className="carousel-image"
                    />
                  </div>
                ))}
              </Carousel>
              
              <div className="thumbnail-gallery">
                {roomDetail.roomImages.map((image, index) => (
                  <div key={index} className="thumbnail-item">
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => handleImagePreview(image)} 
                      className="thumbnail-image"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-info">
              <Row gutter={16}>
                <Col span={8}>
                  <Card className="info-card">
                    <Statistic 
                      title="Room Area" 
                      value={roomDetail.roomType.area} 
                      suffix="m²" 
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className="info-card">
                    <Statistic 
                      title="Occupancy" 
                      value={roomDetail.roomType.maxOccupancy} 
                      suffix="people" 
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className="info-card">
                    <Statistic 
                      title="Room Type" 
                      value={roomDetail.roomType.roomTypeName} 
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <Divider />

            <div className="room-description">
              <Title level={4}>Description</Title>
              <Paragraph>{roomDetail.description}</Paragraph>
            </div>

            <Divider />

            <div className="room-details-section">
              <Title level={4}>Room Details</Title>
              <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} className="details-table">
                <Descriptions.Item label="Room Type">
                  {roomDetail.roomType.roomTypeName}
                </Descriptions.Item>
                <Descriptions.Item label="Area">
                  {roomDetail.roomType.area} m²
                </Descriptions.Item>
                <Descriptions.Item label="Max Occupancy">
                  {roomDetail.roomType.maxOccupancy} people
                </Descriptions.Item>
                <Descriptions.Item label="Available From">
                  {formatDate(roomDetail.availableDateToRent)}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {formatDate(roomDetail.updatedAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={roomDetail.status === 'Available' ? 'green' : 'orange'}>
                    {roomDetail.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider />

            <div className="amenities-section">
              <Title level={4}>Amenities</Title>
              <div className="amenities-list">
                {roomDetail.roomAmenities.map((amenity) => (
                  <Tag 
                    key={amenity.amenityId} 
                    icon={<CheckCircleOutlined />} 
                    color="blue"
                    className="amenity-tag"
                  >
                    {amenity.name}
                  </Tag>
                ))}
              </div>
            </div>

            <Divider />

            <div className="address-section">
              <Title level={4}>Address</Title>
              <Card className="address-card">
                <Descriptions bordered column={{ xs: 1, sm: 2 }} className="details-table">
                  <Descriptions.Item label="City">
                    {roomDetail.roomType.address.city}
                  </Descriptions.Item>
                  <Descriptions.Item label="District">
                    {roomDetail.roomType.address.district}
                  </Descriptions.Item>
                  <Descriptions.Item label="Street">
                    {roomDetail.roomType.address.street}
                  </Descriptions.Item>
                  <Descriptions.Item label="House Number">
                    {roomDetail.roomType.address.houseNumber}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="price-card">
              <Statistic 
                title="Monthly Rent"
                value={currentPrice}
                precision={0}
                prefix={<DollarOutlined />}
                formatter={(value) => formatPrice(value)}
                className="price-statistic"
              />
              <div className="available-date">
                <CalendarOutlined /> Available from: {formatDate(roomDetail.availableDateToRent)}
              </div>
            </Card>

            <Card title="Services" className="detail-side-card services-card">
              <List
                itemLayout="horizontal"
                dataSource={roomDetail.roomServices}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                      title={item.roomServiceName}
                      description={
                        <div>
                          <div>{item.description}</div>
                          <div className="service-price">
                            {item.prices && item.prices.length > 0 && formatPrice(item.prices[0].price)}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            
          </Col>
        </Row>
      </Card>

      <Modal
        open={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
        width="80%"
        className="image-preview-modal"
      >
        <img 
          alt="Room Preview" 
          src={currentImage} 
          style={{ width: '100%' }} 
        />
      </Modal>
    </div>
  );
};

export default PostRoomDetail;