import React, { useState, useEffect } from "react";
import { 
  Form, Input, Button, InputNumber, Card, Row, Col, Typography, Spin, 
  Divider, Space, Tag, Tooltip, Modal
} from "antd";
import { 
  PlusOutlined, MinusCircleOutlined, EnvironmentOutlined, 
  InfoCircleOutlined, HomeOutlined, DollarOutlined, TeamOutlined,
  AreaChartOutlined, AppstoreOutlined, BarsOutlined
} from "@ant-design/icons";
import { updateRoomTypeAPI } from "../../../Services/Landlord/roomTypeAPI";
import { toast } from 'react-toastify';

const { Title, Text, Paragraph } = Typography;

const UpdateRoomType = ({ visible, onCancel, roomType, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [roomServices, setRoomServices] = useState([]);
  const [address, setAddress] = useState({
    houseNumber: "",
    street: "",
    district: "Thu Duc",
    city: "Ho Chi Minh",
  });
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (visible && roomType) {
      console.log("Setting form values with roomType:", roomType);
      
      // Set initial form values
      form.setFieldsValue({
        roomTypeName: roomType.roomTypeName,
        description: roomType.description,
        area: roomType.area,
        square: roomType.square,
        deposite: roomType.deposite,
        maxOccupancy: roomType.maxOccupancy,
        houseNumber: roomType.address?.houseNumber || "",
        street: roomType.address?.street || "",
        district: roomType.address?.district || "Thu Duc",
        city: roomType.address?.city || "Ho Chi Minh",
        lat: roomType.address?.lat,
        long: roomType.address?.long,
      });

      // Set room services with proper structure
      if (roomType.roomServices && Array.isArray(roomType.roomServices)) {
        const formattedServices = roomType.roomServices.map(service => ({
          roomServiceId: service.roomServiceId,
          roomServiceName: service.roomServiceName,
          description: service.description,
          price: service.price || 0,
          status: service.status
        }));
        console.log("Setting room services:", formattedServices);
        setRoomServices(formattedServices);
      }

      // Set coordinates and map
      if (roomType.address?.lat && roomType.address?.long) {
        const coords = {
          lat: roomType.address.lat,
          lng: roomType.address.long
        };
        console.log("Setting coordinates:", coords);
        setCoordinates(coords);
        updateMapUrl(roomType.address.lat, roomType.address.long);
      }

      // Set address state
      setAddress({
        houseNumber: roomType.address?.houseNumber || "",
        street: roomType.address?.street || "",
        district: roomType.address?.district || "Thu Duc",
        city: roomType.address?.city || "Ho Chi Minh"
      });
    }
  }, [visible, roomType, form]);

  const updateMapUrl = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const bbox = `${lonNum - 0.005},${latNum - 0.005},${lonNum + 0.005},${latNum + 0.005}`;
    setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat},${lon}&layers=M`);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district' || name === 'city') return;
    
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
    
    form.setFieldsValue({
      [name]: value
    });
  };

  const handleRoomServiceChange = (index, event) => {
    const updatedRoomServices = [...roomServices];
    if (event.target) {
      updatedRoomServices[index][event.target.name] = event.target.value;
    } else {
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
    values.district = "Thu Duc";
    values.city = "Ho Chi Minh";
    
    const lat = form.getFieldValue('lat') || (coordinates ? coordinates.lat : null);
    const long = form.getFieldValue('long') || (coordinates ? coordinates.lng : null);

    const data = {
      roomTypeId: roomType.roomTypeId,
      model: "RoomType", // Adding required model field
      ...values,
      lat,
      long,
      location: {
        long,
        lat,
        houseNumber: values.houseNumber,
        street: values.street,
        district: "Thu Duc",
        city: "Ho Chi Minh",
      },
      listRoomServices: roomServices.map((service) => ({
        roomServiceId: service.roomServiceId,
        roomServiceName: service.roomServiceName,
        description: service.description,
        price: { price: parseFloat(service.price) || 0 }, // Nested price object structure
      })),
    };

    setLoading(true);
    try {
      await updateRoomTypeAPI(data);
      toast.success("Room Type Updated Successfully!");
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(error.message || "Error updating Room Type");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapUpdate = async () => {
    const houseNumber = form.getFieldValue('houseNumber') || "";
    const street = form.getFieldValue('street') || "";
    const district = "Thu Duc";
    const city = "Ho Chi Minh";
    
    const fullAddress = `${houseNumber}, ${street}, ${district}, ${city}`;

    if (houseNumber && street) {
      try {
        setMapLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCoordinates({ lat, lng: lon });
          form.setFieldsValue({
            lat: lat,
            long: lon
          });
          updateMapUrl(lat, lon);
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
      setMapUrl("");
    }
  };

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

  return (
    <Modal
      title="Update Room Type"
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={null}
      destroyOnClose
    >
      <div className="update-room-type-form">
        <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark="optional">
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
                        placeholder="Enter deposit" 
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
                        onChange={(e) => handleRoomServiceChange(index, e)}
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
                        onChange={(e) => handleRoomServiceChange(index, e)}
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
                        onChange={(value) => handleRoomServiceChange(index, value)}
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
              {loading ? "Updating Room Type..." : "Update Room Type"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UpdateRoomType;