import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Tag, Row, Col, Spin, 
  Divider, Avatar, Image, Space, Descriptions, 
  Badge, Button, Tooltip, Alert, Tabs, Modal,
  Breadcrumb
} from 'antd';
import { 
  UserOutlined, HomeOutlined, DollarOutlined, 
  EnvironmentOutlined, LoadingOutlined, InfoCircleOutlined,
  PhoneOutlined, MailOutlined, ClockCircleOutlined,
  CheckCircleOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import postAPI from '../../Services/Post/postAPI';
import './PostDetailCus.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PostDetailCus = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [postDetail, setPostDetail] = useState(null);
  const [imagePreview, setImagePreview] = useState({ visible: false, src: '' });

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getRoommatePostDetail(postId);
      if (response.isSuccess) {
        setPostDetail(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch post details');
      }
    } catch (error) {
      toast.error('Failed to fetch post details');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageClick = (url) => {
    setImagePreview({
      visible: true,
      src: url
    });
  };

  const handleImagePreviewClose = () => {
    setImagePreview({
      ...imagePreview,
      visible: false
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBackToList = () => {
    navigate('landlord/post');
  };

  const handleContactOwner = () => {
    // Implement contact functionality
    toast.info('Contact feature will be implemented soon');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        <p>Loading post details...</p>
      </div>
    );
  }

  if (!postDetail) {
    return (
      <div className="error-container">
        <Alert
          message="Post Not Found"
          description="The post you are looking for doesn't exist or has been removed."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={handleGoBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  const { title, description, location, priceShare, status, createdAt, postOwnerInfo, roomInfo } = postDetail;

  return (
    <div className="post-detail-container">
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={handleGoBack}><HomeOutlined /> Post List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Post Details</Breadcrumb.Item>
        </Breadcrumb>
        
        <div className="header-actions">
          <Button 
            type="primary"
            ghost
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack}
            className="back-button"
          >
            Back to List
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="post-header-card">
            <div className="post-status-header">
              <Title level={2}>{title}</Title>
              <Badge 
                status={status === 'Active' ? 'success' : 'error'} 
                text={status} 
                className="post-status-badge"
              />
            </div>
            
            <div className="post-location">
              <EnvironmentOutlined /> <Text>{location}</Text>
            </div>
            
            <div className="post-meta">
              <Space>
                <Text><DollarOutlined /> Share Price: {formatPrice(priceShare)}/month</Text>
                <Text><ClockCircleOutlined /> Posted on: {formatDate(createdAt)}</Text>
              </Space>
            </div>
            
            <Divider />
            
            <Paragraph className="post-description">
              {description}
            </Paragraph>
          </Card>

          <Card title="Room Information" className="room-info-card">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className="room-gallery">
                  <Row gutter={[16, 16]}>
                    {roomInfo.roomImages.map((image, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <div 
                          className="image-container" 
                          onClick={() => handleImageClick(image)}
                        >
                          <img 
                            src={image} 
                            alt={`Room image ${index + 1}`}
                            className="room-image"
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                <Divider />

                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Landlord">
                    {roomInfo.landlordName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Room Number">
                    {roomInfo.roomNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location">
                    {roomInfo.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="Room Type">
                    {roomInfo.roomTypeName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Area">
                    {roomInfo.area}m²
                  </Descriptions.Item>
                  <Descriptions.Item label="Max Occupancy">
                    {roomInfo.totalRoomer} people
                  </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Amenities</Divider>
                <div className="amenities-list">
                  {roomInfo.roomAmenities.map((amenity, index) => (
                    <Tag icon={<CheckCircleOutlined />} color="blue" key={index}>
                      {amenity}
                    </Tag>
                  ))}
                </div>

                <Divider orientation="left">Services</Divider>
                <div className="services-list">
                  {roomInfo.services.map((service) => (
                    <Tag color="green" key={service.serviceId}>
                      {service.serviceName}: {formatPrice(service.price)} ({service.description})
                    </Tag>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="owner-info-card">
            <div className="owner-profile">
              <Avatar 
                src={postOwnerInfo.avatar} 
                size={100}
                icon={<UserOutlined />}
                className="owner-avatar"
              />
              <Title level={3}>{postOwnerInfo.fullName}</Title>
              <div className="owner-tags">
                <Tag color="blue">{postOwnerInfo.postOwnerType}</Tag>
                <Tag color={postOwnerInfo.gender === 'Male' ? 'blue' : 'pink'}>
                  {postOwnerInfo.gender}
                </Tag>
                <Tag color="purple">{postOwnerInfo.age} years old</Tag>
              </div>
            </div>

            <Divider />

            <div className="owner-details">
              <Descriptions column={1}>
                <Descriptions.Item label="Lifestyle">
                  {postOwnerInfo.lifeStyle}
                </Descriptions.Item>
                <Descriptions.Item label="Requirements">
                  {postOwnerInfo.requirement}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider />
            
            <Button 
              type="primary" 
              block 
              size="large"
              onClick={handleContactOwner}
              className="contact-button"
            >
              Contact {postOwnerInfo.fullName}
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        visible={imagePreview.visible}
        footer={null}
        onCancel={handleImagePreviewClose}
        width="80%"
        centered
        className="image-preview-modal"
      >
        <img
          alt="Room preview"
          style={{ width: '100%' }}
          src={imagePreview.src}
        />
      </Modal>
    </div>
  );
};

export default PostDetailCus;