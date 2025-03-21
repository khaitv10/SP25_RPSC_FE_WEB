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
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CustomerModal from "../../components/Admin/CustomerModal";
import "./RentedRoomDetail.scss";
import defaultImage from "../../assets/room.jpg";
import defaultImage2 from "../../assets/image-login.png";
import defaultAvatar from "../../assets/avatar.jpg";

const { Title } = Typography;

const mockRoomData = {
  roomTitle: "Luxury Apartment",
  roomNumber: "A101",
  location: "Downtown, New York",
  square: 45,
  maxMembers: 4,
  price: "10,000,000",
  deposit: "5.000.000",
  status: "Rented",
  description:
    "A luxury apartment with modern design. " +
    "The package contains an Axios instance configuration for making HTTP requests. It includes settings for base URLs",
  tenants: [
    {
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      gender: "Male",
      avatar: defaultAvatar,
      address: "New York City",
      preferences: "Quiet environment",
      lifeStyle: "Night Owl",
      budgetRange: "$500 - $1000",
      preferredLocation: "Downtown",
      requirement: "No pets",
      role: "Person In Charge",
    },
    {
      fullName: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "987-654-3210",
      gender: "Female",
      avatar: defaultAvatar,
      address: "Brooklyn",
      preferences: "Pet-friendly",
      lifeStyle: "Early Bird",
      budgetRange: "$700 - $1200",
      preferredLocation: "Suburb",
      requirement: "Near public transport",
      role: "Member",
    },
  ],
  services: [
    { name: "Electricity", price: "5 VNĐ" },
    { name: "Parking", price: "30 VNĐ" },
  ],
  roomImageUrls: [defaultImage, defaultImage2],
};

const RentedRoomDetail = () => {
  // const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setRoom(mockRoomData);
      setLoading(false);
    }, 1000);
  }, []);

  const openTenantModal = (tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const closeTenantModal = () => {
    setIsModalOpen(false);
    setSelectedTenant(null);
  };

  if (loading) return <Spin size="large" className="loading-spinner" />;

  return (
    <div className="rented-room-detail-container">
      <Card className="rented-room-card-container">
        <Button
          type="default"
          className="back-button"
          onClick={() => navigate("/landlord/manage")}
        >
          <LeftOutlined /> Back
        </Button>

        <Title level={2} className="rented-room-title">
          Rented Room Details
        </Title>

        <div className="rented-room-content">
          <div className="rented-room-left">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Room">
                <strong>{room.roomTitle}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Room Number">
                <strong>{room.roomNumber}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                <strong>{room.location}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Square">
                <strong>{room.square} m²</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Max Members">
                <strong>{room.maxMembers}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <strong>{room.price} VNĐ</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Deposit">
                <strong>{room.deposit}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                <strong>{room.description}</strong>
              </Descriptions.Item>
            </Descriptions>

            {/* Services Section */}
            <div className="rented-room-services">
              <Title level={4} className="rented-room-services-title">
                Services
              </Title>
              <ul className="rented-room-service-list">
                {room.services.map((service, index) => (
                  <li key={index} className="rented-room-service-item">
                    <span className="rented-room-service-name">
                      {service.name}
                    </span>
                    <span className="rented-room-service-price">
                      {service.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rented-room-right">
            <div className="rented-room-image-container">
              <Image
                src={room.roomImageUrls[currentImageIndex]}
                className="rented-room-image"
                preview={false}
              />
              <Button
                icon={<LeftOutlined />}
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? room.roomImageUrls.length - 1 : prev - 1,
                  )
                }
                className="rented-room-image-nav left"
              />
              <Button
                icon={<RightOutlined />}
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === room.roomImageUrls.length - 1 ? 0 : prev + 1,
                  )
                }
                className="rented-room-image-nav right"
              />
            </div>
          </div>
        </div>

        <Title level={3} className="rented-room-tenants-title">
          Tenants
        </Title>
        <ul className="rented-room-tenant-list">
          {room.tenants.map((tenant, index) => (
            <li
              key={index}
              className="rented-room-tenant-item"
              onClick={() => openTenantModal(tenant)}
            >
              <Avatar
                src={tenant.avatar}
                size={60}
                className="rented-room-tenant-avatar"
              />
              <div className="rented-room-tenant-info">
                <span className="rented-room-tenant-name">
                  {tenant.fullName}
                </span>
              </div>
              <span className="rented-room-tenant-role">{tenant.role}</span>
            </li>
          ))}
        </ul>

        {/* Customer Modal */}
        <CustomerModal
          isOpen={isModalOpen}
          customer={selectedTenant}
          onClose={closeTenantModal}
        />
      </Card>
    </div>
  );
};

export default RentedRoomDetail;
