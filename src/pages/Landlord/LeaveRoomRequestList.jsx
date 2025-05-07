import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Avatar, Tag, Divider, Row, Col, Spin, Button,
  Empty, Pagination, Space, Input, Alert, Badge, message, Modal
} from 'antd';
import { 
  UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, 
  HomeOutlined, CheckOutlined, SearchOutlined, LoadingOutlined,
  QuestionCircleOutlined, LogoutOutlined, InfoCircleOutlined, EyeOutlined
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
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

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

  const handleViewDetail = async (cmoid) => {
    setDetailModalVisible(true);
    setDetailLoading(true);
    try {
      const res = await landlordAPI.getLeaveRoomRequestDetail(cmoid);
      setDetailData(res.detailTenantMoveOutRes);
    } catch (err) {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
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
            <Card
              key={request.cmoid}
              style={{
                marginBottom: 24,
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: 0,
                background: '#fff',
                border: 'none',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: 24, borderBottom: '1px solid #f0f0f0' }}>
                <Avatar src={request.tenantInfo.avatar} size={64} style={{ marginRight: 20 }} />
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ margin: 0 }}>{request.tenantInfo.fullName}</Title>
                  <div style={{ color: '#888', marginTop: 4 }}>
                    <MailOutlined style={{ marginRight: 6 }} />
                    {request.tenantInfo.email}
                    <span style={{ margin: '0 12px' }}>|</span>
                    <HomeOutlined style={{ marginRight: 6 }} />
                    Room {request.tenantInfo.roomNumber}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {getStatusTag(request.status)}
                  <div style={{ color: '#888', marginTop: 4 }}>
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    {formatDate(request.dateRequest)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                    {request.status === 0 && (
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleAcceptRequest(request.cmoid)}
                        loading={processing[request.cmoid]}
                      >
                        Accept
                      </Button>
                    )}
                    <Button
                      type="link"
                      icon={<EyeOutlined style={{ color: '#1890ff', fontSize: 18 }} />}
                      style={{ padding: 0 }}
                      onClick={() => handleViewDetail(request.cmoid)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ padding: 24 }}>
                <Row gutter={24}>
                  <Col xs={24} md={request.designatedInfo && Object.keys(request.designatedInfo).length > 0 ? 12 : 24}>
                    <div style={{ marginBottom: 16 }}>
                      <Text strong style={{ fontSize: 16 }}>
                        <UserOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        Tenant Information
                      </Text>
                    </div>
                    <div style={{ background: '#f7f9fa', borderRadius: 8, padding: 16 }}>
                      <div style={{ marginBottom: 8 }}><HomeOutlined style={{ color: '#1890ff', marginRight: 8 }} />Room: {request.tenantInfo.roomNumber}</div>
                      <div style={{ marginBottom: 8 }}><MailOutlined style={{ color: '#1890ff', marginRight: 8 }} />Email: {request.tenantInfo.email}</div>
                      <div><CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />Date of Birth: {request.tenantInfo.dob}</div>
                    </div>
                  </Col>
                  {request.designatedInfo && Object.keys(request.designatedInfo).length > 0 && (
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: 16 }}>
                          <UserOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                          Designated Person Information
                        </Text>
                      </div>
                      <div style={{ background: '#f7f9fa', borderRadius: 8, padding: 16, display: 'flex', alignItems: 'center' }}>
                        <Avatar src={request.designatedInfo.avatar} size={48} style={{ marginRight: 16 }} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{request.designatedInfo.fullName}</div>
                          <div style={{ color: '#888', fontSize: 13 }}>ID: {request.designatedInfo.designatedId}</div>
                          <div><MailOutlined style={{ color: '#1890ff', marginRight: 8 }} />{request.designatedInfo.email}</div>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
                <Divider style={{ margin: '24px 0' }} />
                <div style={{ color: '#888', fontSize: 14, display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                  Request Date: {formatDate(request.dateRequest)}
                </div>
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

      {/* Modal hiển thị chi tiết leave room request */}
      <Modal
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        title="Leave Room Request Detail"
        width={600}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin size="large" />
          </div>
        ) : detailData ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <b>Tenant:</b> {detailData.detailTenantInfo.fullName} <br />
              <b>Email:</b> {detailData.detailTenantInfo.email} <br />
              <b>Room:</b> {detailData.detailTenantInfo.roomNumber}
            </div>
            {detailData.detailDesignatedInfo && (
              <div style={{ marginBottom: 16 }}>
                <b>Designated Person:</b> {detailData.detailDesignatedInfo.fullName} <br />
                <b>Email:</b> {detailData.detailDesignatedInfo.email}
              </div>
            )}
            <div>
              <b>Request Date:</b> {formatDate(detailData.dateRequest)}
            </div>
          </div>
        ) : (
          <div style={{ color: 'red', textAlign: 'center' }}>No detail found.</div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveRoomRequestList;