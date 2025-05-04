import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, InputNumber, Upload, Select, Spin, Typography, Space, Card, Modal } from "antd";
import { 
  UploadOutlined, 
  ArrowLeftOutlined, 
  HomeOutlined, 
  DollarOutlined,
  PlusOutlined
} from "@ant-design/icons";
import roomRentalService from "../../../Services/Landlord/roomAPI";
import { getAllAmenities, createAmenity } from "../../../Services/Landlord/amenityAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RoomCreate.scss";

const { Option } = Select;
const { Title, Text } = Typography;

const RoomCreate = () => {
  const [loading, setLoading] = useState(false);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [form] = Form.useForm();
  const [amenityForm] = Form.useForm();
  const { roomTypeId } = useParams();
  const [amenities, setAmenities] = useState([]);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingAmenity, setCreatingAmenity] = useState(false);

  // Fetch amenities when component loads
  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    setLoadingAmenities(true);
    try {
      const data = await getAllAmenities();
      setAmenities(data.amenties);
    } catch (error) {
      toast.error("Error fetching amenities");
      console.error("Error:", error);
    } finally {
      setLoadingAmenities(false);
    }
  };

  // Update roomtypeId value in form
  useEffect(() => {
    form.setFieldsValue({
      roomtypeId: roomTypeId,
      // Set default hidden location
      location: "Thủ Đức, Hồ Chí Minh"
    });
  }, [roomTypeId, form]);

  // Handle file change
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
  
      // Append form values to FormData
      formData.append("RoomNumber", values.roomNumber);
      formData.append("roomtypeId", values.roomtypeId);
      formData.append("price", values.price);
      formData.append("Location", values.location); // Hidden default value
  
      // Append images to FormData
      if (fileList && fileList.length > 0) {
        fileList.forEach(file => {
          if (file.originFileObj) {
            formData.append("Images", file.originFileObj);
          }
        });
      } else {
        toast.error("Images field is required.");
        setLoading(false);
        return;
      }
  
      // Append amenities to FormData
      if (Array.isArray(values.AmentyId) && values.AmentyId.length > 0) {
        values.AmentyId.forEach(amentyId => {
          formData.append("AmentyId", amentyId);
        });
      } else {
        toast.error("At least one amenity is required.");
        setLoading(false);
        return;
      }
  
      // Submit the form data
      const response = await roomRentalService.createRoom(formData);
      if (response?.isSuccess) {
        toast.success("Room created successfully!");
        form.resetFields();
        setFileList([]);
        // Navigate back after a short delay WITH roomTypeId preserved
        setTimeout(() => navigate(`/landlord/roomtype/room?roomType=${roomTypeId}`), 2000);
      } else {
        // Show more specific error message from the API if available
        toast.error(response?.message || "Failed to create room!");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      
      // Handle API error response
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        toast.error(errorData.message || "Error creating room");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fixed navigateBack function that preserves the roomTypeId in the URL
  const navigateBack = () => {
    navigate(`/landlord/roomtype/room?roomType=${roomTypeId}`);
  };

  // Handle showing the create amenity modal
  const showCreateAmenityModal = () => {
    setIsModalVisible(true);
    amenityForm.resetFields();
  };

  // Handle creating a new amenity
  const handleCreateAmenity = async () => {
    try {
      const values = await amenityForm.validateFields();
      setCreatingAmenity(true);
      
      const amenityData = {
        Name: values.name,
        Compensation: values.compensation || 0
      };

      const newAmenity = await createAmenity(amenityData);
      
      // Update amenities list with new amenity
      await fetchAmenities();
      
      // Add the new amenity to the selected amenities in the form
      const currentAmenities = form.getFieldValue('AmentyId') || [];
      form.setFieldsValue({
        AmentyId: [...currentAmenities, newAmenity.roomAmentyId]
      });
      
      toast.success("Amenity created successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating amenity:", error);
      toast.error(error.message || "Failed to create amenity");
    } finally {
      setCreatingAmenity(false);
    }
  };

  return (
    <div className="room-create-container">
      {/* Add ToastContainer to render toasts */}
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
      
      <div className="room-create-header">
        <div className="header-left">
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={navigateBack}
            size="large"
            className="back-button"
          >
            Back to Room Management
          </Button>
        </div>
        <div className="header-right">
          <Title level={2} className="page-title">Create New Room</Title>
        </div>
      </div>
      
      <Card className="room-create-card">
        {loadingAmenities ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text>Loading amenities...</Text>
          </div>
        ) : (
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="room-form"
            requiredMark="optional"
          >
            <div className="form-section">
              <Title level={4} className="section-title">Basic Information</Title>
              
              <div className="form-row">
                <Form.Item 
                  label="Room Number" 
                  name="roomNumber" 
                  rules={[{ required: true, message: "Room number is required" }]}
                  className="form-col"
                >
                  <Input 
                    prefix={<HomeOutlined className="site-form-item-icon" />} 
                    placeholder="Enter room number" 
                    className="custom-input"
                    size="large"
                  />
                </Form.Item>

                <Form.Item 
                  label="Price (VND)" 
                  name="price" 
                  rules={[{ required: true, message: "Price is required" }]}
                  className="form-col"
                >
                  <InputNumber 
                    prefix={<DollarOutlined className="site-form-item-icon" />} 
                    placeholder="Enter room price" 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: "100%" }} 
                    className="custom-input"
                    size="large"
                  />
                </Form.Item>
              </div>

              {/* Hidden field for Location with default value */}
              <Form.Item name="location" hidden>
                <Input />
              </Form.Item>
            </div>

            {/* Hidden field for roomtypeId */}
            <Form.Item name="roomtypeId" style={{ display: "none" }}>
              <Input />
            </Form.Item>

            <div className="form-section">
              <Title level={4} className="section-title">Room Images</Title>
              <Text type="secondary" className="section-description">
                High-quality images help potential tenants better understand the room.
              </Text>
              
              <Form.Item 
                name="images"
                rules={[{ required: true, message: "At least one image is required" }]}
                className="full-width"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false} // Prevent auto upload
                  multiple
                  className="image-uploader"
                >
                  <div className="upload-button">
                    <UploadOutlined style={{ fontSize: '24px' }} />
                    <div style={{ marginTop: 8 }}>Upload Images</div>
                  </div>
                </Upload>
              </Form.Item>
            </div>

            <div className="form-section">
              <div className="amenities-header">
                <Title level={4} className="section-title">Room Amenities</Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={showCreateAmenityModal}
                  className="add-amenity-button"
                >
                  Add New Amenity
                </Button>
              </div>
              <Text type="secondary" className="section-description">
                Select all amenities that are included with this room.
              </Text>
              
              <Form.Item 
                name="AmentyId"
                rules={[{ required: true, message: "At least one amenity is required" }]}
                className="full-width"
              >
                <Select 
                  mode="multiple" 
                  placeholder="Select amenities"
                  className="custom-select"
                  optionFilterProp="children"
                  showSearch
                  size="large"
                >
                  {amenities.map((amenity) => (
                    <Option key={amenity.roomAmentyId} value={amenity.roomAmentyId}>
                  {amenity.name} {amenity.compensation > 0 && `(${amenity.compensation.toLocaleString()} VNĐ)`}
                </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-actions">
              <Space size="middle">
                <Button 
                  onClick={navigateBack}
                  size="large"
                  className="cancel-button"
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  size="large"
                  className="submit-button"
                >
                  {loading ? "Creating..." : "Create Room"}
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Card>

      {/* Create Amenity Modal */}
      <Modal
        title="Create New Amenity"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="create" 
            type="primary" 
            onClick={handleCreateAmenity}
            loading={creatingAmenity}
          >
            Create
          </Button>
        ]}
      >
        <Form
          form={amenityForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Amenity Name"
            rules={[{ required: true, message: "Amenity name is required" }]}
          >
            <Input placeholder="Enter amenity name" />
          </Form.Item>
          <Form.Item
            name="compensation"
            label="Compensation (Optional)"
            rules={[
              { 
                type: 'number', 
                min: 0, 
                message: "Compensation must be a positive value" 
              }
            ]}
          >
            <InputNumber
              placeholder="Enter compensation amount"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomCreate;