import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Badge, Button, Row, Col, Modal, List,
  Avatar, Tag, Empty, Spin, Input, Pagination, Space, Drawer, Divider
} from 'antd';
import {
  HomeOutlined, BellOutlined, CalendarOutlined, PhoneOutlined,
  DollarOutlined, SearchOutlined, MailOutlined, UserOutlined,
  CompassOutlined, ProfileOutlined, ClockCircleOutlined,
  CheckOutlined, LoadingOutlined, QuestionCircleOutlined,
  CloseOutlined, FilterOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pic from '../../assets/room.jpg';
import ava from '../../assets/avatar.jpg';
import roomRentalService from "../../Services/Landlord/roomAPI";

const { Title, Text } = Typography;

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
          toast.success(successMessage);
        }
      } catch (error) {
        console.error("Error parsing success notification:", error);
      }
      localStorage.removeItem('approval_success');
    }
  }, [pageIndex, pageSize, searchQuery]);
  
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
      toast.error('Unable to load room data. Please try again later.');
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
        toast.error('Missing required fields');
        return;
      }
  
      const response = await roomRentalService.acceptCustomerRentRoom(
        selectedRequest.roomRentRequestsId, 
        selectedRequest.customerId
      );
  
      if (response?.isSuccess === true) {
        toast.success('Room rental request has been approved successfully.');
        
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
          toast.error('This customer already has an active room stay and cannot be approved for a new room. Please reload this page');
          setTimeout(() => window.location.reload(), 3000);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      
      if (errorMessage.includes("already has an active room stay")) {
        toast.error('This customer already has an active room stay and cannot be approved for a new room. Please reload this page');
        setTimeout(() => window.location.reload(), 3000);
      } else {
        toast.error(errorMessage);
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
      toast.error('Missing room rent request ID');
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
  const clearSearch = () => { 
    setSearchValue(''); 
    setSearchQuery(''); 
    setPageIndex(1); 
    toast.info('Search cleared');
  };

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
    <div className="room-rental-request-list" style={{ padding: '24px 0' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="tab-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div className="left-section">
          <Title level={4} style={{ margin: 0 }}>Room Rental Requests</Title>
          <Text type="secondary">Manage rental requests for your properties</Text>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-container" style={{
        marginBottom: '24px',
        padding: '16px 24px',
        background: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Input
            placeholder="Search by room name or address..."
            prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
            value={searchValue}
            onChange={onSearchChange}
            onPressEnter={() => handleSearch(searchValue)}
            suffix={
              searchValue ? 
              <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer', color: '#999' }} /> : 
              <FilterOutlined style={{ color: '#999' }} />
            }
            style={{ width: '100%', height: '40px', borderRadius: '6px' }}
          />
          <Button 
            type="primary" 
            onClick={() => handleSearch(searchValue)}
            style={{ height: '40px', borderRadius: '6px' }}
          >
            Search
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <p style={{ marginTop: '16px' }}>Loading room data...</p>
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
                    <Space direction="vertical" size="small">
                      <Text strong style={{ fontSize: 16 }}>
                        {searchQuery 
                          ? `No rooms found matching "${searchQuery}"` 
                          : "No rooms with rental requests"
                        }
                      </Text>
                      <Text type="secondary">
                        {searchQuery 
                          ? "Try using different keywords or clear your search" 
                          : "All your rental requests will appear here"
                        }
                      </Text>
                    </Space>
                  } 
                />
              </Col>
            )}
          </Row>
          
          {totalRooms > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px 0 16px' }}>
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
      >
        {selectedRoom && roomRequests[selectedRoom.id] && (
          <List
            itemLayout="horizontal"
            dataSource={roomRequests[selectedRoom.id]}
            renderItem={request => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => showDrawer(request)}
                  >
                    Details
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={request.avatar} size={74} />}
                  title={<Text strong>{request.customerName}</Text>}
                  description={
                    <div>
                      <div><PhoneOutlined /> {request.phone}</div>
                      <div><CalendarOutlined /> Request Date: {formatDate(request.requestDate)}</div>
                      <div><CalendarOutlined /> Want to Rent Date: {formatDate(request.dateWantToRent)}</div>
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
          <div>
            <UserOutlined />
            Room Rental Request Details
          </div>
        }
        placement="right"
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
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
          <Button
            size="large"
            type="primary"
            onClick={showConfirmModal}
            disabled={isLoading}
            icon={isLoading ? <LoadingOutlined /> : <CheckOutlined />}
            block
          >
            Approve
          </Button>
        }
      >
        {selectedRequest && (
          <div>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={selectedRequest.avatar}
                icon={!selectedRequest.avatar && <UserOutlined />}
              />
              <Title level={3} style={{ margin: '16px 0 0' }}>
                {selectedRequest.customerName || selectedRequest.fullName}
              </Title>
            </div>

            <Divider />

            <Title level={4}>Contact Information</Title>
            <div>
              {renderDetailItem(<PhoneOutlined />, 'Phone', selectedRequest.phone || selectedRequest.phoneNumber || 'Not provided')}
              {renderDetailItem(<MailOutlined />, 'Email', selectedRequest.email || 'Not provided')}
              {renderDetailItem(<CalendarOutlined />, 'Status', 
                <Tag color={selectedRequest.status === 'Pending' ? 'orange' :
                  selectedRequest.status === 'Approved' ? 'green' : 'red'}>
                  {selectedRequest.status || 'Pending'}
                </Tag>
              )}
            </div>

            <Divider />

            <Title level={4}>Preferences</Title>
            <div>
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

            <Divider />

            <div>
              <Title level={4}>Message from tenant:</Title>
              <Card>
                {selectedRequest.message || 'No message provided'}
              </Card>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirm Modal */}
      <Modal
        title={
          <div>
            <QuestionCircleOutlined />
            <span>Confirm Approval</span>
          </div>
        }
        open={confirmModalVisible}
        onCancel={hideConfirmModal}
        footer={[
          <Button key="cancel" onClick={hideConfirmModal}>Cancel</Button>,
          <Button
            key="approve"
            type="primary"
            loading={isLoading}
            onClick={handleApprove}
          >
            Confirm
          </Button>,
        ]}
        centered
        maskClosable={false}
      >
        <p>
          Are you sure you want to approve this room rental request from{' '}
          <Text strong>{selectedRequest?.customerName || selectedRequest?.fullName || 'this tenant'}</Text>?
        </p>
        <p>
          Once approved, the tenant will be notified and the room status will be updated.
        </p>
      </Modal>
    </div>
  );
};

export default RoomRentalRequestList;