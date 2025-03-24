import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Descriptions,
  Image,
  Button,
  Spin,
  Avatar,
  List,
  Tag,
  Divider,
  Row,
  Col,
  Badge
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  AreaChartOutlined
} from "@ant-design/icons";
import { getRoomStaysCustomerByRoomStayId } from "../../Services/Landlord/roomStayApi";
import CustomerModal from "../../components/Admin/CustomerModal";
import "./RentedRoomDetail.scss";

const { Title, Text } = Typography;

const RentedRoomDetail = () => {
  const { roomStayId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomStayId) {
      const fetchRoomDetails = async () => {
        try {
          console.log("🚀 Fetching room details for roomStayId:", roomStayId);
          const response = await getRoomStaysCustomerByRoomStayId(roomStayId);
          console.log("✅ API Response Data:", response);
          
          if (!response || !response.data || !response.data.roomStay) {
            console.warn("⚠️ No roomStay data found.");
            setRoom(null);
            return;
          }

          setRoom(response.data);
          console.log("🔄 Updated Room State:", response.data);
        } catch (error) {
          console.error("❌ Error fetching room details:", error.response?.data || error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRoomDetails();
    }
  }, [roomStayId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'pending':
        return 'orange';
      case 'terminated':
        return 'red';
      default:
        return 'blue';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" className="loading-spinner" />
        <Text className="loading-text">Loading room details...</Text>
      </div>
    );
  }

  const totalImages = room?.roomStay?.room?.roomImages?.length || 0;

  return (
    <div className="rented-room-detail-container">
      <Card className="rented-room-card-container">
        <Button type="default" className="back-button" onClick={() => navigate("/landlord/manage")}>
          <LeftOutlined /> Back to Management
        </Button>

        <div className="room-header">
          <Title level={2} className="rented-room-title">
            <HomeOutlined className="title-icon" /> {room?.roomStay?.room?.title || "Rented Room Details"}
          </Title>
          <Badge 
            count={room?.roomStay?.status} 
            style={{ backgroundColor: getStatusColor(room?.roomStay?.status) }}
            className="status-badge"
          />
        </div>

        <div className="rented-room-content">
          <div className="rented-room-left">
            <Card className="details-section-card">
              <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }} size="middle">
                <Descriptions.Item label={<span><HomeOutlined /> Room Name</span>}>
                  {room?.roomStay?.room?.title}
                </Descriptions.Item>
                <Descriptions.Item label={<span><KeyOutlined /> Room Number</span>}>
                  {room?.roomStay?.room?.roomNumber}
                </Descriptions.Item>
                <Descriptions.Item label={<span><EnvironmentOutlined /> Location</span>}>
                  {room?.roomStay?.room?.location}
                </Descriptions.Item>
                <Descriptions.Item label={<span><AreaChartOutlined /> Area</span>}>
                  {room?.roomStay?.room?.square || "N/A"} m²
                </Descriptions.Item>
                <Descriptions.Item label={<span><TeamOutlined /> Maximum Occupancy</span>}>
                  {room?.roomStay?.room?.maxOccupancy || "N/A"} persons
                </Descriptions.Item>
                <Descriptions.Item label={<span><DollarOutlined /> Monthly Rent</span>}>
                  <Text strong className="price-text">{room?.roomStay?.room?.price?.toLocaleString()} VNĐ</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><DollarOutlined /> Security Deposit</span>}>
                  <Text strong className="deposit-text">{room?.roomStay?.room?.deposite?.toLocaleString()} VNĐ</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><InfoCircleOutlined /> Description</span>}>
                  {room?.roomStay?.room?.description}
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> Start Date</span>}>
                  <Text strong className="date-text">{room?.roomStay?.startDate}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> End Date</span>}>
                  <Text strong className="date-text">{room?.roomStay?.endDate}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <div className="rented-room-right">
            <div className="rented-room-image-container">
              <div className="image-counter">
                {currentImageIndex + 1} / {totalImages}
              </div>
              <Image
                src={room?.roomStay?.room?.roomImages?.[currentImageIndex]?.imageUrl}
                className="rented-room-image"
                preview={false}
                fallback="data:image/png;base64,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"
              />
              <Button
                icon={<LeftOutlined />}
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? totalImages - 1 : prev - 1
                  )
                }
                className="rented-room-image-nav left"
                disabled={totalImages <= 1}
              />
              <Button
                icon={<RightOutlined />}
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === totalImages - 1 ? 0 : prev + 1
                  )
                }
                className="rented-room-image-nav right"
                disabled={totalImages <= 1}
              />
            </div>
          </div>
        </div>

        <Divider />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card 
              title={<span className="card-title"><TeamOutlined /> Tenants</span>} 
              className="details-card tenants-card"
              extra={<Tag color="blue">{room?.roomStayCustomers?.length || 0} occupants</Tag>}
            >
              <List
                itemLayout="horizontal"
                dataSource={room?.roomStayCustomers || []}
                locale={{ emptyText: "No tenants registered" }}
                renderItem={(tenant) => (
                  <List.Item
                    className="rented-room-tenant-item"
                    onClick={() => {
                      setSelectedTenant(tenant);
                      setIsModalOpen(true);
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          size="large" 
                          style={{ backgroundColor: '#1890ff' }}
                        >
                          {tenant.customerName?.charAt(0)}
                        </Avatar>
                      }
                      title={<span className="rented-room-tenant-name">{tenant.customerName}</span>}
                      description={<Text type="secondary">Click to view details</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title={<span className="card-title"><InfoCircleOutlined /> Amenities</span>} 
              className="details-card amenities-card"
            >
              <List
                dataSource={room?.roomStay?.room?.roomAmentiesLists || []}
                renderItem={(item) => (
                  <List.Item className="amenity-item">
                    <Text>{item.name}</Text>
                  </List.Item>
                )}
                locale={{ emptyText: "No amenities listed" }}
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title={<span className="card-title"><DollarOutlined /> Services</span>} 
              className="details-card services-card"
            >
              <List
                dataSource={room?.roomStay?.room?.roomServices || []}
                renderItem={(item) => (
                  <List.Item className="service-item">
                    <span className="service-name">{item.serviceName}</span>
                    <Tag color="green" className="service-cost">
                      {item.cost ? `${item.cost.toLocaleString()} VNĐ` : "Free"}
                    </Tag>
                  </List.Item>
                )}
                locale={{ emptyText: "No services available" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      
      <CustomerModal 
        isOpen={isModalOpen} 
        customer={selectedTenant} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RentedRoomDetail;