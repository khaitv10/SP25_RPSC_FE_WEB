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
    Tooltip,
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
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    IdcardOutlined,
    TeamOutlined,
    DollarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import './RoomRequestManagement.scss';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data for demo purposes
const mockRooms = [
    {
        id: 1,
        name: 'Phòng 101',
        address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
        price: '3,000,000 VND',
        area: '25m²',
        image: 'https://via.placeholder.com/300',
        requestCount: 5,
        status: 'available'
    },
    {
        id: 2,
        name: 'Phòng 202',
        address: '456 Đường D2, Bình Thạnh, TP.HCM',
        price: '2,500,000 VND',
        area: '20m²',
        image: 'https://via.placeholder.com/300',
        requestCount: 2,
        status: 'available'
    },
    {
        id: 3,
        name: 'Phòng 303',
        address: '789 Lê Văn Lương, Nhà Bè, TP.HCM',
        price: '2,800,000 VND',
        area: '22m²',
        image: 'https://via.placeholder.com/300',
        requestCount: 3,
        status: 'available'
    },
    {
        id: 4,
        name: 'Phòng 404',
        address: '321 Võ Văn Ngân, Thủ Đức, TP.HCM',
        price: '3,200,000 VND',
        area: '30m²',
        image: 'https://via.placeholder.com/300',
        requestCount: 0,
        status: 'available'
    },
    {
        id: 5,
        name: 'Phòng 505',
        address: '654 Lý Thường Kiệt, Quận 10, TP.HCM',
        price: '3,500,000 VND',
        area: '28m²',
        image: 'https://via.placeholder.com/300',
        requestCount: 4,
        status: 'available'
    }
];

const mockRequests = {
    1: [
        {
            id: 101,
            customerName: 'Nguyễn Văn A',
            phone: '0901234567',
            email: 'nguyenvana@email.com',
            requestDate: '15/03/2025',
            preferredMoveInDate: '01/04/2025',
            numTenants: 2,
            occupation: 'Nhân viên văn phòng',
            idCard: '123456789012',
            status: 'pending',
            message: 'Tôi muốn thuê phòng này cho gia đình nhỏ gồm 2 người.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 102,
            customerName: 'Trần Thị B',
            phone: '0901234568',
            email: 'tranthib@email.com',
            requestDate: '16/03/2025',
            preferredMoveInDate: '05/04/2025',
            numTenants: 1,
            occupation: 'Sinh viên',
            idCard: '123456789013',
            status: 'pending',
            message: 'Tôi là sinh viên năm cuối, cần thuê phòng gần trường.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 103,
            customerName: 'Lê Văn C',
            phone: '0901234569',
            email: 'levanc@email.com',
            requestDate: '14/03/2025',
            preferredMoveInDate: '10/04/2025',
            numTenants: 2,
            occupation: 'Kỹ sư',
            idCard: '123456789014',
            status: 'pending',
            message: 'Tôi và bạn tôi cần thuê phòng gần công ty.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 104,
            customerName: 'Phạm Thị D',
            phone: '0901234570',
            email: 'phamthid@email.com',
            requestDate: '13/03/2025',
            preferredMoveInDate: '01/04/2025',
            numTenants: 1,
            occupation: 'Giáo viên',
            idCard: '123456789015',
            status: 'pending',
            message: 'Tôi cần thuê phòng yên tĩnh để làm việc và nghỉ ngơi.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 105,
            customerName: 'Hoàng Văn E',
            phone: '0901234571',
            email: 'hoangvane@email.com',
            requestDate: '12/03/2025',
            preferredMoveInDate: '15/04/2025',
            numTenants: 2,
            occupation: 'Bác sĩ',
            idCard: '123456789016',
            status: 'pending',
            message: 'Tôi cần thuê phòng cho vợ chồng tôi, gần bệnh viện.',
            avatar: 'https://via.placeholder.com/50'
        }
    ],
    2: [
        {
            id: 201,
            customerName: 'Vũ Thị F',
            phone: '0901234572',
            email: 'vuthif@email.com',
            requestDate: '15/03/2025',
            preferredMoveInDate: '20/04/2025',
            numTenants: 1,
            occupation: 'Nhân viên ngân hàng',
            idCard: '123456789017',
            status: 'pending',
            message: 'Tôi muốn thuê phòng này vì gần nơi làm việc.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 202,
            customerName: 'Đặng Văn G',
            phone: '0901234573',
            email: 'dangvang@email.com',
            requestDate: '16/03/2025',
            preferredMoveInDate: '01/05/2025',
            numTenants: 1,
            occupation: 'Kỹ thuật viên',
            idCard: '123456789018',
            status: 'pending',
            message: 'Tôi làm việc gần đây và cần một phòng ở lâu dài.',
            avatar: 'https://via.placeholder.com/50'
        }
    ],
    3: [
        {
            id: 301,
            customerName: 'Ngô Thị H',
            phone: '0901234574',
            email: 'ngothih@email.com',
            requestDate: '14/03/2025',
            preferredMoveInDate: '10/04/2025',
            numTenants: 2,
            occupation: 'Thiết kế đồ họa',
            idCard: '123456789019',
            status: 'pending',
            message: 'Tôi và em gái tôi cần thuê phòng gần trung tâm thành phố.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 302,
            customerName: 'Bùi Văn I',
            phone: '0901234575',
            email: 'buivani@email.com',
            requestDate: '13/03/2025',
            preferredMoveInDate: '05/04/2025',
            numTenants: 1,
            occupation: 'Lập trình viên',
            idCard: '123456789020',
            status: 'pending',
            message: 'Tôi cần một phòng yên tĩnh để làm việc tại nhà.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 303,
            customerName: 'Trương Thị K',
            phone: '0901234576',
            email: 'truongthik@email.com',
            requestDate: '12/03/2025',
            preferredMoveInDate: '15/04/2025',
            numTenants: 1,
            occupation: 'Kế toán',
            idCard: '123456789021',
            status: 'pending',
            message: 'Tôi đang tìm phòng có điều hòa và internet tốc độ cao.',
            avatar: 'https://via.placeholder.com/50'
        }
    ],
    5: [
        {
            id: 501,
            customerName: 'Lý Văn L',
            phone: '0901234577',
            email: 'lyvanl@email.com',
            requestDate: '16/03/2025',
            preferredMoveInDate: '01/04/2025',
            numTenants: 2,
            occupation: 'Kinh doanh',
            idCard: '123456789022',
            status: 'pending',
            message: 'Tôi cần thuê phòng cho vợ chồng tôi, khu vực an ninh.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 502,
            customerName: 'Mai Thị M',
            phone: '0901234578',
            email: 'maithim@email.com',
            requestDate: '15/03/2025',
            preferredMoveInDate: '10/04/2025',
            numTenants: 1,
            occupation: 'Giáo viên',
            idCard: '123456789023',
            status: 'pending',
            message: 'Tôi cần phòng yên tĩnh để chuẩn bị bài giảng.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 503,
            customerName: 'Dương Văn N',
            phone: '0901234579',
            email: 'duongvann@email.com',
            requestDate: '14/03/2025',
            preferredMoveInDate: '05/04/2025',
            numTenants: 1,
            occupation: 'Nhân viên bán hàng',
            idCard: '123456789024',
            status: 'pending',
            message: 'Tôi muốn thuê phòng gần chợ và trung tâm mua sắm.',
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: 504,
            customerName: 'Võ Thị P',
            phone: '0901234580',
            email: 'vothip@email.com',
            requestDate: '13/03/2025',
            preferredMoveInDate: '15/04/2025',
            numTenants: 2,
            occupation: 'Y tá',
            idCard: '123456789025',
            status: 'pending',
            message: 'Tôi cần thuê phòng gần bệnh viện cho tôi và chồng.',
            avatar: 'https://via.placeholder.com/50'
        }
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

    const roomsWithRequests = mockRooms.filter(room => room.requestCount > 0);
    const roomsWithoutRequests = mockRooms.filter(room => room.requestCount === 0);

    return (
        <div className="room-request-management">
            <Card className="main-card">
                <Title level={2} className="page-title">
                    <BellOutlined className="title-icon" /> Quản Lý Yêu Cầu Thuê Phòng
                </Title>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="request-tabs"
                >
                    <TabPane
                        tab={
                            <span>
                                <Badge count={roomsWithRequests.length} offset={[10, 0]}>
                                    <span>Phòng Có Yêu Cầu</span>
                                </Badge>
                            </span>
                        }
                        key="hasRequests"
                    >
                        {roomsWithRequests.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {roomsWithRequests.map(room => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                                        <Card
                                            hoverable
                                            className="room-card"
                                            cover={<img alt={room.name} src={room.image} />}
                                        >
                                            <Badge
                                                count={room.requestCount}
                                                className="request-badge"
                                                offset={[-5, 0]}
                                            >
                                                <Button onClick={() => showModal(room)} className="view-requests-btn">
                                                    Xem Yêu Cầu
                                                </Button>
                                            </Badge>
                                            <Card.Meta
                                                title={room.name}
                                                description={
                                                    <>
                                                        <div><HomeOutlined /> {room.address}</div>
                                                        <div><DollarOutlined /> {room.price} / tháng</div>
                                                        <div>Diện tích: {room.area}</div>
                                                    </>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Không có phòng nào có yêu cầu thuê hiện tại" />
                        )}
                    </TabPane>

                    <TabPane
                        tab="Phòng Chưa Có Yêu Cầu"
                        key="noRequests"
                    >
                        {roomsWithoutRequests.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {roomsWithoutRequests.map(room => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
                                        <Card
                                            hoverable
                                            className="room-card"
                                            cover={<img alt={room.name} src={room.image} />}
                                        >
                                            <Card.Meta
                                                title={room.name}
                                                description={
                                                    <>
                                                        <div><HomeOutlined /> {room.address}</div>
                                                        <div><DollarOutlined /> {room.price} / tháng</div>
                                                        <div>Diện tích: {room.area}</div>
                                                    </>
                                                }
                                            />
                                            <div className="no-requests-tag">
                                                <Tag icon={<CloseCircleOutlined />} color="default">
                                                    Chưa có yêu cầu thuê
                                                </Tag>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Tất cả các phòng đều có yêu cầu thuê" />
                        )}
                    </TabPane>
                </Tabs>
            </Card>

            {/* Modal for viewing requests */}
            <Modal
                title={selectedRoom ? `Yêu Cầu Thuê Phòng - ${selectedRoom.name}` : ''}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
                className="requests-modal"
            >
                {selectedRoom && mockRequests[selectedRoom.id] ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={mockRequests[selectedRoom.id]}
                        renderItem={request => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        onClick={() => showDrawer(request)}
                                    >
                                        Xem Chi Tiết
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={request.avatar} />}
                                    title={request.customerName}
                                    description={
                                        <>
                                            <div><CalendarOutlined /> Ngày yêu cầu: {request.requestDate}</div>
                                            <div><PhoneOutlined /> {request.phone}</div>
                                            <div><ClockCircleOutlined /> Dự kiến chuyển vào: {request.preferredMoveInDate}</div>
                                        </>
                                    }
                                />
                                <div className="request-status">
                                    <Tag color="blue">{request.status === 'pending' ? 'Đang chờ' : request.status}</Tag>
                                </div>
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="Không có yêu cầu thuê cho phòng này" />
                )}
            </Modal>

            {/* Drawer for request details */}
            <Drawer
                title="Chi Tiết Yêu Cầu Thuê Phòng"
                placement="right"
                width={500}
                onClose={closeDrawer}
                visible={drawerVisible}
                className="request-details-drawer"
                footer={
                    <Space>
                        <Button onClick={closeDrawer}>Đóng</Button>
                        <Button danger onClick={() => handleReject(selectedRequest)}>Từ Chối</Button>
                        <Button type="primary" onClick={() => handleApprove(selectedRequest)}>Chấp Nhận</Button>
                    </Space>
                }
            >
                {selectedRequest && (
                    <div className="request-details">
                        <div className="customer-avatar">
                            <Avatar size={64} src={selectedRequest.avatar} />
                            <Title level={4}>{selectedRequest.customerName}</Title>
                        </div>

                        <Divider />

                        <div className="detail-item">
                            <Text strong><PhoneOutlined /> Số điện thoại:</Text>
                            <Text>{selectedRequest.phone}</Text>
                        </div>

                        <div className="detail-item">
                            <Text strong><MailOutlined /> Email:</Text>
                            <Text>{selectedRequest.email}</Text>
                        </div>

                        <div className="detail-item">
                            <Text strong><IdcardOutlined /> CMND/CCCD:</Text>
                            <Text>{selectedRequest.idCard}</Text>
                        </div>

                        <div className="detail-item">
                            <Text strong><UserOutlined /> Nghề nghiệp:</Text>
                            <Text>{selectedRequest.occupation}</Text>
                        </div>

                        <div className="detail-item">
                            <Text strong><TeamOutlined /> Số người ở:</Text>
                            <Text>{selectedRequest.numTenants} người</Text>
                        </div>

                        <div className="detail-item">
                            <Text strong><CalendarOutlined /> Ngày yêu cầu:</Text>
                            <Text>{selectedRequest.requestDate}</Text>
                        </div>

                        <div className="detail-item">
                            <Text strong><CalendarOutlined /> Ngày dự kiến chuyển vào:</Text>
                            <Text>{selectedRequest.preferredMoveInDate}</Text>
                        </div>

                        <Divider />

                        <div className="request-message">
                            <Text strong>Tin nhắn từ người thuê:</Text>
                            <Card className="message-card">
                                {selectedRequest.message}
                            </Card>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default RoomRequestManagement;