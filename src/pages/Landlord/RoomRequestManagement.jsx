import React, { useState } from 'react';
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
    Drawer,
    Space,
    Divider
} from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    BellOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    IdcardOutlined,
    TeamOutlined,
    DollarOutlined,
    MinusSquareOutlined
} from '@ant-design/icons';
import RequestDetailsDrawer from './RequestDetailsDrawer';
import './RoomRequestManagement.scss';
import pic from '../../assets/room.jpg';
import ava from '../../assets/avatar.jpg';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for rooms and requests
const mockRooms = [
    {
        id: 1,
        name: 'Phòng 101',
        address: '123 Nguyễn Văn Linh, An Khánh, Quận 7, TP.HCM',
        price: '3,000,000 VND',
        area: '25m²',
        image: pic,
        requestCount: 5
    },
    {
        id: 2,
        name: 'Phòng 202',
        address: '456 Đường D2, Bình Thạnh, TP.HCM',
        price: '2,500,000 VND',
        area: '20m²',
        image: pic,
        requestCount: 2
    },
    {
        id: 3,
        name: 'Phòng 303',
        address: '789 Lê Văn Lương, Nhà Bè, TP.HCM',
        price: '2,800,000 VND',
        area: '22m²',
        image: pic,
        requestCount: 3
    },
    {
        id: 5,
        name: 'Phòng 505',
        address: '654 Lý Thường Kiệt, Quận 10, TP.HCM',
        price: '3,500,000 VND',
        area: '28m²',
        image: pic,
        requestCount: 4
    }
];

// Mock request data
const mockRequests = {
    1: [
        { id: 101, customerName: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com', requestDate: '15/03/2025', preferredMoveInDate: '01/04/2025', numTenants: 2, occupation: 'Nhân viên văn phòng', idCard: '123456789012', status: 'pending', message: 'Tôi muốn thuê phòng này cho gia đình nhỏ gồm 2 người.', avatar: 'https://via.placeholder.com/50' },
        { id: 102, customerName: 'Trần Thị B', phone: '0901234568', email: 'tranthib@email.com', requestDate: '16/03/2025', preferredMoveInDate: '05/04/2025', numTenants: 1, occupation: 'Sinh viên', idCard: '123456789013', status: 'pending', message: 'Tôi là sinh viên năm cuối, cần thuê phòng gần trường.', avatar: 'https://via.placeholder.com/50' },
        { id: 103, customerName: 'Lê Văn C', phone: '0901234569', email: 'levanc@email.com', requestDate: '14/03/2025', preferredMoveInDate: '10/04/2025', numTenants: 2, occupation: 'Kỹ sư', idCard: '123456789014', status: 'pending', message: 'Tôi và bạn tôi cần thuê phòng gần công ty.', avatar: 'https://via.placeholder.com/50' },
        { id: 104, customerName: 'Phạm Thị D', phone: '0901234570', email: 'phamthid@email.com', requestDate: '13/03/2025', preferredMoveInDate: '01/04/2025', numTenants: 1, occupation: 'Giáo viên', idCard: '123456789015', status: 'pending', message: 'Tôi cần thuê phòng yên tĩnh để làm việc và nghỉ ngơi.', avatar: 'https://via.placeholder.com/50' },
        { id: 105, customerName: 'Hoàng Văn E', phone: '0901234571', email: 'hoangvane@email.com', requestDate: '12/03/2025', preferredMoveInDate: '15/04/2025', numTenants: 2, occupation: 'Bác sĩ', idCard: '123456789016', status: 'pending', message: 'Tôi cần thuê phòng cho vợ chồng tôi, gần bệnh viện.', avatar: 'https://via.placeholder.com/50' }
    ],
    2: [
        { id: 201, customerName: 'Vũ Thị F', phone: '0901234572', email: 'vuthif@email.com', requestDate: '15/03/2025', preferredMoveInDate: '20/04/2025', numTenants: 1, occupation: 'Nhân viên ngân hàng', idCard: '123456789017', status: 'pending', message: 'Tôi muốn thuê phòng này vì gần nơi làm việc.', avatar: 'https://via.placeholder.com/50' },
        { id: 202, customerName: 'Đặng Văn G', phone: '0901234573', email: 'dangvang@email.com', requestDate: '16/03/2025', preferredMoveInDate: '01/05/2025', numTenants: 1, occupation: 'Kỹ thuật viên', idCard: '123456789018', status: 'pending', message: 'Tôi làm việc gần đây và cần một phòng ở lâu dài.', avatar: 'https://via.placeholder.com/50' }
    ],
    3: [
        { id: 301, customerName: 'Ngô Thị H', phone: '0901234574', email: 'ngothih@email.com', requestDate: '14/03/2025', preferredMoveInDate: '10/04/2025', numTenants: 2, occupation: 'Thiết kế đồ họa', idCard: '123456789019', status: 'pending', message: 'Tôi và em gái tôi cần thuê phòng gần trung tâm thành phố.', avatar: 'https://via.placeholder.com/50' },
        { id: 302, customerName: 'Bùi Văn I', phone: '0901234575', email: 'buivani@email.com', requestDate: '13/03/2025', preferredMoveInDate: '05/04/2025', numTenants: 1, occupation: 'Lập trình viên', idCard: '123456789020', status: 'pending', message: 'Tôi cần một phòng yên tĩnh để làm việc tại nhà.', avatar: 'https://via.placeholder.com/50' },
        { id: 303, customerName: 'Trương Thị K', phone: '0901234576', email: 'truongthik@email.com', requestDate: '12/03/2025', preferredMoveInDate: '15/04/2025', numTenants: 1, occupation: 'Kế toán', idCard: '123456789021', status: 'pending', message: 'Tôi đang tìm phòng có điều hòa và internet tốc độ cao.', avatar: 'https://via.placeholder.com/50' }
    ],
    5: [
        { id: 501, customerName: 'Lý Văn L', phone: '0901234577', email: 'lyvanl@email.com', requestDate: '16/03/2025', preferredMoveInDate: '01/04/2025', numTenants: 2, occupation: 'Kinh doanh', idCard: '123456789022', status: 'pending', message: 'Tôi cần thuê phòng cho vợ chồng tôi, khu vực an ninh.', avatar: 'https://via.placeholder.com/50' },
        { id: 502, customerName: 'Mai Thị M', phone: '0901234578', email: 'maithim@email.com', requestDate: '15/03/2025', preferredMoveInDate: '10/04/2025', numTenants: 1, occupation: 'Giáo viên', idCard: '123456789023', status: 'pending', message: 'Tôi cần phòng yên tĩnh để chuẩn bị bài giảng.', avatar: 'https://via.placeholder.com/50' },
        { id: 503, customerName: 'Dương Văn N', phone: '0901234579', email: 'duongvann@email.com', requestDate: '14/03/2025', preferredMoveInDate: '05/04/2025', numTenants: 1, occupation: 'Nhân viên bán hàng', idCard: '123456789024', status: 'pending', message: 'Tôi muốn thuê phòng gần chợ và trung tâm mua sắm.', avatar: 'https://via.placeholder.com/50' },
        { id: 504, customerName: 'Võ Thị P', phone: '0901234580', email: 'vothip@email.com', requestDate: '13/03/2025', preferredMoveInDate: '15/04/2025', numTenants: 2, occupation: 'Y tá', idCard: '123456789025', status: 'pending', message: 'Tôi cần thuê phòng gần bệnh viện cho tôi và chồng.', avatar: 'https://via.placeholder.com/50' }
    ]
};

const RoomRequestManagement = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeTab, setActiveTab] = useState('hasRequests');

    const showModal = (room) => {
        setSelectedRoom(room);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showDrawer = (request) => {
        setSelectedRequest(request);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handleApprove = (request) => {
        message.success(`Đã chấp nhận yêu cầu thuê phòng từ ${request.customerName}`);
        setDrawerVisible(false);
        setIsModalVisible(false);
    };

    const handleReject = (request) => {
        message.info(`Đã từ chối yêu cầu thuê phòng từ ${request.customerName}`);
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
                        <Badge count={mockRooms.length} offset={[10, 0]} className="tab-badge">
                            <span>Rooms with Requests</span>
                        </Badge>
                    }
                    key="hasRequests"
                >
                    <Row gutter={[16, 16]} className="room-grid">
                        {mockRooms.map(room => (
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
                                                <Text>Square: {room.area}</Text>
                                            </div>
                                        </div>
                                        <Button
                                            type="primary"
                                            block
                                            className="view-requests-btn"
                                            onClick={() => showModal(room)}
                                        >
                                            View Requests
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
            </Tabs>



            {/* Modal for viewing requests */}
            <Modal
                title={selectedRoom ? `Room Rental Requests - ${selectedRoom.name}` : ''}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
                className="requests-modal"
            >
                {selectedRoom && mockRequests[selectedRoom.id] && (
                    <List
                        className="request-list"
                        itemLayout="horizontal"
                        dataSource={mockRequests[selectedRoom.id]}
                        renderItem={request => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        onClick={() => showDrawer(request)}
                                        style={{ backgroundColor: '#414141', borderColor: '#414141' }}
                                    >
                                        Details
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    //avatar={<Avatar src={request.avatar} size={74} />}
                                    avatar={<Avatar src={ava} size={74} />}
                                    title={<Text strong>{request.customerName}</Text>}
                                    description={
                                        <div className="request-brief">
                                            <div style={{ color: '#000970' }}><PhoneOutlined className="detail-icon" /> {request.phone}</div>
                                            <div><CalendarOutlined  className="detail-icon" /> Request Date: {request.requestDate}</div>
                                        </div>
                                    }
                                />
                                <Tag color="green">Pending</Tag>
                            </List.Item>
                        )}
                    />
                )}
            </Modal>

            {/* Use the new RequestDetailsDrawer component */}
            <RequestDetailsDrawer
                visible={drawerVisible}
                onClose={closeDrawer}
                requestData={selectedRequest}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

export default RoomRequestManagement;