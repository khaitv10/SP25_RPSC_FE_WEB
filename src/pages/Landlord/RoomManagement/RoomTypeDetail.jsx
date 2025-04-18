import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Descriptions, Tag, Card, Divider, Skeleton, Badge, Typography, Space, Alert, Empty } from "antd";
import { 
  HomeOutlined, 
  DollarCircleOutlined, 
  AreaChartOutlined, 
  TeamOutlined, 
  EnvironmentOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { getRoomTypeDetailByRoomTypeId } from "../../../Services/Landlord/roomTypeAPI"; 
import "./RoomTypeDetail.scss"; 

const { Title, Text, Paragraph } = Typography;

const RoomTypeDetail = () => {
  const { id } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomTypeDetail = async () => {
      try {
        console.log("Fetching data for roomTypeId:", id);
        const data = await getRoomTypeDetailByRoomTypeId(id);
        console.log("Fetched room type data:", data);
        setRoomType(data);
      } catch (error) {
        console.error("Error fetching room type details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypeDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="room-type-detail">
        <div className="detail-container">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="room-type-detail">
        <div className="detail-container">
          <Alert
            message="Room Type Not Found"
            description="The requested room type could not be found. Please check the ID and try again."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  // Helper function to safely get nested properties or return N/A
  const getNestedValue = (obj, path, defaultValue = "N/A") => {
    try {
      const result = path.split('.').reduce((o, key) => o && o[key] !== undefined ? o[key] : undefined, obj);
      return result !== undefined && result !== null && result !== '' ? result : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Determine status color
  const statusColor = getNestedValue(roomType, 'status') === "Available" ? "success" : "error";
  const status = getNestedValue(roomType, 'status');

  return (
    <div className="room-type-detail">
      <div className="detail-container">
        <div className="back-button-container">
          <Link to="/landlord/roomtype">
            <Button icon={<ArrowLeftOutlined />} size="large">
              Back to Room Types
            </Button>
          </Link>
        </div>
        
        <div className="header-section">
          <div className="room-type-header">
            <div className="title-with-status">
              <Title level={2} className="room-type-name">
                {getNestedValue(roomType, 'roomTypeName')}
              </Title>
              <Tag color={statusColor} className="status-tag">
                {status}
              </Tag>
            </div>
            <div className="header-actions">
              <Link to={`/landlord/roomtype/room?roomType=${id}`}>
                <Button type="primary" size="large" icon={<HomeOutlined />}>
                  View Rooms
                </Button>
              </Link>
            </div>
          </div>
          <Paragraph className="room-description">
            {getNestedValue(roomType, 'description')}
          </Paragraph>
        </div>

        <div className="content-section">
          <Card className="info-card">
            <Title level={4} className="card-title">Property Details</Title>
            <Divider className="card-divider" />
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  <DollarCircleOutlined className="detail-icon" />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Deposit</Text>
                  <Text strong className="detail-value">
                    {getNestedValue(roomType, 'deposite') !== "N/A" 
                      ? `${parseFloat(getNestedValue(roomType, 'deposite')).toLocaleString()} VNĐ` 
                      : "N/A"}
                  </Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  <AreaChartOutlined className="detail-icon" />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Area</Text>
                  <Text strong className="detail-value">
                    {getNestedValue(roomType, 'area') !== "N/A" 
                      ? `${getNestedValue(roomType, 'area')} m²` 
                      : "N/A"}
                  </Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  <AreaChartOutlined className="detail-icon" />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Square</Text>
                  <Text strong className="detail-value">
                    {getNestedValue(roomType, 'square') !== "N/A" 
                      ? `${getNestedValue(roomType, 'square')} m²` 
                      : "N/A"}
                  </Text>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  <TeamOutlined className="detail-icon" />
                </div>
                <div className="detail-content">
                  <Text type="secondary">Max Occupancy</Text>
                  <Text strong className="detail-value">
                    {getNestedValue(roomType, 'maxOccupancy') !== "N/A" 
                      ? `${getNestedValue(roomType, 'maxOccupancy')} people` 
                      : "N/A"}
                  </Text>
                </div>
              </div>
            </div>
            
            <div className="address-container">
              <div className="detail-icon-wrapper">
                <EnvironmentOutlined className="address-icon" />
              </div>
              <div className="address-content">
                <Text type="secondary">Address</Text>
                <Text strong className="address-value">
                  {getNestedValue(roomType, 'address') !== "N/A" ? (
                    `${getNestedValue(roomType, 'address.houseNumber', '')}, 
                     ${getNestedValue(roomType, 'address.street', '')}, 
                     ${getNestedValue(roomType, 'address.district', '')}, 
                     ${getNestedValue(roomType, 'address.city', '')}`
                  ) : "N/A"}
                </Text>
              </div>
            </div>
          </Card>

          <Card className="info-card">
            <Title level={4} className="card-title">Room Services</Title>
            <Divider className="card-divider" />
            {getNestedValue(roomType, 'roomServices', []).length > 0 ? (
              <ul className="services-list">
                {roomType.roomServices.map((service) => (
                  <li
                    key={getNestedValue(service, 'roomServiceId', `service-${Math.random()}`)}
                    className="service-item"
                  >
                    <Badge
                      status={getNestedValue(service, 'status') === "Active" ? "success" : "error"}
                      text={<Text strong className="service-name">{getNestedValue(service, 'roomServiceName')}</Text>}
                    />
                    <Paragraph className="service-description">
                      {getNestedValue(service, 'description')}
                    </Paragraph>
                    <div className="service-price-container">
                      <Text strong className="service-price-label">Price:</Text>
                      <Text className="service-price">
                        {getNestedValue(service, 'price') !== "N/A"
                          ? `${parseFloat(getNestedValue(service, 'price')).toLocaleString()} VNĐ`
                          : "N/A"}
                      </Text>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty description="No services available for this room type" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeDetail;