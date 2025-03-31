import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Space, Card, Typography, Input, Tooltip, message, Spin } from "antd";
import { EyeOutlined, SearchOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";
import { getRoomTypesByLandlordId } from "../../../Services/Landlord/roomTypeAPI";
import { useNavigate } from "react-router-dom";
import "./RoomTypeManagement.scss";

const { Title } = Typography;

const RoomTypeManagement = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("Available");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const navigate = useNavigate();

  const handleViewDetail = (roomTypeId) => {
    navigate(`/landlord/roomtype/${roomTypeId}`);
  };

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const data = await getRoomTypesByLandlordId();
      if (data?.roomTypes && Array.isArray(data.roomTypes)) {
        const filteredRoomTypes = activeTab === "All" 
          ? data.roomTypes 
          : data.roomTypes.filter(type => type.status === activeTab);

        const searchFilteredRoomTypes = searchText 
          ? filteredRoomTypes.filter(type => 
              type.roomTypeName.toLowerCase().includes(searchText.toLowerCase()) ||
              type.description.toLowerCase().includes(searchText.toLowerCase())
            )
          : filteredRoomTypes;

        setRoomTypes(searchFilteredRoomTypes);
        setPagination(prev => ({
          ...prev,
          total: searchFilteredRoomTypes.length || 0
        }));
      } else {
        message.error("Invalid data format: Expected 'roomTypes' array");
      }
    } catch (error) {
      message.error("Error fetching room types");
      console.error("Error fetching room types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [activeTab, pagination.current, pagination.pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.current === 1) {
        fetchRoomTypes();
      } else {
        setPagination(prev => ({
          ...prev,
          current: 1
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination
    });
  };

  const columns = [
    {
      title: "Room Type Name",
      dataIndex: "roomTypeName",
      key: "roomTypeName",
      render: (text) => <span className="cell-content room-type-name">{text}</span>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="cell-content description">{text?.length > 50 ? `${text.substring(0, 50)}...` : text}</span>
    },
    {
      title: "Deposit",
      dataIndex: "deposite",
      key: "deposite",
      render: (amount) => <span className="cell-content deposit">{typeof amount === 'number' ? amount.toLocaleString() : amount}</span>
    },
    {
      title: "Max Occupancy",
      dataIndex: "maxOccupancy",
      key: "maxOccupancy",
      render: (text) => <div className="occupancy-cell"><HomeOutlined className="occupancy-icon" /><span className="cell-content max-occupancy">{text}</span></div>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = { "Available": "green", "Inactive": "red", "Renting": "blue" };
        return <Tag className={`status-tag ${status?.toLowerCase()}`} color={colorMap[status] || "default"}>{status}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button shape="circle" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.roomTypeId)} />
        </Tooltip>
      ),
    }
  ];

  return (
    <div className="room-type-management">
      <Card className="room-type-card">
      <div className="title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} className="title">
            <span className="title-icon">🏡</span> My Room Types
          </Title>
          
          <Button type="default" icon={<HomeOutlined />} size="large" onClick={() => navigate('/landlord/room/amentities')} className="amenities-button">
            Amenities
          </Button>
        </div>

        <div className="room-type-tabs">
          {["Available", "Renting", "Inactive", "All"].map((status) => (
            <button key={status} className={`tab ${activeTab === status ? "active" : ""}`} onClick={() => setActiveTab(status)}>
              {status}
            </button>
          ))}
        </div>

        <div className="room-type-actions">
          <div className="search-container">
            <Input
              placeholder="Search by room type name or description"
              prefix={<SearchOutlined className="search-icon" />}
              onChange={handleSearch}
              className="search-input"
              value={searchText}
              allowClear
            />
          </div>

          <div className="action-buttons">
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/landlord/roomtype/create')} className="create-button">
              Create New Room Type
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={roomTypes}
            rowKey="roomTypeId"
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]}-${range[1]} on ${total} Room Types`,
            }}
            onChange={handleTableChange}
            loading={loading}
            className="room-types-table"
            rowClassName={(record) => 
              record.status === "Inactive" ? "inactive-row" : 
              record.status === "Renting" ? "renting-row" : ""
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default RoomTypeManagement;
