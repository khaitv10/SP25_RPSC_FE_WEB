import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Select, DatePicker, 
  Card, Typography, Spin, Row, Col, Alert, 
  Space, Divider, message
} from 'antd';
import { 
  HomeOutlined, CalendarOutlined, 
  CheckOutlined, LoadingOutlined,
  InfoCircleOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import roomAPI from '../../Services/Room/roomAPI';
import './CreateRoomPost.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateRoomPost = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchRoomsForPost();
  }, []);
  
  const fetchRoomsForPost = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getRoomsForPost();
      if (response.isSuccess) {
        setRooms(response.data);
      } else {
        setError(response.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      setError('Failed to fetch rooms. Please try again later.');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Format the data according to the API requirements
      const postData = {
        roomId: values.roomId,
        title: values.title,
        description: values.description,
        dateExist: values.dateExist,
        availableDateToRent: values.availableDateToRent ? values.availableDateToRent.format('YYYY-MM-DD') : null
      };
      
      const response = await roomAPI.createPostRoom(postData);
      message.success('Post room created successfully');
      navigate('/landlord/post'); // Navigate back to the post list page
    } catch (error) {
      message.error('Failed to create post room');
      console.error('Error creating post room:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/landlord/post'); // Navigate back to the post list page
  };

  const getSelectedRoomInfo = (roomId) => {
    return rooms.find(room => room.roomId === roomId);
  };

  const disabledDate = (current) => {
    // Disable dates before today
    return current && current < moment().startOf('day');
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        <p>Loading available rooms...</p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <Card className="create-post-card">
        <Space direction="horizontal" className="page-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleCancel}
            type="text"
          />
          <Title level={2}>Create Room Post</Title>
        </Space>
        
        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 24 }}
          />
        )}
        
        {rooms.length === 0 ? (
          <Alert
            message="No Available Rooms"
            description="You don't have any available rooms to post. Please create a room first."
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              dateExist: 30, // Default 30 days
            }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="roomId"
                  label="Select Room"
                  rules={[{ required: true, message: 'Please select a room' }]}
                >
                  <Select 
                    placeholder="Select a room" 
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {rooms.map(room => (
                      <Option key={room.roomId} value={room.roomId}>
                        Room {room.roomNumber} - {room.roomTypeName} ({room.location})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues.roomId !== currentValues.roomId
                  }
                >
                  {({ getFieldValue }) => {
                    const selectedRoomId = getFieldValue('roomId');
                    const selectedRoom = selectedRoomId ? getSelectedRoomInfo(selectedRoomId) : null;
                    
                    return selectedRoom ? (
                      <Card size="small" className="selected-room-card">
                        <div className="room-info">
                          <img 
                            src={selectedRoom.firstImageUrl} 
                            alt={`Room ${selectedRoom.roomNumber}`}
                            className="room-thumbnail"
                          />
                          <div className="room-details">
                            <Text strong>Room {selectedRoom.roomNumber}</Text>
                            <Text type="secondary">{selectedRoom.roomTypeName}</Text>
                            <Text type="secondary">
                              <HomeOutlined /> {selectedRoom.location}
                            </Text>
                            <Text 
                              type="success" 
                              strong
                            >
                              <CheckOutlined /> {selectedRoom.status}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="placeholder-card">
                        <InfoCircleOutlined /> Select a room to see details
                      </div>
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>
            
            <Divider />
            
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
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  htmlType="submit"
                  loading={submitting}
                >
                  Create Post
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CreateRoomPost;