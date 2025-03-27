import { useState } from "react";
import {
  Modal,
  Input,
  // Button,
  Form,
  Row,
  Col,
  Typography,
  Divider,
  message,
} from "antd";
import RoomCard from "../../components/Landlord/RoomCard";
import "./RoomManagement.scss";
import { createRoomTypeAPI } from "../../Services/Lanlord/RoomApi";
import { AmenityCard } from "../../components/Landlord/AmentyCard";
import RoomTypeCard from "../../components/Landlord/RoomTypeCard";

const { Title } = Typography;

const rooms = [
  {
    id: 1,
    type: "Phòng cao cấp",
    area: "123 cm2",
    slot: 4,
    status: "Available",
    image: "room1.jpg",
  },
  {
    id: 2,
    type: "Phòng cao cấp",
    area: "123 cm2",
    slot: 4,
    status: "Available",
    image: "room2.jpg",
  },
  {
    id: 3,
    type: "Phòng cao cấp",
    area: "123 cm2",
    slot: 4,
    status: "Rented",
    image: "room3.jpg",
  },
  {
    id: 4,
    type: "Phòng cao cấp",
    area: "123 cm2",
    slot: 4,
    status: "Rented",
    image: "room4.jpg",
  },
  {
    id: 5,
    type: "Phòng cao cấp",
    area: "123 cm2",
    slot: 4,
    status: "Active",
    image: "room5.jpg",
  },
  {
    id: 6,
    type: "Phòng cao cấp",
    area: "123 cm2",
    slot: 4,
    status: "Active",
    image: "room6.jpg",
  },
];

const amenityList = [
  {
    RoomAmenityId: 1,
    Name: "điều hòa",
    Compensation: "100.000 vnđ",
  },
  {
    RoomAmenityId: 2,
    Name: "điều hòa",
    Compensation: "100.000 vnđ",
  },
  {
    RoomAmenityId: 3,
    Name: "điều hòa",
    Compensation: "100.000 vnđ",
  },
];

const roomTypeList = [
  {
    id: 1,
    name: "Phòng tiêu chuẩn",
    description: "Phòng đơn cơ bản với đầy đủ tiện nghi.",
  },
  {
    id: 2,
    name: "Phòng cao cấp",
    description: "Phòng đôi rộng rãi với ban công và view đẹp.",
  },
  {
    id: 3,
    name: "Phòng VIP",
    description:
      "Phòng sang trọng với nội thất hiện đại, đầy đủ tiện nghi cao cấp.",
  },
];
//=====================================================Modal==========================================================================================================

// ✅ Modal để tạo Amenity mới
// eslint-disable-next-line react/prop-types
const CreateAmenityModal = ({ isOpen, onClose, onSave }) => {
  const [amenity, setAmenity] = useState({ Name: "", Compensation: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAmenity({ ...amenity, [name]: value });
  };

  const handleSubmit = () => {
    if (!amenity.Name.trim() || !amenity.Compensation.trim()) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    onSave(amenity);
    onClose();
  };

  return (
    <Modal
      title="Create New Amenity"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      centered
    >
      <Form layout="vertical">
        <Form.Item label="Amenity Name">
          <Input name="Name" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Compensation">
          <Input name="Compensation" onChange={handleChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ✅ Modal để tạo Room  mới

// eslint-disable-next-line react/prop-types
const CreateRoomModal = ({ isOpen, onClose, onSave }) => {
  const [room, setRoom] = useState({ type: "", area: "", slot: 1 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleSubmit = () => {
    if (!room.type.trim() || !room.area.trim()) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    onSave(room);
    onClose();
  };

  return (
    <Modal
      title="Create New Room"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      centered
    >
      <Form layout="vertical">
        <Form.Item label="Room Type">
          <Input name="type" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Area">
          <Input name="area" onChange={handleChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// eslint-disable-next-line react/prop-types
const CreateRoomTypeModal = ({ isOpen, onClose, onSave }) => {
  const [roomTypeData, setRoomTypeData] = useState({
    roomTypeName: "",
    deposite: 0,
    area: 0,
    square: 0,
    description: "",
    maxOccupancy: 0,
    listRoomServices: [],
  });

  //================================================================Handle====================================================================================================================
  // eslint-disable-next-line no-unused-vars
  const [serviceCount, setServiceCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomTypeData({ ...roomTypeData, [name]: value });
  };

  const handleServiceCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setServiceCount(count);
    setRoomTypeData({
      ...roomTypeData,
      listRoomServices: Array.from({ length: count }, () => ({
        roomServiceName: "",
        description: "",
        price: { price: 0 },
      })),
    });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...roomTypeData.listRoomServices];
    updatedServices[index][field] =
      field === "price" ? { price: Number(value) } : value;
    setRoomTypeData({ ...roomTypeData, listRoomServices: updatedServices });
  };

  const handleSubmit = async () => {
    const token = getAccessToken();
    if (!token) return;

    // Kiểm tra các trường bắt buộc
    if (!roomTypeData.roomTypeName.trim()) {
      message.error("Room Type Name is required");
      return;
    }
    if (!roomTypeData.description.trim()) {
      message.error("Description is required");
      return;
    }

    const updatedRoomData = {
      ...roomTypeData,
      listRoomServices:
        roomTypeData.listRoomServices.length > 0
          ? roomTypeData.listRoomServices
          : [],
    };

    try {
      console.log("Dữ liệu gửi lên API:", updatedRoomData);
      await createRoomTypeAPI(updatedRoomData, token);
      message.success("Room created successfully!");
      onSave(updatedRoomData);
      onClose();
    } catch (error) {
      console.error("Lỗi tạo phòng:", error);
      message.error("Error creating room");
    }
  };

  //=====================================================================================================================================================================

  const getAccessToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <Modal
      title="Create New Room Type"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      centered
      width={900}
    >
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Room Type">
              <Input name="roomTypeName" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Deposit">
              <Input type="number" name="deposite" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Area">
              <Input type="number" name="area" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Square">
              <Input type="number" name="square" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Description">
          <Input.TextArea name="description" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Max Occupancy">
          <Input type="number" name="maxOccupancy" onChange={handleChange} />
        </Form.Item>
        <Divider />
        <Form.Item label="Number of Services">
          <Input type="number" onChange={handleServiceCountChange} />
        </Form.Item>
        <Row gutter={24}>
          {roomTypeData.listRoomServices.map((service, index) => (
            <Col span={12} key={index}>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <Title level={5}>Service {index + 1}</Title>
                <Form.Item label="Service Name">
                  <Input
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "roomServiceName",
                        e.target.value,
                      )
                    }
                  />
                </Form.Item>
                <Form.Item label="Description">
                  <Input.TextArea
                    onChange={(e) =>
                      handleServiceChange(index, "description", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Price">
                  <Input
                    type="number"
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </Form.Item>
              </div>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  const [roomList, setRoomList] = useState(rooms);

  const handleSaveRoom = (newRoom) => {
    setRoomList([...roomList, { id: roomList.length + 1, ...newRoom }]);
  };

  return (
    <div className="room-management">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-4xl font-bold flex items-center">✨ My Amenity</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ml-6"
          onClick={() => setIsAmenityModalOpen(true)}
        >
          Create New Amenity
        </button>
      </div>
      <div className="amenity-list flex justify-center gap-6">
        {amenityList.map((amenity) => (
          <AmenityCard key={amenity.RoomAmenityId} amenity={amenity} />
        ))}
      </div>

      {/* My Room Type */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-4xl font-bold flex items-center">
          🏡 My Room Type
        </h2>
        <button
          type="primary"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ml-6"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Room Type
        </button>
      </div>
      <div className="room-type-list flex flex-wrap justify-start gap-6">
        {roomTypeList.map((roomType) => (
          <RoomTypeCard key={roomType.id} roomType={roomType} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 mt-6">
        <h2 className="text-4xl font-bold flex items-center">🏠 My Room</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ml-6"
          onClick={() => setIsRoomModalOpen(true)}
        >
          Create New Room
        </button>
      </div>
      <div className="room-list">
        {roomList.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      {/* <Button
        type="primary"
        className="create-room-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Create new room
      </Button> */}
      <CreateAmenityModal
        isOpen={isAmenityModalOpen}
        onClose={() => setIsAmenityModalOpen(false)}
        onSave={handleSaveRoom}
      />
      <CreateRoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
      />
      <CreateRoomTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
      />
    </div>
  );
};

export default RoomManagement;
