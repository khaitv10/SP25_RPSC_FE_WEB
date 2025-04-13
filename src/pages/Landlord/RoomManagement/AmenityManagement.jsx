import React, { useState, useEffect } from "react";
import { 
  message, 
  Card, 
  Button, 
  Spin, 
  Empty, 
  Tag, 
  Skeleton,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber
} from "antd";
import { 
  PlusOutlined, 
  AppstoreOutlined, 
  DollarOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { getAllAmenities, createAmenity } from "../../../Services/Landlord/amenityAPI";  
import "./AmenityManagement.scss";

const { Title, Text } = Typography;

const AmenityManagement = () => {
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async (searchQuery = "", pageIndex = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllAmenities(searchQuery, pageIndex, pageSize);
      console.log("Fetched Amenities Data: ", response);

      if (response?.amenties && Array.isArray(response.amenties)) {
        setAmenities(response.amenties);
      } else {
        message.error("Invalid data format: Expected 'amenties' array");
      }
    } catch (error) {
      message.error("Error fetching amenities");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAmenity = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      setSubmitting(true);
      
      // Prepare data according to the API request model
      const amenityData = {
        name: values.name,
        compensation: values.compensation
      };
      
      // Call the create API
      const response = await createAmenity(amenityData);
      
      // Show success message
      message.success("Amenity created successfully!");
      
      // Close modal and reset form
      setIsAmenityModalOpen(false);
      form.resetFields();
      
      // Refresh the amenities list
      fetchAmenities();
      
    } catch (error) {
      if (error.errorInfo) {
        // This is a form validation error
        console.log("Form validation failed:", error);
      } else {
        // This is an API error
        message.error("Failed to create amenity: " + (error.message || "Unknown error"));
        console.error("API Error:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAmenityModalOpen(false);
    form.resetFields();
  };

  const getStatusTag = (status) => {
    if (status.toLowerCase() === "active") {
      return <Tag color="success" icon={<CheckCircleOutlined />}>{status}</Tag>;
    } else {
      return <Tag color="error" icon={<CloseCircleOutlined />}>{status}</Tag>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(null).map((_, index) => (
      <Card key={`skeleton-${index}`} className="amenity-card">
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </Card>
    ));
  };

  return (
    <div className="amenity-management">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Title level={2} className="title">
            <span className="icon">✨</span> My Amenities
          </Title>
          <Text type="secondary" className="subtitle">
            Manage your property amenities in one place
          </Text>
        </div>
        
        <div className="action-buttons">
          <Button 
            className="view-toggle-btn"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            icon={viewMode === "grid" ? <UnorderedListOutlined /> : <AppstoreOutlined />}
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
          
          <Button 
            type="primary" 
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsAmenityModalOpen(true)}
            className="create-btn"
          >
            Create New Amenity
          </Button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="stats-overview">
        <Card className="stat-card">
          <div className="stat-icon total-icon">
            <AppstoreOutlined />
          </div>
          <div className="stat-content">
            <Text type="secondary">Total Amenities</Text>
            <Title level={3}>{amenities.length}</Title>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon active-icon">
            <CheckCircleOutlined />
          </div>
          <div className="stat-content">
            <Text type="secondary">Active</Text>
            <Title level={3}>
              {amenities.filter(item => item.status?.toLowerCase() === "active").length}
            </Title>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon inactive-icon">
            <CloseCircleOutlined />
          </div>
          <div className="stat-content">
            <Text type="secondary">Inactive</Text>
            <Title level={3}>
              {amenities.filter(item => item.status?.toLowerCase() !== "active").length}
            </Title>
          </div>
        </Card>
      </div>

      {/* Amenities List */}
      <div className={`amenity-container ${viewMode}-view`}>
        {loading ? (
          renderSkeletons()
        ) : amenities.length === 0 ? (
          <Empty 
            description="No amenities found" 
            className="empty-state"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          amenities.map((amenity) => (
            <Card
              key={amenity.roomAmentyId}
              className="amenity-card"
              hoverable
              actions={[
                <Button type="text" key="edit">Edit</Button>,
                <Button type="text" danger key="delete">Delete</Button>
              ]}
            >
              <div className="amenity-header">
                <div className="amenity-icon">
                  {amenity.name?.charAt(0) || "A"}
                </div>
                <div className="amenity-title">
                  <Title level={4}>{amenity.name}</Title>
                  {getStatusTag(amenity.status || "Inactive")}
                </div>
              </div>
              
              <div className="amenity-details">
                <div className="detail-item">
                  <DollarOutlined className="detail-icon" />
                  <div className="detail-content">
                    <Text type="secondary">Compensation</Text>
                    <Text strong className="compensation">
                      {formatCurrency(amenity.compensation || 0)}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Amenity Modal */}
      <Modal
        title={
          <div className="modal-title">
            <PlusOutlined className="modal-icon" />
            <span>Create New Amenity</span>
          </div>
        }
        open={isAmenityModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={submitting} 
            onClick={handleCreateAmenity}
          >
            Create
          </Button>
        ]}
        className="amenity-modal"
      >
        <Form
          form={form}
          layout="vertical"
          className="amenity-form"
        >
          <Form.Item
            name="name"
            label="Amenity Name"
            rules={[
              { required: true, message: 'Please enter the amenity name' },
              { max: 100, message: 'Name cannot exceed 100 characters' }
            ]}
          >
            <Input placeholder="Enter amenity name" />
          </Form.Item>

          <Form.Item
            name="compensation"
            label="Compensation (VNĐ)"
            rules={[
              { required: true, message: 'Please enter the compensation amount' },
              { type: 'number', min: 0, message: 'Compensation must be a positive value' }
            ]}
          >
            <InputNumber 
              placeholder="Enter compensation amount" 
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AmenityManagement;