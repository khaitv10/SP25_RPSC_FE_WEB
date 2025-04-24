import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Descriptions, Image, Button, Spin, Avatar, List, Tag, Divider, Row, Col, Badge, Statistic } from "antd";
import { LeftOutlined, RightOutlined, HomeOutlined, CalendarOutlined, TeamOutlined, DollarOutlined, KeyOutlined, InfoCircleOutlined, EnvironmentOutlined, AreaChartOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
          const response = await getRoomStaysCustomerByRoomStayId(roomStayId);
          if (!response?.data?.roomStay) {
            setRoom(null);
            return;
          }
          setRoom(response.data);
        } catch (error) {
          console.error("Error fetching room details:", error.response?.data || error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRoomDetails();
    }
  }, [roomStayId]);

  const getStatusColor = (status) => {
    const colors = {
      active: '#52c41a',
      pending: '#faad14',
      terminated: '#f5222d'
    };
    return colors[status?.toLowerCase()] || '#1890ff';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '70vh', flexDirection: 'column', gap: '16px' }}>
        <Spin size="large" />
        <Text>Loading room details...</Text>
      </div>
    );
  }

  const totalImages = room?.roomStay?.room?.roomImages?.length || 0;
  const statusColor = getStatusColor(room?.roomStay?.status);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card 
        className="rounded-xl shadow-lg overflow-hidden bg-gradient-to-r from-white to-gray-50"
      >
        <Button 
          type="primary" 
          onClick={() => navigate("/landlord/manage")}
          className="flex items-center gap-2 mb-6 px-4 py-2 h-auto rounded-md"
          icon={<LeftOutlined />}
        >
          Back to Management
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Title level={2} className="m-0 flex items-center">
              <HomeOutlined className="text-blue-500 mr-2" /> 
              {room?.roomStay?.room?.title || "Room Details"}
            </Title>
            <Badge 
              count={room?.roomStay?.status} 
              style={{ backgroundColor: statusColor }}
            />
          </div>
          <Tag 
            icon={<KeyOutlined />} 
            color="blue" 
            className="text-base px-3 py-1 rounded-md"
          >
            Room #{room?.roomStay?.room?.roomNumber}
          </Tag>
        </div>

        <div className="flex flex-wrap gap-6">
          {/* Room Info Panel */}
          <div className="flex-1 min-w-[300px]">
            <Card className="rounded-lg shadow-md mb-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Statistic 
                  title="Monthly Rent" 
                  value={room?.roomStay?.room?.price} 
                  prefix={<DollarOutlined />} 
                  suffix="VNĐ" 
                  className="flex-1 min-w-[180px]"
                  valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                />
                <Statistic 
                  title="Deposit" 
                  value={room?.roomStay?.room?.deposite} 
                  prefix={<DollarOutlined />} 
                  suffix="VNĐ" 
                  className="flex-1 min-w-[180px]"
                  valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                />
                <Statistic 
                  title="Area" 
                  value={room?.roomStay?.room?.square || 0} 
                  suffix="m²" 
                  prefix={<AreaChartOutlined />}
                  className="flex-1 min-w-[180px]"
                />
                <Statistic 
                  title="Max Occupancy" 
                  value={room?.roomStay?.room?.maxOccupancy || 0} 
                  suffix="persons" 
                  prefix={<TeamOutlined />}
                  className="flex-1 min-w-[180px]"
                />
              </div>
              
              <Descriptions 
                bordered 
                column={1} 
                labelStyle={{ fontWeight: 'bold', backgroundColor: '#fafafa' }} 
                className="rounded-lg overflow-hidden"
                size="middle"
              >
                <Descriptions.Item label={<span><EnvironmentOutlined /> Location</span>}>
                  {room?.roomStay?.room?.location}
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> Start Date</span>}>
                  <Text strong>{formatDate(room?.roomStay?.startDate)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><CalendarOutlined /> End Date</span>}>
                  <Text strong>{formatDate(room?.roomStay?.endDate)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><InfoCircleOutlined /> Description</span>}>
                  <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                    {room?.roomStay?.room?.description}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Image Gallery */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative rounded-lg overflow-hidden shadow-lg h-[350px]">
              <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full z-10 text-xs font-bold">
                {currentImageIndex + 1} / {totalImages}
              </div>
              <Image
                src={room?.roomStay?.room?.roomImages?.[currentImageIndex]?.imageUrl}
                preview={false}
                fallback="data:image/png;base64,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"
                className="w-full h-full object-cover rounded-lg"
              />
              {totalImages > 1 && (
                <>
                  <Button
                    type="primary"
                    icon={<LeftOutlined />}
                    onClick={() => setCurrentImageIndex((prev) => prev === 0 ? totalImages - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80 rounded-full w-10 h-10 flex justify-center items-center p-0"
                  />
                  <Button
                    type="primary"
                    icon={<RightOutlined />}
                    onClick={() => setCurrentImageIndex((prev) => prev === totalImages - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 rounded-full w-10 h-10 flex justify-center items-center p-0"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        <Row gutter={[24, 24]}>
          {/* Tenants Card */}
          <Col xs={24} md={8}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <TeamOutlined className="text-blue-500" /> 
                  <span>Tenants</span>
                </span>
              } 
              extra={<Tag color="blue">{room?.roomStayCustomers?.length || 0} occupants</Tag>}
              className="h-full rounded-lg shadow-md"
              headStyle={{ backgroundColor: '#f0f5ff', borderBottom: '1px solid #d6e4ff', borderRadius: '8px 8px 0 0' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={room?.roomStayCustomers || []}
                locale={{ 
                  emptyText: (
                    <div className="text-center py-6">
                      <TeamOutlined className="text-2xl text-gray-400 mb-2" />
                      <p>No tenants registered</p>
                    </div>
                  ) 
                }}
                renderItem={(tenant) => (
                  <List.Item
                    onClick={() => {
                      setSelectedTenant(tenant);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer hover:bg-gray-50 transition-all p-3 rounded-md border border-gray-100 my-2 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          className="bg-blue-500 flex justify-center items-center text-lg font-bold"
                        >
                          {tenant.customerName?.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <span className="text-base font-medium">
                          {tenant.customerName}
                        </span>
                      }
                      description={
                        <Text type="secondary" className="flex items-center gap-1">
                          <InfoCircleOutlined /> View details
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          {/* Amenities Card */}
          <Col xs={24} md={8}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <InfoCircleOutlined className="text-blue-500" /> 
                  <span>Amenities</span>
                </span>
              }
              className="h-full rounded-lg shadow-md"
              headStyle={{ backgroundColor: '#f0f5ff', borderBottom: '1px solid #d6e4ff', borderRadius: '8px 8px 0 0' }}
            >
              <List
                dataSource={room?.roomStay?.room?.roomAmentiesLists || []}
                renderItem={(item) => (
                  <List.Item className="py-3">
                    <Text className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-500" />
                      {item.name}
                    </Text>
                  </List.Item>
                )}
                locale={{ 
                  emptyText: (
                    <div className="text-center py-6">
                      <InfoCircleOutlined className="text-2xl text-gray-400 mb-2" />
                      <p>No amenities listed</p>
                    </div>
                  ) 
                }}
              />
            </Card>
          </Col>
          
          {/* Services Card */}
          <Col xs={24} md={8}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <DollarOutlined className="text-blue-500" /> 
                  <span>Services</span>
                </span>
              }
              className="h-full rounded-lg shadow-md"
              headStyle={{ backgroundColor: '#f0f5ff', borderBottom: '1px solid #d6e4ff', borderRadius: '8px 8px 0 0' }}
            >
              <List
                dataSource={room?.roomStay?.room?.roomServices || []}
                renderItem={(item) => (
                  <List.Item 
                    className="py-3 px-4 flex justify-between bg-gray-50 rounded-md my-2"
                  >
                    <span className="font-medium">{item.serviceName}</span>
                    <Tag color="green" className="font-bold rounded">
                      {item.cost ? `${item.cost.toLocaleString()} VNĐ` : "Free"}
                    </Tag>
                  </List.Item>
                )}
                locale={{ 
                  emptyText: (
                    <div className="text-center py-6">
                      <DollarOutlined className="text-2xl text-gray-400 mb-2" />
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