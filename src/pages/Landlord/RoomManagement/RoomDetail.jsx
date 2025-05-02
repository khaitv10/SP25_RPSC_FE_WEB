import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, Button, Tag, Spin, Empty, Carousel, Descriptions, Divider, Typography,
  Image, Form, Input, InputNumber, Select, Upload, Popconfirm
} from "antd";
import { 
  HomeOutlined, DollarOutlined, EnvironmentOutlined, AppstoreOutlined,
  CheckCircleOutlined, BankOutlined, EditOutlined, SaveOutlined,
  CloseOutlined, PlusOutlined, StopOutlined, CheckOutlined
} from "@ant-design/icons";
import roomRentalService from "../../../Services/Landlord/roomAPI";
import { getAllAmenities } from "../../../Services/Landlord/amenityAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;
const { Option } = Select;

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [roomDetail, setRoomDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Room status change state
  const [changingStatus, setChangingStatus] = useState(false);

  const fetchAmenities = async () => {
    try {
      const result = await getAllAmenities("", 1, 100);
      setAmenitiesList(result.amenties || []);
    } catch (err) {
      console.error("Error fetching amenities:", err);
      toast.error("Failed to load amenities");
    }
  };

  const fetchRoomDetail = async () => {
    setLoading(true);
    try {
      const data = await roomRentalService.getRoomDetailByRoomId(roomId);
      
      if (data?.isSuccess && data?.data?.rooms && data.data.rooms.length > 0) {
        const room = data.data.rooms[0];
        setRoomDetail(room);
        
        // Initialize form with room data
        form.setFieldsValue({
          roomNumber: room.roomNumber,
          price: room.price,
          amentyIds: room.amenties?.map(a => a.roomAmentyId) || [],
        });
        
        // Initialize file list with existing images
        if (room.roomImages && room.roomImages.length > 0) {
          const initialFileList = room.roomImages.map((url, index) => ({
            uid: `-${index}`,
            name: `Image ${index + 1}`,
            status: 'done',
            url: url,
            thumbUrl: url,
          }));
          setFileList(initialFileList);
        }
      } else {
        setError("No room details found.");
      }
    } catch (err) {
      setError("Error loading room details.");
      console.error("Error:", err);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetail();
    fetchAmenities();
  }, [roomId]);
  
  const handleBackToManagement = () => {
    if (roomDetail?.roomTypeId) {
      navigate(`/landlord/roomtype/room?roomType=${roomDetail.roomTypeId}`);
    } else {
      navigate(-1);
    }
  };
  
  const handlePreview = (image) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Re-initialize form when entering edit mode
      form.setFieldsValue({
        roomNumber: roomDetail.roomNumber,
        price: roomDetail.price,
        amentyIds: roomDetail.amenties?.map(a => a.roomAmentyId) || [],
      });
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleUpdateRoom = async (values) => {
    setSubmitting(true);
    try {
      // Create FormData
      const formData = new FormData();
      
      // Add basic fields
      if (values.roomNumber) formData.append("RoomNumber", values.roomNumber);
      if (values.price) formData.append("Price", values.price);
      
      // Add amenities
      if (values.amentyIds?.length > 0) {
        values.amentyIds.forEach(id => formData.append("AmentyIds", id));
      }
      
      // Add new images
      const newImages = fileList.filter(file => file.originFileObj);
      newImages.forEach(file => formData.append("Images", file.originFileObj));
      
      const result = await roomRentalService.updateRoom(roomId, formData);
      
      if (result?.isSuccess) {
        toast.success('Room updated successfully!');
        setIsEditMode(false);
        fetchRoomDetail();
      } else {
        toast.error(`Failed to update room: ${result?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating room:", err);
      toast.error(`Failed to update room: ${err.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoomStatusChange = async () => {
    setChangingStatus(true);
    try {
      let result;
      
      if (roomDetail.status === "Available") {
        // Inactivate room
        result = await roomRentalService.inactiveRoom(roomId);
      } else if (roomDetail.status === "Inactive") {
        result = await roomRentalService.inactiveRoom(roomId);
        
      }
      
      if (result?.isSuccess) {
        const action = roomDetail.status === "Available" ? "inactivated" : "activated";
        toast.success(`Room has been ${action} successfully!`);
        fetchRoomDetail();
      } else {
        const action = roomDetail.status === "Available" ? "inactivate" : "activate";
        toast.error(`Failed to ${action} room: ${result?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error changing room status:", err);
      const action = roomDetail.status === "Available" ? "inactivate" : "activate";
      toast.error(`Failed to ${action} room: ${err.message || "Unknown error"}`);
    } finally {
      setChangingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col bg-gray-50">
        <Spin size="large" />
        <div className="mt-4 text-gray-600 font-medium">Loading room details...</div>
        <ToastContainer />
      </div>
    );
  }

  if (error || !roomDetail) {
    return (
      <div className="p-8 flex flex-col items-center bg-gray-50 min-h-screen">
        <div className="flex gap-4 self-start mb-6">
          <Button 
            icon={<AppstoreOutlined />} 
            onClick={handleBackToManagement}
            className="flex items-center bg-white hover:bg-gray-50 transition-all shadow-md"
            size="large"
          >
            Back to Room Management
          </Button>
        </div>
        <Empty 
          description={<span className="text-red-500 text-lg font-medium">{error || "No room details found"}</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
        <ToastContainer />
      </div>
    );
  }

  const statusColor = {
    "Available": "green",
    "Renting": "red",
    "Inactive": "orange"
  }[roomDetail.status] || "gray";
  
  // Check if room is available for editing (only Available rooms)
  const isEditable = roomDetail.status === "Available";
  
  // Check if room status can be changed (only Available or Inactive rooms)
  const canChangeStatus = ["Available", "Inactive"].includes(roomDetail.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex gap-4 mb-6 justify-between">
        <Button 
          icon={<AppstoreOutlined />} 
          onClick={handleBackToManagement}
          className="flex items-center bg-white hover:bg-gray-50 transition-all shadow-md"
          size="large"
        >
          Back to Room Management
        </Button>
        
        <div className="flex gap-4">
          {canChangeStatus && (
            <Popconfirm
              title={`${roomDetail.status === "Available" ? "Inactivate" : "Activate"} Room`}
              description={`Are you sure you want to ${roomDetail.status === "Available" ? "mark this room as inactive" : "activate this room"}?`}
              onConfirm={handleRoomStatusChange}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ 
                loading: changingStatus,
                danger: roomDetail.status === "Available"
              }}
            >
              <Button
                type="primary"
                danger={roomDetail.status === "Available"}
                icon={roomDetail.status === "Available" ? <StopOutlined /> : <CheckOutlined />}
                loading={changingStatus}
                size="large"
                className={`shadow-md ${roomDetail.status === "Inactive" ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {roomDetail.status === "Available" ? "Inactivate Room" : "Activate Room"}
              </Button>
            </Popconfirm>
          )}
          
          {isEditable && !isEditMode && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={toggleEditMode}
              size="large"
              className="bg-blue-500 hover:bg-blue-600 transition-all shadow-md"
            >
              Edit Room
            </Button>
          )}
          
          {isEditMode && (
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={toggleEditMode}
              size="large"
              className="bg-white hover:bg-gray-50 transition-all shadow-md"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </div>
      
      {isEditMode ? (
        // Edit Form
        <Card 
          className="rounded-2xl shadow-xl overflow-hidden border-0 animate__animated animate__fadeIn"
          title={
            <div className="flex items-center py-2">
              <span className="inline-block w-2 h-6 bg-blue-500 rounded mr-3"></span>
              <Title level={4} className="m-0 text-gray-800">Edit Room {roomDetail.roomNumber}</Title>
            </div>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateRoom}
            initialValues={{
              roomNumber: roomDetail.roomNumber,
              price: roomDetail.price,
              amentyIds: roomDetail.amenties?.map(a => a.roomAmentyId) || []
            }}
            className="p-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="roomNumber"
                label="Room Number"
                rules={[{ required: true, message: 'Please enter room number' }]}
              >
                <Input 
                  placeholder="Room Number" 
                  prefix={<HomeOutlined className="text-gray-400" />}
                  className="rounded-lg h-12" 
                />
              </Form.Item>
              
              <Form.Item
                name="price"
                label="Monthly Price (VNĐ)"
                rules={[{ required: true, message: 'Please enter room price' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Monthly Price"
                  min={0}
                  prefix={<DollarOutlined className="text-gray-400" />}
                  className="rounded-lg h-12"
                />
              </Form.Item>
            </div>

            <Divider orientation="left" className="my-6">
              <span className="text-gray-700 font-medium">Amenities</span>
            </Divider>
            
            <Form.Item name="amentyIds" label="Room Amenities">
              <Select
                mode="multiple"
                placeholder="Select room amenities"
                style={{ width: '100%' }}
                optionFilterProp="children"
                className="rounded-lg"
                listHeight={300}
              >
                {amenitiesList.map(amenity => (
                  <Option key={amenity.roomAmentyId} value={amenity.roomAmentyId}>
                    {amenity.name} {amenity.compensation > 0 && `(${amenity.compensation.toLocaleString()} VNĐ)`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider orientation="left" className="my-6">
              <span className="text-gray-700 font-medium">Room Images</span>
            </Divider>
            
            <Form.Item label="Room Images">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                onPreview={file => handlePreview(file.url || file.thumbUrl)}
                beforeUpload={() => false} // Prevent auto upload
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
              <div className="text-gray-500 text-sm mt-2">
                * Upload new images only if you want to add to the existing ones. Existing images will be preserved.
              </div>
            </Form.Item>
            
            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={submitting}
                className="mr-4 h-12 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 transition-all"
              >
                Save Changes
              </Button>
              <Button
                onClick={toggleEditMode}
                size="large"
                icon={<CloseOutlined />}
                className="h-12 rounded-lg"
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        // Detail View
        <Card className="rounded-2xl shadow-xl overflow-hidden border-0 animate__animated animate__fadeIn" bodyStyle={{ padding: 0 }}>
          {/* Room Image Carousel */}
          <div className="relative">
            {roomDetail.roomImages && roomDetail.roomImages.length > 0 ? (
              <Carousel 
                autoplay 
                className="h-[500px] lg:h-[600px]"
                arrows
                dots={{ className: "custom-dots" }}
                effect="fade"
              >
                {roomDetail.roomImages.map((image, index) => (
                  <div key={index} onClick={() => handlePreview(image)}>
                    <div className="h-[500px] lg:h-[600px] w-full relative group cursor-pointer">
                      <img 
                        src={image} 
                        alt={`${roomDetail.roomNumber} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                          Click to view
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="h-[400px] bg-gray-100 flex items-center justify-center">
                <img
                  alt="No Image Available"
                  src="https://via.placeholder.com/800x400?text=No+Image"
                  className="max-w-full max-h-full"
                />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-5 right-5 z-10">
              <Tag 
                color={statusColor} 
                className="text-base py-1 px-4 rounded-full font-medium shadow-lg"
              >
                {roomDetail.status}
              </Tag>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="relative mb-2 sm:mb-0">
                <Title level={2} className="text-3xl font-bold text-gray-800 m-0">
                  Room {roomDetail.roomNumber}
                </Title>
                <div className="h-1 w-16 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="text-2xl font-bold text-green-500 bg-green-50 py-2 px-4 rounded-lg shadow-sm">
                {roomDetail.price?.toLocaleString()} VNĐ/month
              </div>
            </div>
            
            {/* Room Type Badge */}
            <div className="mb-6">
              <Tag 
                color="blue" 
                className="text-sm py-1 px-3 rounded-full"
                icon={<BankOutlined />}
              >
                {roomDetail.roomTypeName}
              </Tag>
            </div>
            
            {/* Room Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow hover:translate-y-[-4px] duration-300">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4">
                    <HomeOutlined className="text-blue-500 text-2xl" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Room Number</div>
                    <div className="text-xl font-bold text-gray-800 mt-1">{roomDetail.roomNumber}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow hover:translate-y-[-4px] duration-300">
                <div className="flex items-start">
                  <div className="bg-green-50 p-3 rounded-lg mr-4">
                    <DollarOutlined className="text-green-500 text-2xl" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Monthly Price</div>
                    <div className="text-xl font-bold text-green-600 mt-1">{roomDetail.price?.toLocaleString()} VNĐ</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow hover:translate-y-[-4px] duration-300">
                <div className="flex items-start">
                  <div className="bg-orange-50 p-3 rounded-lg mr-4">
                    <EnvironmentOutlined className="text-orange-500 text-2xl" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Location</div>
                    <div className="text-xl font-bold text-gray-800 mt-1">{roomDetail.location}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <Divider className="my-8" />
            
            {/* Details Section */}
            <div className="mb-8">
              <Title level={4} className="text-xl font-bold mb-6 pl-4 border-l-4 border-blue-500 flex items-center">
                <span className="bg-blue-50 p-2 rounded-lg mr-3">
                  <BankOutlined className="text-blue-500" />
                </span>
                Room Details
              </Title>
              
              <Descriptions 
                bordered 
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <Descriptions.Item 
                  label={<span className="font-medium">Room Type</span>}
                  labelStyle={{ background: "#f9fafb" }}
                >
                  {roomDetail.roomTypeName}
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={<span className="font-medium">Status</span>}
                  labelStyle={{ background: "#f9fafb" }}
                >
                  <Tag color={statusColor}>{roomDetail.status}</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={<span className="font-medium">Location</span>}
                  labelStyle={{ background: "#f9fafb" }}
                  span={2}
                >
                  {roomDetail.location}
                </Descriptions.Item>
              </Descriptions>
            </div>
            
            {/* Amenities Section */}
            {roomDetail.amenties && roomDetail.amenties.length > 0 && (
              <div className="mb-8">
                <Title level={4} className="text-xl font-bold mb-6 pl-4 border-l-4 border-green-500 flex items-center">
                  <span className="bg-green-50 p-2 rounded-lg mr-3">
                    <CheckCircleOutlined className="text-green-500" />
                  </span>
                  Amenities
                </Title>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomDetail.amenties.map((item) => (
                    <div 
                      key={item.roomAmentyId}
                      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:bg-blue-50 hover:translate-y-[-4px] duration-300"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                          <CheckCircleOutlined className="text-blue-500 text-xl" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-800 font-medium text-lg">{item.name}</div>
                          {item.compensation > 0 && (
                            <div className="mt-2">
                              <Tag color="green" className="text-sm py-1 px-2 rounded-lg">
                                {item.compensation.toLocaleString()} VNĐ
                              </Tag>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Image Preview */}
      <Image
        width={0}
        style={{ display: 'none' }}
        preview={{
          visible: previewVisible,
          onVisibleChange: (visible) => setPreviewVisible(visible),
          src: previewImage
        }}
      />
    </div>
  );
};

export default RoomDetail;