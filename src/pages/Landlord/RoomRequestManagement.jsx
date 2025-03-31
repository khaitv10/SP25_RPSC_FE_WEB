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
    message,
    notification,
    Spin
} from 'antd';
import {
    HomeOutlined,
    BellOutlined,
    CalendarOutlined,
    PhoneOutlined,
    DollarOutlined
} from '@ant-design/icons';
import RequestDetailsDrawer from './RequestDetailsDrawer';
import './RoomRequestManagement.scss';
import pic from '../../assets/room.jpg';
import ava from '../../assets/avatar.jpg';
import roomRentalService from "../../Services/Landlord/roomAPI";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const RoomRequestManagement = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeTab, setActiveTab] = useState('hasRequests');

    // State for API data
    const [rooms, setRooms] = useState([]);
    const [roomRequests, setRoomRequests] = useState({});
    const [loading, setLoading] = useState(true);
    const [pageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalRooms, setTotalRooms] = useState(0);

    useEffect(() => {
        fetchRoomRentalRequirements();
        const successNotification = localStorage.getItem('approval_success');
        if (successNotification) {
            try {
                const { message: successMessage, time } = JSON.parse(successNotification);
                // Kiểm tra xem thông báo có mới không (trong vòng 5 giây)
                const currentTime = new Date().getTime();
                if (currentTime - time < 5000) {
                    // Hiển thị thông báo
                    notification.success({
                        message: 'Success',
                        description: successMessage,
                        duration: 4,
                        placement: 'topRight',
                    });
                }
            } catch (error) {
                console.error("Error parsing success notification:", error);
            }
            // Xóa thông báo từ localStorage để không hiển thị lại
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
                    price: room.price ? `${room.price.toLocaleString()} VND` : 'Contact for price',
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
            }
        } catch (error) {
            console.error("Error loading room data:", error);
            message.error("Unable to load room data. Please try again later.");
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
            message.error("Unable to load customer requests. Please try again later.");
        }
    };

    const showModal = (room) => {
        setSelectedRoom(room);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showDrawer = (request) => {
        const roomRentRequestsId = selectedRoom?.roomRentRequestsId;

        if (!roomRentRequestsId) {
            message.error("Missing room rent request ID. Cannot proceed.");
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

    return (
        <div className="room-request-management">
            <div className="room-request-header">
                <Title level={2}>
                    <BellOutlined className="title-icon" /> Requires Room Rental
                </Title>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="request-tabs"
            >
                <TabPane
                    tab={
                        <Badge count={rooms.length} offset={[10, 0]} className="tab-badge">
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
                                                    //style={{color: 'white'}}
                                                >
                                                    View Requests
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col span={24}>
                                    <Empty description="No rooms with rental requests" />
                                </Col>
                            )}
                        </Row>
                    )}
                </TabPane>
            </Tabs>

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
                                                <div><CalendarOutlined className="detail-icon" /> Want to Rent Date: {formatDate(request.dateWantToRent)}</div> {/* Format the date */}
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



            {/* RequestDetailsDrawer component */}
            <RequestDetailsDrawer
                visible={drawerVisible}
                onClose={closeDrawer}
                requestData={selectedRequest}
                refreshData={fetchRoomRentalRequirements}
                onApprove={() => {

                    handleCancel();
                    fetchRoomRentalRequirements();
                }}
            />
        </div>
    );
};


export default RoomRequestManagement;