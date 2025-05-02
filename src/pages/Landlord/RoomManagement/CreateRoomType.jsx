import React, { useState, useEffect } from "react";
import { 
  Form, Input, Button, InputNumber, message, Card, Row, Col, Typography, Spin, 
  Divider, Space, Tag, Tooltip
} from "antd";
import { useNavigate } from "react-router-dom";
import { 
  PlusOutlined, MinusCircleOutlined, EnvironmentOutlined, 
  InfoCircleOutlined, HomeOutlined, DollarOutlined, TeamOutlined,
  AreaChartOutlined, AppstoreOutlined, BarsOutlined
} from "@ant-design/icons";
import { createRoomTypeAPI } from "../../../Services/Lanlord/RoomApi";
import { toast } from 'react-toastify'; // Import toastify

const { Title, Text, Paragraph } = Typography;

const CreateRoomType = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [roomServices, setRoomServices] = useState([{ roomServiceName: "", description: "", price: 0 }]);
  const [address, setAddress] = useState({
    houseNumber: "",
    street: "",
    district: "Thu Duc", // Hard-coded district
    city: "Ho Chi Minh", // Hard-coded city
  });
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  // Set initial form values for district and city
  useEffect(() => {
    form.setFieldsValue({
      district: "Thu Duc",
      city: "Ho Chi Minh"
    });
  }, [form]);

  // Watch address fields to update the map
  useEffect(() => {
    const debounce = setTimeout(() => {
      const houseNumber = form.getFieldValue('houseNumber') || "";
      const street = form.getFieldValue('street') || "";
      const district = form.getFieldValue('district') || "Thu Duc"; // Use hard-coded value
      const city = form.getFieldValue('city') || "Ho Chi Minh"; // Use hard-coded value
      
      // Only update map if we have enough address information
      if (houseNumber && street) {
        handleMapUpdate();
      }
    }, 1000); // Debounce map updates by 1 second
    
    return () => clearTimeout(debounce);
  }, [form.getFieldValue('houseNumber'), form.getFieldValue('street')]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // For district and city, always use the hard-coded values
    if (name === 'district' || name === 'city') return;
    
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
    
    // Set the form field value to ensure it's updated
    form.setFieldsValue({
      [name]: value
    });
  };

  const handleRoomServiceChange = (index, event) => {
    const updatedRoomServices = [...roomServices];
    
    // Check if this is a direct event or a value from InputNumber
    if (event.target) {
      // This is a regular input event
      updatedRoomServices[index][event.target.name] = event.target.value;
    } else {
      // This is a value from InputNumber component
      updatedRoomServices[index].price = event;
    }
    
    setRoomServices(updatedRoomServices);
  };

  const addRoomService = () => {
    setRoomServices([...roomServices, { roomServiceName: "", description: "", price: 0 }]);
  };

  const removeRoomService = (index) => {
    const updatedRoomServices = roomServices.filter((_, i) => i !== index);
    setRoomServices(updatedRoomServices);
  };


const handleSubmit = async (values) => {
  // Always use hard-coded values for district and city
  values.district = "Thu Duc";
  values.city = "Ho Chi Minh";
  
  // Get coordinates from state if not in form values
  const lat = form.getFieldValue('lat') || (coordinates ? coordinates.lat : null);
  const long = form.getFieldValue('long') || (coordinates ? coordinates.lng : null);

  // Include coordinates in form data
  const data = {
    ...values,
    lat,
    long,
    location: {
      long,
      lat,
      houseNumber: values.houseNumber,
      street: values.street,
      district: "Thu Duc", // Always use hard-coded district
      city: "Ho Chi Minh", // Always use hard-coded city
    },
    listRoomServices: roomServices.map((service) => ({
      roomServiceName: service.roomServiceName,
      description: service.description,
      price: { price: parseFloat(service.price) || 0 },
    })),
  };

  setLoading(true);
  try {
    const response = await createRoomTypeAPI(data);
    
    // Show success toast
    toast.success("Room Type Created Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Navigate to the room type list page
    navigate("/landlord/roomtype");
  } catch (error) {
    // Show error toast
    toast.error("Error creating Room Type", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
};

  const handleMapUpdate = async () => {
    // Get current address values from the form
    const houseNumber = form.getFieldValue('houseNumber') || "";
    const street = form.getFieldValue('street') || "";
    const district = "Thu Duc"; // Always use hard-coded district
    const city = "Ho Chi Minh"; // Always use hard-coded city
    
    const fullAddress = `${houseNumber}, ${street}, ${district}, ${city}`;

    if (houseNumber && street) {
      try {
        setMapLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0]; // OpenStreetMap returns 'lon' instead of 'lng'
          setCoordinates({ lat, lng: lon });
          
          // Update the hidden form values for lat and long
          form.setFieldsValue({
            lat: lat,
            long: lon
          });
          
          // Create a proper bounding box for the map
          const latNum = parseFloat(lat);
          const lonNum = parseFloat(lon);
          // Create proper bounds with correct spacing and formatting
          const bbox = `${lonNum - 0.005},${latNum - 0.005},${lonNum + 0.005},${latNum + 0.005}`;
          
          // Set up the map URL with correct formatting for OpenStreetMap embed
          setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat},${lon}&layers=M`);
          
          setError("");
        } else {
          setError("Location not found. Please enter a more accurate address.");
          setCoordinates(null);
          setMapUrl("");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Error calling geocoding API");
        setCoordinates(null);
        setMapUrl("");
      } finally {
        setMapLoading(false);
      }
    } else {
      // Not enough address information yet
      setMapUrl("");
    }
  };

  // Render the map using an iframe
  const renderMap = () => {
    if (!mapUrl) return null;
    
    return (
      <div className="map-container">
        <iframe
          title="Location Map"
          width="100%"
          height="300"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapUrl}
          style={{ borderRadius: '12px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)' }}
        ></iframe>
        {coordinates && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Tag color="blue" icon={<EnvironmentOutlined />}>
              Location: {parseFloat(coordinates?.lat).toFixed(6)}, {parseFloat(coordinates?.lng).toFixed(6)}
            </Tag>
          </div>
        )}
      </div>
    );
  };

  const validatePrice = (_, value) => {
    if (value === undefined || value === null) {
      return Promise.reject("Price is required");
    }
    
    if (value <= 0) {
      return Promise.reject("Price must be greater than 0");
    }
    
    return Promise.resolve();
  };

  return (
    <div className="create-room-type-form">
      <Card 
        className="form-card" 
        bordered={false}
      >
        <div className="card-header-container">
          <Title level={2} className="card-header-title">
              🏡Create New Room Type
          </Title>
          <Paragraph className="card-header-description">
            Complete the form below to add a new room type to your property listings.
          </Paragraph>
        </div>
        
        <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark="optional">
          {/* Hidden fields for lat/long that will be submitted with the form */}
          <Form.Item name="lat" hidden={true}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="long" hidden={true}>
            <InputNumber />
          </Form.Item>
          
          <Row gutter={24}>
            <Col span={24} md={12}>
              <Card 
                title={
                  <Space>
                    <AppstoreOutlined className="card-icon" />
                    <span>Basic Information</span>
                  </Space>
                } 
                className="section-card"
              >
                <Form.Item 
                  label="Room Type Name" 
                  name="roomTypeName" 
                  rules={[{ required: true, message: "Room Type Name is required" }]}
                >
                  <Input prefix={<HomeOutlined />} placeholder="Enter room type name" />
                </Form.Item>

                <Form.Item 
                  label="Description" 
                  name="description" 
                  rules={[{ required: true, message: "Description is required" }]}
                >
                  <Input.TextArea 
                    placeholder="Enter description" 
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      label="Area (m²)" 
                      name="area" 
                      rules={[{ required: true, message: "Area is required" }]}
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter area" 
                        style={{ width: "100%" }} 
                        addonAfter="m²"
                        prefix={<AreaChartOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label="Square" 
                      name="square" 
                      tooltip={{ title: "Enter the square footage of the room", icon: <InfoCircleOutlined /> }}
                      rules={[{ required: true, message: "Square is required" }]}
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter square" 
                        style={{ width: "100%" }} 
                        prefix={<AreaChartOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                  <Form.Item 
                      label="Deposit (VND)" 
                      name="deposite" 
                      rules={[{ required: true, message: "Deposit is required" }]}
                    >
                      <InputNumber 
                        min={0} 
                        placeholder="Enter deposit" Price 
                        style={{ width: "100%" }}
                        formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/₫\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label="Max Occupancy" 
                      name="maxOccupancy" 
                      rules={[{ required: true, message: "Max Occupancy is required" }]}
                    >
                      <InputNumber 
                        min={1} 
                        placeholder="Enter max occupancy" 
                        style={{ width: "100%" }} 
                        prefix={<TeamOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24} md={12}>
              <Card 
                title={
                  <Space>
                    <EnvironmentOutlined className="card-icon" />
                    <span>Location Information</span>
                  </Space>
                } 
                className="section-card"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      label="House Number" 
                      name="houseNumber" 
                      rules={[{ required: true, message: "House Number is required" }]}
                    >
                      <Input 
                        placeholder="Enter house number" 
                        onChange={handleAddressChange} 
                        name="houseNumber"
                        prefix={<HomeOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label="Street" 
                      name="street" 
                      rules={[{ required: true, message: "Street is required" }]}
                    >
                      <Input 
                        placeholder="Enter street" 
                        onChange={handleAddressChange} 
                        name="street"
                        prefix={<EnvironmentOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      label="District" 
                      name="district" 
                      rules={[{ required: true, message: "District is required" }]}
                    >
                      <Input 
                        placeholder="Thu Duc" 
                        value="Thu Duc"
                        disabled
                        prefix={<EnvironmentOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item 
                      label="City" 
                      name="city" 
                      rules={[{ required: true, message: "City is required" }]}
                    >
                      <Input 
                        placeholder="Ho Chi Minh" 
                        value="Ho Chi Minh"
                        disabled
                        prefix={<EnvironmentOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Button 
                  type="primary" 
                  onClick={handleMapUpdate} 
                  style={{ marginBottom: "20px", width: "100%" }}
                  icon={<EnvironmentOutlined />}
                  loading={mapLoading}
                >
                  {mapLoading ? "Getting Location..." : "Get Location from Address"}
                </Button>

                {error && <Text type="danger" style={{ display: 'block', marginBottom: '16px' }}>{error}</Text>}

                {/* Map Display */}
                {mapLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin tip="Loading map..." size="large" />
                  </div>
                ) : (
                  renderMap()
                )}
              </Card>
            </Col>
          </Row>

<Card 
  title={
    <Space>
      <BarsOutlined className="card-icon" />
      <span>Room Services</span>
    </Space>
  } 
  className="section-card" 
  style={{ marginTop: '24px' }}
  extra={
    <Tooltip title="Add services that are included with this room type">
      <InfoCircleOutlined />
    </Tooltip>
  }
>
  {roomServices.map((roomService, index) => (
    <Card 
      key={index}
      className="room-service-card"
      size="small"
      title={
        <Space>
          <span className="service-number">{index + 1}</span>
          <span>Room Service</span>
        </Space>
      }
      extra={
        <Button 
          type="text" 
          danger 
          icon={<MinusCircleOutlined />} 
          onClick={() => removeRoomService(index)}
        >
          Remove
        </Button>
      }
    >
      <Row gutter={16}>
        <Col span={24} md={8}>
          <Form.Item 
            label="Service Name" 
            rules={[{ required: true, message: "Service name is required" }]}
          >
            <Input
              name="roomServiceName"
              value={roomService.roomServiceName}
              onChange={(e) => {
                const updatedServices = [...roomServices];
                updatedServices[index].roomServiceName = e.target.value;
                setRoomServices(updatedServices);
              }}
              placeholder="Enter service name"
            />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item 
            label="Description" 
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input
              name="description"
              value={roomService.description}
              onChange={(e) => {
                const updatedServices = [...roomServices];
                updatedServices[index].description = e.target.value;
                setRoomServices(updatedServices);
              }}
              placeholder="Enter service description"
            />
          </Form.Item>
        </Col>
        <Col span={24} md={8}>
          <Form.Item 
            label="Price (VND)" 
            rules={[{ required: true, message: "Price is required" }]}
          >
            <InputNumber
              min={0.01}
              value={roomService.price}
              onChange={(value) => {
                const updatedServices = [...roomServices];
                updatedServices[index].price = value;
                setRoomServices(updatedServices);
              }}
              placeholder="Enter service price"
              style={{ width: "100%" }}
              formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/₫\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  ))}

  <Button 
    type="dashed" 
    onClick={addRoomService} 
    block 
    icon={<PlusOutlined />}
    style={{ marginTop: '16px' }}
    className="add-service-button"
  >
    Add Room Service
  </Button>
</Card>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
              className="submit-button"
              icon={loading ? null : <HomeOutlined />}
            >
              {loading ? "Creating Room Type..." : "Create Room Type"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateRoomType;