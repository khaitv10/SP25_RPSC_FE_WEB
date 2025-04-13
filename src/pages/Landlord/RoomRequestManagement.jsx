import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Tabs,
    Badge,
    Button,
    Row,
    Col,
    Modal,
    List,
    Avatar,
    Tag,
    Empty,
    //message,
    //notification,
    Spin,
    Input,
    Pagination,
    Space,
    Drawer,
    Divider
} from 'antd';
import {
    HomeOutlined,
    BellOutlined,
    CalendarOutlined,
    PhoneOutlined,
    DollarOutlined,
    SearchOutlined,
    MailOutlined,
    UserOutlined,
    TeamOutlined,
    CompassOutlined,
    ProfileOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    LoadingOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './RoomRequestManagement.scss';
import pic from '../../assets/room.jpg';
import ava from '../../assets/avatar.jpg';
import roomRentalService from "../../Services/Landlord/roomAPI";
import PropTypes from 'prop-types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const RoomRequestManagement = () => {
    // Room listing and modal states
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('hasRequests');

    // Drawer states
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    // Pagination and search states
    const [rooms, setRooms] = useState([]);
    const [roomRequests, setRoomRequests] = useState({});
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalRooms, setTotalRooms] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    // Toast notification function
    const showToast = (type, message) => {
        switch(type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast.info(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            default:
                toast(message);
        }
    };

    useEffect(() => {
        fetchRoomRentalRequirements();
        
        // Display a simple welcome notification when component mounts
        //showToast('info', 'Welcome to Room Request Management');
        
        // Check for stored notifications
        const successNotification = localStorage.getItem('approval_success');
        if (successNotification) {
            try {
                const { message: successMessage, time } = JSON.parse(successNotification);
                const currentTime = new Date().getTime();
                if (currentTime - time < 5000) {
                    showToast('success', successMessage);
                }
            } catch (error) {
                console.error("Error parsing success notification:", error);
            }
            localStorage.removeItem('approval_success');
        }
    }, [pageIndex, pageSize, searchQuery]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    
    const fetchRoomRentalRequirements = async () => {
        try {
            setLoading(true);
            const response = await roomRentalService.getRequiresRoomRental(pageIndex, pageSize, searchQuery);
            if (response && response.isSuccess && response.data) {
                const roomsData = response.data.rooms || [];
                const formattedRooms = roomsData.map(room => ({
                    id: room.roomId,
                    name: room.title || `Room ${room.roomNumber}`,
                    roomNumber: room.roomNumber,
                    address: room.location || 'Address not updated',
                    price: room.price ? `${room.price.toLocaleString()} VNĐ` : 'Contact for price',
                    area: room.area ? `${room.area}m²` : 'Not specified',
                    square: room.square ? `${room.square}m²` : (room.area ? `${room.area}m²` : 'Not specified'),
                    image: room.roomImages && room.roomImages.length > 0 ? room.roomImages[0] : pic,
                    requestCount: room.totalRentRequests || 0,
                    roomRentRequestsId: room.roomRentRequestsId
                }));

                setRooms(formattedRooms);
                setTotalRooms(response.data.totalRooms || formattedRooms.length);

                const requestsByRoom = {};
                formattedRooms.forEach(room => {
                    requestsByRoom[room.id] = [];
                });
                setRoomRequests(requestsByRoom);

                // For rooms with requests, fetch the customer details
                for (const room of formattedRooms) {
                    if (room.requestCount > 0 && room.roomRentRequestsId) {
                        await fetchCustomersByRoomRequest(room.id, room.roomRentRequestsId);
                    }
                }
                
                // Show success notification
                //showToast('success', 'Room data loaded successfully');
            }
        } catch (error) {
            console.error("Error loading room data:", error);
            showToast('error', 'Unable to load room data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomersByRoomRequest = async (roomId, roomRentRequestsId) => {
        try {
            const response = await roomRentalService.getCustomersByRoomRentRequestId(roomRentRequestsId);
            if (response && response.isSuccess && response.data) {
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
                    preferredMoveInDate: 'Not specified',
                    dateWantToRent: customer.dateWantToRent || 'Not specified', 
                    numTenants: 1,
                    occupation: 'Not specified',
                    idCard: 'Not provided',
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
            showToast('error', `Unable to load customer requests for room ${roomId}`);
        }
    };

    // Room Modal Functions
    const showModal = (room) => {
        setSelectedRoom(room);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Drawer Functions
    const showDrawer = (request) => {
        const roomRentRequestsId = selectedRoom?.roomRentRequestsId;

        if (!roomRentRequestsId) {
            showToast('error', 'Missing room rent request ID. Cannot proceed.');
            return;
        }

        const requestWithRoomId = {
            ...request,
            roomRentRequestsId: String(roomRentRequestsId)
        };

        setSelectedRequest(requestWithRoomId);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    // Approval Functions
    const showConfirmModal = () => {
        setConfirmModalVisible(true);
    };

    const hideConfirmModal = () => {
        setConfirmModalVisible(false);
    };

    const handleApprove = async () => {
        hideConfirmModal();
        setIsLoading(true);
    
        try {
            if (!selectedRequest) {
                showToast('error', 'No request data available');
                setIsLoading(false);
                return;
            }
    
            const customerId = selectedRequest.customerId;
            const roomRentRequestsId = selectedRequest.roomRentRequestsId;
    
            if (!customerId || !roomRentRequestsId) {
                showToast('error', 'Missing required fields');
                setIsLoading(false);
                return;
            }
    
            const response = await roomRentalService.acceptCustomerRentRoom(roomRentRequestsId, customerId);
            console.log("API Response:", response);
    
            // Check response isSuccess flag to determine if the request was successful
            if (response && response.isSuccess === true) {
                // Replace alert with toast notification
                showToast('success', 'Room rental request has been approved successfully.');
            
                localStorage.setItem('approval_success', JSON.stringify({
                    message: 'Room rental request has been approved successfully.',
                    time: new Date().getTime()
                }));
            
                closeDrawer();
                handleCancel();
                fetchRoomRentalRequirements();
            } else {
                const errorMessage = response?.message || "Unable to approve room rental request";
                
                // Check if the error is about an active room stay
                if (errorMessage.includes("already has an active room stay") || 
                    (response?.data?.errorType === "ActiveRoomExistsError")) {
                    showToast('error', 'This customer already has an active room stay and cannot be approved for a new room. Please reload this page');
                    
                    // Add a small delay before reloading to ensure the toast is visible
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    // Show generic error message as toast
                    showToast('error', errorMessage);
                }
            }
            
        } catch (error) {
            console.error("Error approving room rental request:", error);
            
            // Extract error message from error response if available
            let errorMessage = "An error occurred. Please try again later.";
            
            if (error.response?.data) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Check if the error is about an active room stay
            if (errorMessage.includes("already has an active room stay")) {
                showToast('error', 'This customer already has an active room stay and cannot be approved for a new room. Please reload this page');
                
                // Add a small delay before reloading to ensure the toast is visible
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                // Show error message as toast
                showToast('error', errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };



    // Pagination change handler
    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    // Search handler
    const handleSearch = (value) => {
        setSearchQuery(value);
        setPageIndex(1); // Reset to first page when searching
    };

    // Function to handle pressing Enter in the search input
    const onSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Reset search
    const clearSearch = () => {
        setSearchValue('');
        setSearchQuery('');
        setPageIndex(1);
    };

    return (
        <div className="room-request-management">
            {/* Add ToastContainer for react-toastify */}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="room-request-header">
                <Title level={2}>
                    <BellOutlined className="title-icon" /> Requires Room Rental
                </Title>
                
                {/* Search bar */}
                <div className="search-container" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <Search
                            placeholder="Search by room name or address"
                            allowClear
                            enterButton={<Button type="primary"><SearchOutlined /></Button>}
                            size="large"
                            value={searchValue}
                            onChange={onSearchChange}
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                        />
                        {searchQuery && (
                            <Button onClick={clearSearch}>Clear</Button>
                        )}
                    </Space>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="request-tabs"
            >
                <TabPane
                    tab={
                        <Badge count={totalRooms} offset={[10, 0]} className="tab-badge">
                            <span>Rooms with Requests</span>
                        </Badge>
                    }
                    key="hasRequests"
                >
                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                            <p>Loading room data...</p>
                        </div>
                    ) : (
                        <>
                            <Row gutter={[16, 16]} className="room-grid">
                                {rooms.length > 0 ? (
                                    rooms.map(room => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                                            <Card className="room-card" bodyStyle={{ padding: "16px" }}>
                                                <div className="room-image">
                                                    <img src={room.image} alt={room.name} />
                                                    <Badge
                                                        count={room.requestCount}
                                                        className="request-count-badge"
                                                    />
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
                                                            <Text>Square: {room.square}</Text>
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
                                    ))
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
                            
                            {/* Pagination */}
                            {totalRooms > 0 && (
                                <div className="pagination-container" style={{ marginTop: '24px', textAlign: 'center' }}>
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
                </TabPane>
            </Tabs>

            {/* Requests Modal */}
            <Modal
                title={selectedRoom ? `Room Rental Requests - ${selectedRoom.name}` : ''}
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
                                        style={{ background: '#262926' }}
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
                                            <div style={{ color: '#000970' }}><PhoneOutlined className="detail-icon" /> {request.phone}</div>
                                            <div><CalendarOutlined className="detail-icon" /> Request Date: {formatDate(request.requestDate)}</div>
                                            <div><CalendarOutlined className="detail-icon" /> Want to Rent Date: {formatDate(request.dateWantToRent)}</div>
                                        </div>
                                    }
                                />
                                <Tag color={request.status === 'Pending' ? 'green' : (request.status === 'Rejected' ? 'red' : 'blue')}>
                                    {request.status}
                                </Tag>
                            </List.Item>
                        )}
                    />
                )}
            </Modal>

            {/* Request Details Drawer */}
            <Drawer
                title="Room Rental Request Details"
                placement="right"
                width={600}
                onClose={closeDrawer}
                open={drawerVisible}
                className="request-details-drawer"
                styles={{
                    header: {
                        fontSize: '24px',
                        fontWeight: 'bold',
                        backgroundColor: '#f0f7ff',
                        padding: '20px'
                    },
                    body: {
                        padding: '24px'
                    }
                }}
                footer={
                    <div
                        className="drawer-footer"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            padding: '16px 0',
                            borderTop: '1px solid #f0f0f0'
                        }}
                    >
                        <Button
                            size="large"
                            onClick={closeDrawer}
                            disabled={isLoading}
                            style={{
                                borderRadius: '6px',
                                fontWeight: 500,
                                boxShadow: '0 2px 0 rgba(0,0,0,0.02)'
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            size="large"
                            type="primary"
                            onClick={showConfirmModal}
                            disabled={isLoading}
                            style={{
                                background: '#01d837',
                                borderColor: '#01d837',
                                borderRadius: '6px',
                                fontWeight: 500,
                                boxShadow: '0 2px 0 rgba(1,216,55,0.1)',
                                minWidth: '120px'
                            }}
                            icon={isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                        >
                            Approve
                        </Button>
                    </div>
                }
            >
                {selectedRequest && (
                    <div className="request-details">
                        <div className="customer-avatar" style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Avatar
                                size={120}
                                src={selectedRequest.avatar}
                                icon={!selectedRequest.avatar && <UserOutlined />}
                                style={{ border: '4px solid #01d837', marginBottom: '16px' }}
                            />
                            <Title level={3} style={{ margin: 0 }}>{selectedRequest.customerName || selectedRequest.fullName}</Title>
                        </div>

                        <Divider style={{ margin: '24px 0' }} />

                        <Title level={4}>Contact Information</Title>
                        <div className="detail-section" style={{ fontSize: '16px' }}>
                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><PhoneOutlined /> Phone:</Text>
                                <Text style={{ fontSize: '16px' }}>{selectedRequest.phone || selectedRequest.phoneNumber || 'Not provided'}</Text>
                            </div>

                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><MailOutlined /> Email:</Text>
                                <Text style={{ fontSize: '16px' }}>{selectedRequest.email || 'Not provided'}</Text>
                            </div>

                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><CalendarOutlined /> Status:</Text>
                                <Text style={{
                                    fontSize: '16px',
                                    color: selectedRequest.status === 'Pending' ? '#fa8c16' :
                                        selectedRequest.status === 'Approved' ? '#52c41a' : '#f5222d'
                                }}>
                                    {selectedRequest.status || 'Undefined'}
                                </Text>
                            </div>
                        </div>

                        <Divider style={{ margin: '24px 0' }} />

                        <Title level={4}>Preferences</Title>
                        <div className="detail-section" style={{ fontSize: '16px' }}>
                            {selectedRequest.preferences && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><ProfileOutlined /> Preferences:</Text>
                                    <Text style={{ fontSize: '16px', maxWidth: '60%', textAlign: 'right' }}>{selectedRequest.preferences}</Text>
                                </div>
                            )}

                            {selectedRequest.lifeStyle && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><UserOutlined /> Lifestyle:</Text>
                                    <Text style={{ fontSize: '16px' }}>{selectedRequest.lifeStyle}</Text>
                                </div>
                            )}

                            {selectedRequest.budgetRange && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><DollarOutlined /> Budget:</Text>
                                    <Text style={{ fontSize: '16px' }}>{selectedRequest.budgetRange} VNĐ</Text>
                                </div>
                            )}

                            {selectedRequest.preferredLocation && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><CompassOutlined /> Preferred Location:</Text>
                                    <Text style={{ fontSize: '16px' }}>{selectedRequest.preferredLocation}</Text>
                                </div>
                            )}

                            {selectedRequest.requirement && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><HomeOutlined /> Requirements:</Text>
                                    <Text style={{ fontSize: '16px', maxWidth: '60%', textAlign: 'right' }}>{selectedRequest.requirement}</Text>
                                </div>
                            )}

                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><ClockCircleOutlined /> Rental Duration:</Text>
                                <Text style={{ fontSize: '16px' }}>
                                    {(selectedRequest.monthWantRent !== undefined && selectedRequest.monthWantRent !== null)
                                        ? `${selectedRequest.monthWantRent} ${Number(selectedRequest.monthWantRent) === 1 ? 'month' : 'months'}`
                                        : '6 months'}
                                </Text>
                            </div>
                        </div>

                        <Divider style={{ margin: '24px 0' }} />

                        <div className="message-section">
                            <Title level={4} style={{ marginBottom: '16px' }}>Message from tenant:</Title>
                            <Card
                                className="message-card"
                                style={{
                                    fontSize: '16px',
                                    padding: '8px',
                                    backgroundColor: '#f6ffed',
                                    border: '1px solid #b7eb8f',
                                    borderRadius: '8px'
                                }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <QuestionCircleOutlined style={{ color: '#1890ff', fontSize: '22px' }} />
                        <span>Confirm Approval</span>
                    </div>
                }
                open={confirmModalVisible}
                onCancel={hideConfirmModal}
                footer={[
                    <Button key="cancel" onClick={hideConfirmModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        loading={isLoading}
                        onClick={handleApprove}
                        style={{
                            background: '#01d837',
                            borderColor: '#01d837'
                        }}
                    >
                        Confirm
                    </Button>,
                ]}
                centered
                maskClosable={false}
            >
                <p style={{ fontSize: '16px', marginBottom: '0' }}>
                    Are you sure you want to approve this room rental request from{' '}
                    <Text strong>{selectedRequest?.customerName || selectedRequest?.fullName || 'this tenant'}</Text>?
                </p>
                <p style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '12px' }}>
                    Once approved, the tenant will be notified and the room status will be updated.
                </p>
            </Modal>
        </div>
    );
};

export default RoomRequestManagement;