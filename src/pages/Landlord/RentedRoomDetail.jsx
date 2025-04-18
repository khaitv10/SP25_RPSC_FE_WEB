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
  Badge,
  Statistic
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
  AreaChartOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { getRoomStaysCustomerByRoomStayId } from "../../Services/Landlord/roomStayApi";
import CustomerModal from "../../components/Admin/CustomerModal";
import "./RentedRoomDetail.scss";

const { Title, Text, Paragraph } = Typography;

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
        return '#52c41a';
      case 'pending':
        return '#faad14';
      case 'terminated':
        return '#f5222d';
      default:
        return '#1890ff';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column', gap: '16px' }}>
        <Spin size="large" className="loading-spinner" />
        <Text className="loading-text">Loading room details...</Text>
      </div>
    );
  }

  const totalImages = room?.roomStay?.room?.roomImages?.length || 0;
  const statusColor = getStatusColor(room?.roomStay?.status);

  return (
    <div className="rented-room-detail-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card 
        className="rented-room-card-container" 
        style={{ 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          overflow: 'hidden',
          background: 'linear-gradient(to right, #ffffff, #f9f9f9)'
        }}
      >
        <Button 
          type="primary" 
          className="back-button" 
          onClick={() => navigate("/landlord/manage")}
          style={{ 
            marginBottom: '24px', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            height: 'auto'
          }}
        >
          <LeftOutlined /> Back to Management
        </Button>

        <div className="room-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Title level={2} className="rented-room-title" style={{ margin: 0 }}>
              <HomeOutlined className="title-icon" style={{ marginRight: '8px', color: '#1890ff' }} /> 
              {room?.roomStay?.room?.title || "Rented Room Details"}
            </Title>
            <Badge 
              count={room?.roomStay?.status} 
              style={{ backgroundColor: statusColor }}
              className="status-badge"
            />
          </div>
          <Tag 
            icon={<KeyOutlined />} 
            color="blue" 
            style={{ fontSize: '16px', padding: '4px 12px', borderRadius: '6px' }}
          >
            Room #{room?.roomStay?.room?.roomNumber}
          </Tag>
        </div>

        <div className="rented-room-content" style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
          <div className="rented-room-left" style={{ flex: 1, minWidth: '300px' }}>
            <Card 
              className="details-section-card" 
              style={{ 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                <Statistic 
                  title="Monthly Rent" 
                  value={room?.roomStay?.room?.price} 
                  prefix={<DollarOutlined />} 
                  suffix="VNĐ" 
                  style={{ flex: 1, minWidth: '200px' }}
                  valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                />
                <Statistic 
                  title="Deposit" 
                  value={room?.roomStay?.room?.deposite} 
                  prefix={<DollarOutlined />} 
                  suffix="VNĐ" 
                  style={{ flex: 1, minWidth: '200px' }}
                  valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                />
                <Statistic 
                  title="Area" 
                  value={room?.roomStay?.room?.square || 0} 
                  suffix="m²" 
                  prefix={<AreaChartOutlined />}
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <Statistic 
                  title="Max Occupancy" 
                  value={room?.roomStay?.room?.maxOccupancy || 0} 
                  suffix="persons" 
                  prefix={<TeamOutlined />}
                  style={{ flex: 1, minWidth: '200px' }}
                />
              </div>
              
              <Descriptions 
                bordered 
                column={1} 
                labelStyle={{ fontWeight: 'bold', backgroundColor: '#fafafa', padding: '12px 16px' }} 
                contentStyle={{ padding: '12px 16px' }}
                size="middle"
                style={{ borderRadius: '8px', overflow: 'hidden' }}
              >
                <Descriptions.Item label={<span><EnvironmentOutlined /> Location</span>}>
                  {room?.roomStay?.room?.location}
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> Start Date</span>}>
                  <Text strong className="date-text">{formatDate(room?.roomStay?.startDate)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> End Date</span>}>
                  <Text strong className="date-text">{formatDate(room?.roomStay?.endDate)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><InfoCircleOutlined /> Description</span>}>
                  <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                    {room?.roomStay?.room?.description}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <div className="rented-room-right" style={{ flex: 1, minWidth: '300px' }}>
            <div 
              className="rented-room-image-container" 
              style={{ 
                position: 'relative', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                height: '350px'
              }}
            >
              <div 
                className="image-counter" 
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                  color: 'white', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  zIndex: 2,
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {currentImageIndex + 1} / {totalImages}
              </div>
              <Image
                src={room?.roomStay?.room?.roomImages?.[currentImageIndex]?.imageUrl}
                className="rented-room-image"
                preview={false}
                fallback="data:image/png;base64,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"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <Button
                type="primary"
                icon={<LeftOutlined />}
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? totalImages - 1 : prev - 1
                  )
                }
                className="rented-room-image-nav left"
                disabled={totalImages <= 1}
                style={{ 
                  position: 'absolute', 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  opacity: 0.8,
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 0
                }}
              />
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === totalImages - 1 ? 0 : prev + 1
                  )
                }
                className="rented-room-image-nav right"
                disabled={totalImages <= 1}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  opacity: 0.8,
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 0
                }}
              />
            </div>
          </div>
        </div>

        <Divider style={{ margin: '32px 0' }} />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card 
              title={
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TeamOutlined style={{ color: '#1890ff' }} /> 
                  <span>Tenants</span>
                </span>
              } 
              className="details-card tenants-card"
              extra={<Tag color="blue">{room?.roomStayCustomers?.length || 0} occupants</Tag>}
              style={{ 
                height: '100%', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' 
              }}
              headStyle={{ 
                backgroundColor: '#f0f5ff', 
                borderBottom: '1px solid #d6e4ff',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={room?.roomStayCustomers || []}
                locale={{ 
                  emptyText: (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                      <TeamOutlined style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }} />
                      <p>No tenants registered</p>
                    </div>
                  ) 
                }}
                renderItem={(tenant) => (
                  <List.Item
                    className="rented-room-tenant-item"
                    onClick={() => {
                      setSelectedTenant(tenant);
                      setIsModalOpen(true);
                    }}
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      padding: '12px',
                      borderRadius: '6px',
                      margin: '8px 0',
                      border: '1px solid #f0f0f0',
                      ':hover': {
                        backgroundColor: '#f9f9f9',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                      }
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          style={{ 
                            backgroundColor: '#1890ff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}
                        >
                          {tenant.customerName?.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <span className="rented-room-tenant-name" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {tenant.customerName}
                        </span>
                      }
                      description={
                        <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <InfoCircleOutlined /> Click to view details
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title={
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InfoCircleOutlined style={{ color: '#1890ff' }} /> 
                  <span>Amenities</span>
                </span>
              } 
              className="details-card amenities-card"
              style={{ 
                height: '100%', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' 
              }}
              headStyle={{ 
                backgroundColor: '#f0f5ff', 
                borderBottom: '1px solid #d6e4ff',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <List
                dataSource={room?.roomStay?.room?.roomAmentiesLists || []}
                renderItem={(item) => (
                  <List.Item className="amenity-item" style={{ padding: '12px 0' }}>
                    <Text style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      {item.name}
                    </Text>
                  </List.Item>
                )}
                locale={{ 
                  emptyText: (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                      <InfoCircleOutlined style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }} />
                      <p>No amenities listed</p>
                    </div>
                  ) 
                }}
              />
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card 
              title={
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarOutlined style={{ color: '#1890ff' }} /> 
                  <span>Services</span>
                </span>
              } 
              className="details-card services-card"
              style={{ 
                height: '100%', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' 
              }}
              headStyle={{ 
                backgroundColor: '#f0f5ff', 
                borderBottom: '1px solid #d6e4ff',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <List
                dataSource={room?.roomStay?.room?.roomServices || []}
                renderItem={(item) => (
                  <List.Item 
                    className="service-item" 
                    style={{ 
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: '#fafafa',
                      borderRadius: '6px',
                      margin: '8px 0'
                    }}
                  >
                    <span className="service-name" style={{ fontWeight: '500' }}>{item.serviceName}</span>
                    <Tag color="green" className="service-cost" style={{ fontWeight: 'bold', borderRadius: '4px' }}>
                      {item.cost ? `${item.cost.toLocaleString()} VNĐ` : "Free"}
                    </Tag>
                  </List.Item>
                )}
                locale={{ 
                  emptyText: (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                      <DollarOutlined style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }} />
                      <p>No services available</p>
                    </div>
                  ) 
                }}
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