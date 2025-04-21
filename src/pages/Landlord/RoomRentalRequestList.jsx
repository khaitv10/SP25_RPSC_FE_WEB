import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Tabs, Badge, Button, Row, Col, Modal, List,
  Avatar, Tag, Empty, Spin, Input, Pagination, Space, Drawer, Divider, notification
} from 'antd';
import {
  HomeOutlined, BellOutlined, CalendarOutlined, PhoneOutlined,
  DollarOutlined, SearchOutlined, MailOutlined, UserOutlined,
  CompassOutlined, ProfileOutlined, ClockCircleOutlined,
  CheckOutlined, LoadingOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import pic from '../../assets/room.jpg';
import ava from '../../assets/avatar.jpg';
import roomRentalService from "../../Services/Landlord/roomAPI";

const { Title, Text } = Typography;
const { Search } = Input;

const RoomRentalRequestList = () => {
  // Core states
  const [rooms, setRooms] = useState([]);
  const [roomRequests, setRoomRequests] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [totalRooms, setTotalRooms] = useState(0);
  
  // UI states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search and pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchRoomRentalRequirements();
    
    // Check for stored notifications
    const successNotification = localStorage.getItem('approval_success');
    if (successNotification) {
      try {
        const { message: successMessage, time } = JSON.parse(successNotification);
        if (new Date().getTime() - time < 5000) {
          showNotification('success', 'Success', successMessage);
        }
      } catch (error) {
        console.error("Error parsing success notification:", error);
      }
      localStorage.removeItem('approval_success');
    }
  }, [pageIndex, pageSize, searchQuery]);

  const showNotification = (type, title, message) => {
    notification[type]({
      message: title,
      description: message,
      placement: 'topRight',
      duration: 4,
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };
  
  const fetchRoomRentalRequirements = async () => {
    try {
      setLoading(true);
      const response = await roomRentalService.getRequiresRoomRental(pageIndex, pageSize, searchQuery);
      
      if (response?.isSuccess && response?.data) {
        const roomsData = response.data.rooms || [];
        const formattedRooms = roomsData.map(room => ({
          id: room.roomId,
          name: room.title || `Room ${room.roomNumber}`,
          roomNumber: room.roomNumber,
          address: room.location || 'Address not updated',
          price: room.price ? `${room.price.toLocaleString()} VNĐ` : 'Contact for price',
          area: room.area ? `${room.area}m²` : 'Not specified',
          square: room.square || room.area ? `${room.square || room.area}m²` : 'Not specified',
          image: room.roomImages?.length > 0 ? room.roomImages[0] : pic,
          requestCount: room.totalRentRequests || 0,
          roomRentRequestsId: room.roomRentRequestsId
        }));

        setRooms(formattedRooms);
        setTotalRooms(response.data.totalRooms || formattedRooms.length);

        // Initialize requests object
        const requestsByRoom = Object.fromEntries(formattedRooms.map(room => [room.id, []]));
        setRoomRequests(requestsByRoom);

        // Fetch customer details for rooms with requests
        await Promise.all(
          formattedRooms
            .filter(room => room.requestCount > 0 && room.roomRentRequestsId)
            .map(room => fetchCustomersByRoomRequest(room.id, room.roomRentRequestsId))
        );
      }
    } catch (error) {
      console.error("Error loading room data:", error);
      showNotification('error', 'Error', 'Unable to load room data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersByRoomRequest = async (roomId, roomRentRequestsId) => {
    try {
      const response = await roomRentalService.getCustomersByRoomRentRequestId(roomRentRequestsId);
      if (response?.isSuccess && response?.data) {
        const customers = response.data.map(customer => ({
          id: customer.requestId || `req-${customer.customerId}`,
          requestId: customer.requestId || `req-${customer.customerId}`,
          customerId: customer.customerId,
          customerName: customer.fullName || 'Customer',
          fullName: customer.fullName || 'Customer',
          phoneNumber: customer.phoneNumber,
          phone: customer.phoneNumber || 'Not provided',
          email: customer.email || 'Not provided',
          requestDate: new Date().toLocaleDateString(),
          dateWantToRent: customer.dateWantToRent || 'Not specified',
          status: customer.status || 'pending',
          message: customer.message || 'No message',
          avatar: customer.avatar || ava,
          preferences: customer.preferences || 'No preferences',
          lifeStyle: customer.lifeStyle || 'Not specified',
          budgetRange: customer.budgetRange || 'Not specified',
          preferredLocation: customer.preferredLocation || 'Not specified',
          requirement: customer.requirement || 'No requirements',
          monthWantRent: customer.monthWantRent
        }));

        setRoomRequests(prev => ({
          ...prev,
          [roomId]: customers
        }));
      }
    } catch (error) {
      console.error(`Error fetching customers for room ${roomId}:`, error);
    }
  };

  const handleApprove = async () => {
    hideConfirmModal();
    setIsLoading(true);
  
    try {
      if (!selectedRequest?.customerId || !selectedRequest?.roomRentRequestsId) {
        showNotification('error', 'Error', 'Missing required fields');
        return;
      }
  
      const response = await roomRentalService.acceptCustomerRentRoom(
        selectedRequest.roomRentRequestsId, 
        selectedRequest.customerId
      );
  
      if (response?.isSuccess === true) {
        showNotification('success', 'Success', 'Room rental request has been approved successfully.');
        
        localStorage.setItem('approval_success', JSON.stringify({
          message: 'Room rental request has been approved successfully.',
          time: new Date().getTime()
        }));
        
        closeDrawer();
        handleCancel();
        fetchRoomRentalRequirements();
      } else {
        const errorMessage = response?.message || "Unable to approve room rental request";
        
        if (errorMessage.includes("already has an active room stay") || 
          (response?.data?.errorType === "ActiveRoomExistsError")) {
          showNotification('error', 'Error', 'This customer already has an active room stay and cannot be approved for a new room. Please reload this page');
          setTimeout(() => window.location.reload(), 3000);
        } else {
          showNotification('error', 'Error', errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      
      if (errorMessage.includes("already has an active room stay")) {
        showNotification('error', 'Error', 'This customer already has an active room stay and cannot be approved for a new room. Please reload this page');
        setTimeout(() => window.location.reload(), 3000);
      } else {
        showNotification('error', 'Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // UI handlers
  const showModal = (room) => { setSelectedRoom(room); setIsModalVisible(true); };
  const handleCancel = () => setIsModalVisible(false);
  const showDrawer = (request) => {
    if (!selectedRoom?.roomRentRequestsId) {
      showNotification('error', 'Error', 'Missing room rent request ID');
      return;
    }
    setSelectedRequest({ ...request, roomRentRequestsId: String(selectedRoom.roomRentRequestsId) });
    setDrawerVisible(true);
  };
  const closeDrawer = () => setDrawerVisible(false);
  const showConfirmModal = () => setConfirmModalVisible(true);
  const hideConfirmModal = () => setConfirmModalVisible(false);
  const handlePageChange = (page, size) => { setPageIndex(page); setPageSize(size); };
  const handleSearch = (value) => { setSearchQuery(value); setPageIndex(1); };
  const onSearchChange = (e) => setSearchValue(e.target.value);
  const clearSearch = () => { setSearchValue(''); setSearchQuery(''); setPageIndex(1); };

  const renderRoomCard = (room) => (
    <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
      <Card className="room-card">
        <div className="room-image">
          <img src={room.image} alt={room.name} />
          <Badge count={room.requestCount} className="request-count-badge" />
        </div>
        <div className="room-info">
          <Title level={4}>{room.name}</Title>
          <div className="room-details">
            <div className="detail-item">
              <HomeOutlined className="detail-icon" />
              <Text>{room.address}</Text>
            </div>
            <div className="detail-item">
              <DollarOutlined className="detail-icon" style={{ color: '#dbc202' }} />
              <Text>{room.price} / Month</Text>
            </div>
            <div className="detail-item">
              <CompassOutlined className="detail-icon" style={{ color: '#4a90e2' }} />
              <Text>{room.square}</Text>
            </div>
          </div>
          <Button
            type="primary"
            block
            className="view-requests-btn"
            onClick={() => showModal(room)}
            disabled={room.requestCount === 0}
          >
            View Requests
          </Button>
        </div>
      </Card>
    </Col>
  );

  const renderDetailItem = (icon, label, value, styles = {}) => (
    <div className="detail-row" style={{
      display: 'flex',
      alignItems: 'center',
      margin: '16px 0',
      padding: '12px 16px',
      backgroundColor: '#f9fafc',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      ...styles
    }}>
      <Text strong style={{ fontSize: '16px', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="icon-wrapper">{icon}</span> {label}:
      </Text>
      <Text style={{ fontSize: '16px', maxWidth: '60%', textAlign: 'right' }}>{value}</Text>
    </div>
  );

  return (
    <div className="room-rental-request-list">
      <div className="search-container">
        <Space>
          <Search
            placeholder="Search by room name or address"
            allowClear
            enterButton={<Button type="primary"><SearchOutlined /></Button>}
            size="large"
            value={searchValue}
            onChange={onSearchChange}
            onSearch={handleSearch}
            style={{ width: 320 }}
          />
          {searchQuery && <Button onClick={clearSearch}>Clear</Button>}
        </Space>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <p>Loading room data...</p>
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="room-grid">
            {rooms.length > 0 ? (
              rooms.map(renderRoomCard)
            ) : (
              <Col span={24}>
                <Empty 
                  description={
                    searchQuery 
                      ? `No rooms found matching "${searchQuery}"` 
                      : "No rooms with rental requests"
                  } 
                />
              </Col>
            )}
          </Row>
          
          {totalRooms > 0 && (
            <div className="pagination-container">
              <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={totalRooms}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={['4', '8', '12', '16']}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} rooms`}
              />
            </div>
          )}
        </>
      )}

      {/* Requests Modal */}
      <Modal
        title={
          <div className="modal-title">
            <HomeOutlined className="modal-icon" />
            {selectedRoom ? `Room Rental Requests - ${selectedRoom.name}` : ''}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        className="requests-modal"
      >
        {selectedRoom && roomRequests[selectedRoom.id] && (
          <List
            className="request-list"
            itemLayout="horizontal"
            dataSource={roomRequests[selectedRoom.id]}
            renderItem={request => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => showDrawer(request)}
                    className="details-button"
                  >
                    Details
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={request.avatar} size={74} />}
                  title={<Text strong>{request.customerName}</Text>}
                  description={
                    <div className="request-brief">
                      <div><PhoneOutlined className="detail-icon" /> {request.phone}</div>
                      <div><CalendarOutlined className="detail-icon" /> Request Date: {formatDate(request.requestDate)}</div>
                      <div><CalendarOutlined className="detail-icon" /> Want to Rent Date: {formatDate(request.dateWantToRent)}</div>
                    </div>
                  }
                />
                <Tag color={
                  request.status === 'Pending' ? 'green' : 
                  request.status === 'Rejected' ? 'red' : 'blue'
                }>
                  {request.status}
                </Tag>
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* Request Details Drawer */}
      <Drawer
        title={
          <div className="drawer-title">
            <UserOutlined className="drawer-icon" />
            Room Rental Request Details
          </div>
        }
        placement="right"
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
        className="request-details-drawer"
        styles={{
          header: { 
            fontSize: '24px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%)', 
            padding: '20px',
            borderBottom: '1px solid #e6f0fa'
          },
          body: { padding: '24px' }
        }}
        footer={
          <div className="drawer-footer">
            <Button size="large" onClick={closeDrawer} disabled={isLoading}
              className="cancel-button">
              Close
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={showConfirmModal}
              disabled={isLoading}
              className="approve-button"
              icon={isLoading ? <LoadingOutlined /> : <CheckOutlined />}
            >
              Approve
            </Button>
          </div>
        }
      >
        {selectedRequest && (
          <div className="request-details">
            <div className="customer-avatar">
              <Avatar
                size={120}
                src={selectedRequest.avatar}
                icon={!selectedRequest.avatar && <UserOutlined />}
                className="profile-avatar"
              />
              <Title level={3} style={{ margin: '16px 0 0' }}>
                {selectedRequest.customerName || selectedRequest.fullName}
              </Title>
            </div>

            <Divider className="section-divider" />

            <Title level={4} className="section-title">Contact Information</Title>
            <div className="detail-section">
              {renderDetailItem(<PhoneOutlined />, 'Phone', selectedRequest.phone || selectedRequest.phoneNumber || 'Not provided')}
              {renderDetailItem(<MailOutlined />, 'Email', selectedRequest.email || 'Not provided')}
              {renderDetailItem(<CalendarOutlined />, 'Status', 
                <Tag color={selectedRequest.status === 'Pending' ? 'orange' :
                  selectedRequest.status === 'Approved' ? 'green' : 'red'} 
                  className="status-tag">
                  {selectedRequest.status || 'Pending'}
                </Tag>
              )}
            </div>

            <Divider className="section-divider" />

            <Title level={4} className="section-title">Preferences</Title>
            <div className="detail-section">
              {selectedRequest.preferences && renderDetailItem(
                <ProfileOutlined />, 'Preferences', selectedRequest.preferences
              )}
              {selectedRequest.lifeStyle && renderDetailItem(
                <UserOutlined />, 'Lifestyle', selectedRequest.lifeStyle
              )}
              {selectedRequest.budgetRange && renderDetailItem(
                <DollarOutlined />, 'Budget', `${selectedRequest.budgetRange} VNĐ`
              )}
              {selectedRequest.preferredLocation && renderDetailItem(
                <CompassOutlined />, 'Preferred Location', selectedRequest.preferredLocation
              )}
              {selectedRequest.requirement && renderDetailItem(
                <HomeOutlined />, 'Requirements', selectedRequest.requirement
              )}
              {renderDetailItem(
                <ClockCircleOutlined />, 'Rental Duration',
                (selectedRequest.monthWantRent !== undefined && selectedRequest.monthWantRent !== null)
                  ? `${selectedRequest.monthWantRent} ${Number(selectedRequest.monthWantRent) === 1 ? 'month' : 'months'}`
                  : '6 months'
              )}
            </div>

            <Divider className="section-divider" />

            <div className="message-section">
              <Title level={4} className="section-title">Message from tenant:</Title>
              <Card
                className="message-card"
              >
                {selectedRequest.message || 'No message provided'}
              </Card>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirm Modal */}
      <Modal
        title={
          <div className="confirm-modal-title">
            <QuestionCircleOutlined className="confirm-icon" />
            <span>Confirm Approval</span>
          </div>
        }
        open={confirmModalVisible}
        onCancel={hideConfirmModal}
        footer={[
          <Button key="cancel" onClick={hideConfirmModal} className="cancel-button">Cancel</Button>,
          <Button
            key="approve"
            type="primary"
            loading={isLoading}
            onClick={handleApprove}
            className="confirm-button"
          >
            Confirm
          </Button>,
        ]}
        centered
        maskClosable={false}
        className="confirm-modal"
      >
        <p className="confirm-message">
          Are you sure you want to approve this room rental request from{' '}
          <Text strong>{selectedRequest?.customerName || selectedRequest?.fullName || 'this tenant'}</Text>?
        </p>
        <p className="confirm-note">
          Once approved, the tenant will be notified and the room status will be updated.
        </p>
      </Modal>
    </div>
  );
};

export default RoomRentalRequestList;