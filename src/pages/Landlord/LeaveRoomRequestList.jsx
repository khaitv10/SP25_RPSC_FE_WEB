import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Space, Tag, Divider, Row, Col, Spin, Button } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, HomeOutlined, CheckOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import landlordAPI from '../../Services/Landlord/landlordAPI';

const { Title, Text } = Typography;

const LeaveRoomRequestList = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRoomRequests();
  }, []);

  const fetchLeaveRoomRequests = async () => {
    try {
      setLoading(true);
      const response = await landlordAPI.getLeaveRoomRequests();
      setRequests(response.leaveRoomRequestList || []);
    } catch (error) {
      toast.error('Failed to fetch leave room requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await landlordAPI.acceptLeaveRoomRequest(requestId);
      if (response.success) {
        toast.success(response.message || 'Leave room request accepted successfully');
        fetchLeaveRoomRequests(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to accept leave room request');
      }
    } catch (error) {
      toast.error('Failed to accept leave room request');
      console.error('Error:', error);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="orange">Pending</Tag>;
      case 1:
        return <Tag color="green">Approved</Tag>;
      case 2:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-6">
        <Title level={2}>Leave Room Requests</Title>
        <Card>
          <div className="text-center py-8">
            <Text type="secondary">No leave room requests found</Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={2}>Leave Room Requests</Title>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.cmoid} className="w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <Avatar 
                  src={request.tenantInfo.avatar} 
                  icon={<UserOutlined />} 
                  size="large"
                />
                <div>
                  <Title level={4}>{request.tenantInfo.fullName}</Title>
                  <Text type="secondary">Request ID: {request.cmoid}</Text>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {getStatusTag(request.status)}
                <Text type="secondary" className="mt-2">
                  {formatDate(request.dateRequest)}
                </Text>
                {request.status === 0 && (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleAcceptRequest(request.cmoid)}
                    className="mt-2"
                  >
                    Accept Request
                  </Button>
                )}
              </div>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Tenant Information" size="small">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <HomeOutlined className="mr-2" />
                      <Text strong>Room: </Text>
                      <Text className="ml-1">{request.tenantInfo.roomNumber}</Text>
                    </div>
                    <div className="flex items-center">
                      <MailOutlined className="mr-2" />
                      <Text strong>Email: </Text>
                      <Text className="ml-1">{request.tenantInfo.email}</Text>
                    </div>
                    <div className="flex items-center">
                      <PhoneOutlined className="mr-2" />
                      <Text strong>Phone: </Text>
                      <Text className="ml-1">{request.tenantInfo.phoneNumber}</Text>
                    </div>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <Text strong>DOB: </Text>
                      <Text className="ml-1">{request.tenantInfo.dob}</Text>
                    </div>
                    <div className="flex items-center">
                      <UserOutlined className="mr-2" />
                      <Text strong>Gender: </Text>
                      <Text className="ml-1">{request.tenantInfo.gender}</Text>
                    </div>
                    <div className="flex items-center">
                      <HomeOutlined className="mr-2" />
                      <Text strong>Location: </Text>
                      <Text className="ml-1">{request.tenantInfo.location}</Text>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Designated Person Information" size="small">
                  <div className="flex items-center mb-4">
                    <Avatar 
                      src={request.designatedInfo.avatar} 
                      icon={<UserOutlined />} 
                      size="large"
                      className="mr-4"
                    />
                    <div>
                      <Title level={5}>{request.designatedInfo.fullName}</Title>
                      <Text type="secondary">ID: {request.designatedInfo.designatedId}</Text>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MailOutlined className="mr-2" />
                      <Text strong>Email: </Text>
                      <Text className="ml-1">{request.designatedInfo.email}</Text>
                    </div>
                    <div className="flex items-center">
                      <PhoneOutlined className="mr-2" />
                      <Text strong>Phone: </Text>
                      <Text className="ml-1">{request.designatedInfo.phoneNumber}</Text>
                    </div>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <Text strong>DOB: </Text>
                      <Text className="ml-1">{request.designatedInfo.dob}</Text>
                    </div>
                    <div className="flex items-center">
                      <UserOutlined className="mr-2" />
                      <Text strong>Gender: </Text>
                      <Text className="ml-1">{request.designatedInfo.gender}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Divider />

            <div className="mt-4">
              <Text strong>Room Description: </Text>
              <Text>{request.tenantInfo.description}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeaveRoomRequestList; 