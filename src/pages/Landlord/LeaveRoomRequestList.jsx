import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Avatar, Tag, Divider, Row, Col, Spin, Button,
  Empty, Pagination, Space, Input, Alert, Badge, message
} from 'antd';
import { 
  UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, 
  HomeOutlined, CheckOutlined, SearchOutlined, LoadingOutlined,
  QuestionCircleOutlined, LogoutOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import landlordAPI from '../../Services/Landlord/landlordAPI';

const { Title, Text } = Typography;
const { Search } = Input;

// Default toast configuration
const showToast = {
  success: (content) => {
    message.success({
      content: content || 'Operation completed successfully',
      duration: 3,
      style: {
        marginTop: '20px',
      },
    });
  },
  error: (content) => {
    message.error({
      content: content || 'An error occurred',
      duration: 5,
      style: {
        marginTop: '20px',
      },
    });
  },
  warning: (content) => {
    message.warning({
      content: content || 'Warning',
      duration: 4,
      style: {
        marginTop: '20px',
      },
    });
  },
  info: (content) => {
    message.info({
      content: content || 'Information',
      duration: 3,
      style: {
        marginTop: '20px',
      },
    });
  }
};

const LeaveRoomRequestList = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLeaveRoomRequests();
  }, [pageIndex, pageSize, searchQuery]);
  
  const fetchLeaveRoomRequests = async () => {
    try {
      setLoading(true);
      // Modify this API call to accept pagination parameters when API supports it
      const response = await landlordAPI.getLeaveRoomRequests(pageIndex, pageSize, searchQuery);
      
      if (response?.leaveRoomRequestList) {
        const requestsList = response.leaveRoomRequestList || [];
        setRequests(requestsList);
        setTotal(response.totalCount || requestsList.length);
      } else {
        setRequests([]);
        setTotal(0);
      }
    } catch (error) {
      showToast.error('Failed to fetch leave room requests');
      console.error('Error:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setProcessing(prev => ({ ...prev, [requestId]: true }));
      
      const response = await landlordAPI.acceptLeaveRoomRequest(requestId);
      
      if (response.success) {
        showToast.success(response.message || 'Leave room request accepted successfully');
        fetchLeaveRoomRequests(); // Refresh the list
      } else {
        showToast.error(response.message || 'Failed to accept leave room request');
      }
    } catch (error) {
      showToast.error('Failed to accept leave room request');
      console.error('Error:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
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
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPageIndex(1);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchQuery('');
    setPageIndex(1);
    showToast.info('Search cleared');
  };

  const handlePageChange = (page, size) => {
    setPageIndex(page);
    setPageSize(size);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
        <p>Loading leave room requests...</p>
      </div>
    );
  }

  return (
    <div className="leave-room-section">
      {/* Search component (uncomment if you need search functionality) */}
      {/* <div className="search-container">
        <Search
          placeholder="Search by name or room number"
          value={searchValue}
          onChange={onSearchChange}
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ marginBottom: '20px' }}
        />
      </div> */}

      {requests.length === 0 ? (
        <Empty 
          description={
            searchQuery 
              ? `No leave room requests found matching "${searchQuery}"` 
              : "No leave room requests found"
          } 
          style={{ margin: '40px 0' }}
        />
      ) : (
        <>
          <Alert
            message="Leave Room Requests"
            description="Review and manage requests from tenants who wish to leave their rooms. Approving a request will begin the checkout process."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            closable
            style={{ marginBottom: '24px', borderRadius: '8px' }}
          />
          
          {requests.map((request) => (
            <Card key={request.cmoid} className="leave-request-card">
              <div className="card-header">
                <div className="tenant-info">
                  <Avatar 
                    src={request.tenantInfo.avatar} 
                    icon={<UserOutlined />} 
                    size={64}
                    className="tenant-avatar"
                  />
                  <div className="tenant-details">
                    <Title level={4}>{request.tenantInfo.fullName}</Title>
                    <Badge status="processing" text={`Request ID: ${request.cmoid}`} />
                  </div>
                </div>
                <div className="request-meta">
                  {getStatusTag(request.status)}
                  <div className="request-date">
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    {formatDate(request.dateRequest)}
                  </div>
                  {request.status === 0 && (
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => handleAcceptRequest(request.cmoid)}
                      loading={processing[request.cmoid]}
                      className="accept-button"
                    >
                      Accept Request
                    </Button>
                  )}
                </div>
              </div>

              <Divider style={{ margin: '0' }} />

              <Row gutter={[16, 16]} className="info-cards">
                <Col xs={24} md={12}>
                  <Card title="Tenant Information" size="small" className="info-card">
                    <div className="info-item">
                      <HomeOutlined className="info-icon" />
                      <Text strong className="info-label">Room:</Text>
                      <Text>{request.tenantInfo.roomNumber}</Text>
                    </div>
                    <div className="info-item">
                      <MailOutlined className="info-icon" />
                      <Text strong className="info-label">Email:</Text>
                      <Text>{request.tenantInfo.email}</Text>
                    </div>
                    <div className="info-item">
                      <PhoneOutlined className="info-icon" />
                      <Text strong className="info-label">Phone:</Text>
                      <Text>{request.tenantInfo.phoneNumber}</Text>
                    </div>
                    <div className="info-item">
                      <CalendarOutlined className="info-icon" />
                      <Text strong className="info-label">DOB:</Text>
                      <Text>{request.tenantInfo.dob}</Text>
                    </div>
                    <div className="info-item">
                      <UserOutlined className="info-icon" />
                      <Text strong className="info-label">Gender:</Text>
                      <Text>{request.tenantInfo.gender}</Text>
                    </div>
                    <div className="info-item">
                      <HomeOutlined className="info-icon" />
                      <Text strong className="info-label">Location:</Text>
                      <Text>{request.tenantInfo.location}</Text>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card title="Designated Person Information" size="small" className="info-card">
                    <div className="designated-header">
                      <Avatar 
                        src={request.designatedInfo.avatar} 
                        icon={<UserOutlined />} 
                        size={64}
                        className="designated-avatar"
                      />
                      <div>
                        <Title level={5} style={{ margin: '0 0 4px' }}>{request.designatedInfo.fullName}</Title>
                        <Text type="secondary">ID: {request.designatedInfo.designatedId}</Text>
                      </div>
                    </div>
                    <div className="info-item">
                      <MailOutlined className="info-icon" />
                      <Text strong className="info-label">Email:</Text>
                      <Text>{request.designatedInfo.email}</Text>
                    </div>
                    <div className="info-item">
                      <PhoneOutlined className="info-icon" />
                      <Text strong className="info-label">Phone:</Text>
                      <Text>{request.designatedInfo.phoneNumber}</Text>
                    </div>
                    <div className="info-item">
                      <CalendarOutlined className="info-icon" />
                      <Text strong className="info-label">DOB:</Text>
                      <Text>{request.designatedInfo.dob}</Text>
                    </div>
                    <div className="info-item">
                      <UserOutlined className="info-icon" />
                      <Text strong className="info-label">Gender:</Text>
                      <Text>{request.designatedInfo.gender}</Text>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div className="room-description">
                <Text strong className="description-title">Room Description:</Text>
                <Text className="description-text">{request.tenantInfo.description || 'No description provided'}</Text>
              </div>
            </Card>
          ))}
          
          {total > pageSize && (
            <div className="pagination-container">
              <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['5', '10', '15', '20']}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} requests`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaveRoomRequestList;