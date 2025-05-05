import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Spin, Typography, Card, Row, Col, Divider, Tag, Space,
  Descriptions, Image, Button, Carousel, Statistic, Badge, 
  List, Avatar, Breadcrumb, Alert, Modal, Rate, Form, Input,
  DatePicker, message, Select
} from 'antd';
import {
  HomeOutlined, DollarOutlined, CalendarOutlined, 
  UserOutlined, EnvironmentOutlined, InfoCircleOutlined, 
  ArrowLeftOutlined, LoadingOutlined, CheckCircleOutlined,
  PhoneOutlined, MailOutlined, BankOutlined, AppstoreOutlined,
  HeartOutlined, ShareAltOutlined, StarFilled, EditOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import roomAPI from '../../Services/Room/roomAPI';
import moment from 'moment';
import './PostDetail.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [updating, setUpdating] = useState(false);

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

  const showUpdateModal = () => {
    // Populate the form with current values
    updateForm.setFieldsValue({
      title: roomDetail.title,
      description: roomDetail.description,
      dateExist: roomDetail.dateExist || 30, // Default to 30 if not available
      availableDateToRent: roomDetail.availableDateToRent ? moment(roomDetail.availableDateToRent) : null
    });
    setUpdateModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      
      const updateData = {
        title: values.title,
        description: values.description,
        dateExist: values.dateExist,
        availableDateToRent: values.availableDateToRent ? values.availableDateToRent.format('YYYY-MM-DD') : null
      };
      
      // Use postRoomId from the roomDetail instead of roomId from URL params
      const postRoomId = roomDetail.postRoomId;
      console.log('Updating room with postRoomId:', postRoomId, 'Data:', updateData);
      
      const response = await roomAPI.updatePostRoom(postRoomId, updateData);
      
      if (response && response.isSuccess) {
        message.success('Room updated successfully');
        setUpdateModalVisible(false);
        // Refresh room details
        fetchRoomDetail();
      } else {
        message.error('Failed to update room: ' + (response?.message || 'Unknown error'));
      }
    } catch (error) {
      message.error('Failed to update room: ' + (error.message || 'Unknown error'));
      console.error('Error updating room:', error);
    } finally {
      setUpdating(false);
    }
  };

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current < moment().startOf('day');
  };

  const handleCancelUpdate = () => {
    setUpdateModalVisible(false);
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
          <Space>
            <Button 
              type="primary"
              icon={<EditOutlined />}
              onClick={showUpdateModal}
            >
              Update Post Room
            </Button>
            <Button 
              type="primary"
              ghost
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToList}
              className="back-button"
            >
              Back to List
            </Button>
          </Space>
        </div>
      </div>

      <Card className="room-detail-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="room-header">
              <div className="room-title-section">

                  <Title level={2}>{roomDetail.title}</Title>
                
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
                <Descriptions.Item label="Listing Duration">
                  {roomDetail.dateExist || 30} days
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

      {/* Image Preview Modal */}
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

      {/* Update Room Modal - Reformatted to match CreateRoomPost */}
      <Modal
        title="Update Room Details"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
        width={700}
        className="update-room-modal"
      >
        <Card className="update-post-card">
          <Space direction="horizontal" className="modal-header">
            <Title level={4}>Update Room Post</Title>
          </Space>
          
          <Form
            form={updateForm}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item
              name="title"
              label="Post Title"
              rules={[
                { required: true, message: 'Please enter a title' },
                { max: 100, message: 'Title cannot exceed 100 characters' }
              ]}
            >
              <Input 
                placeholder="Enter an attractive title for your post" 
                size="large"
                showCount
                maxLength={100}
              />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please enter a description' },
                { min: 50, message: 'Description should be at least 50 characters' }
              ]}
            >
              <TextArea 
                placeholder="Describe your room in detail (features, neighborhood, transportation, etc.)" 
                rows={6}
                showCount
                maxLength={2000}
              />
            </Form.Item>
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="dateExist"
                  label="Post Duration (days)"
                  rules={[
                    { required: true, message: 'Please specify post duration' },
                    { type: 'number', min: 1, max: 365, message: 'Duration must be between 1 and 365 days' }
                  ]}
                >
                  <Select size="large">
                    <Option value={7}>7 days</Option>
                    <Option value={15}>15 days</Option>
                    <Option value={30}>30 days</Option>
                    <Option value={60}>60 days</Option>
                    <Option value={90}>90 days</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="availableDateToRent"
                  label="Available Date to Rent"
                  rules={[
                    { required: false, message: 'Please select available date (optional)' }
                  ]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    size="large"
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    placeholder="When is the room available for rent?"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider />
            
            <Form.Item className="form-actions">
              <Space size="middle">
                <Button 
                  type="default" 
                  size="large" 
                  onClick={handleCancelUpdate}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  htmlType="submit"
                  loading={updating}
                >
                  Update Post
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default PostRoomDetail;
