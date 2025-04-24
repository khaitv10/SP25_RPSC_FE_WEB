import React, { useState, useEffect } from "react";
import { Table, Tag, Select, Button, Space, Card, Typography, Input, Tooltip, message } from "antd";
import { EyeOutlined, SearchOutlined, FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import "./LandlordRegisAdmin.scss";
import { getLandlordRegistrations } from "../../Services/userAPI";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const LandlordRegisAdmin = () => {
  const [landlords, setLandlords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Pending"); // Changed default tab to "Pending"
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusTypes, setStatusTypes] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const navigate = useNavigate();

  // Fetch landlord data from API
  const fetchLandlords = async () => {
    setLoading(true);
    try {
      const status = activeTab === "All" ? "" : activeTab;
      const response = await getLandlordRegistrations(
        pagination.current,
        pagination.pageSize,
        searchText,
        status
      );

      if (response && response.isSuccess && response.data) {
        const transformedLandlords = response.data.landlords.map(landlord => ({
          ...landlord,
          key: landlord.landlordId,
          formattedDate: dayjs(landlord.createdDate).format("DD/MM/YYYY HH:mm")
        }));

        setLandlords(transformedLandlords);
        setPagination({
          ...pagination,
          total: response.data.totalUser || 0
        });

        // Extract unique status types and calculate counts
        const statuses = {};
        const statusCounter = {};

        transformedLandlords.forEach(landlord => {
          if (landlord.status) {
            if (!statuses[landlord.status]) {
              statuses[landlord.status] = true;
            }

            statusCounter[landlord.status] = (statusCounter[landlord.status] || 0) + 1;
          }
        });

        setStatusTypes(Object.keys(statuses));
        setStatusCount(statusCounter);
      } else {
        console.error("Invalid API response format:", response);
        message.error("Failed to fetch landlord data");
      }
    } catch (error) {
      message.error("Failed to fetch landlord data");
      console.error("Error fetching landlords:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and reload when filters change
  useEffect(() => {
    fetchLandlords();
  }, [activeTab, pagination.current, pagination.pageSize]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.current === 1) {
        fetchLandlords();
      } else {
        // Reset to first page when search changes
        setPagination(prev => ({
          ...prev,
          current: 1
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleFilterChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination
    });
  };

  const viewLandlordDetails = (landlordId) => {
    navigate(`/admin/landlord-detail/${landlordId}`);
  };

  const filteredLandlords = landlords.filter((landlord) =>
    (!selectedStatus || landlord.status === selectedStatus)
  );

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return "";
    
    switch(status.toLowerCase()) {
      case "active": return "green";
      case "pending": return "gold";
      case "deactive": return "red";
      default: return "default";
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="cell-content landlord-name">{text}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="cell-content">{text}</span>
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => <span className="cell-content">{text}</span>
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <div className="date-cell">
          <CalendarOutlined className="calendar-icon" />
          <span>{dayjs(text).format("DD/MM/YYYY HH:mm")}</span>
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className={`status-tag ${status.toLowerCase()}`}
          color={getStatusColor(status)}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle" className="action-buttons">
          <Tooltip title="View details">
            <Button
              icon={<EyeOutlined />}
              className="view-button"
              onClick={() => viewLandlordDetails(record.landlordId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="landlord-admin">
      <Card className="landlord-card">
        <Title level={2} className="title">
          <span className="title-icon">🏠</span> Landlord Registrations
        </Title>

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === "Pending" ? "active" : ""}`}
            onClick={() => setActiveTab("Pending")}
          >
            Pending
          </button>
          <button
            className={`tab ${activeTab === "Active" ? "active" : ""}`}
            onClick={() => setActiveTab("Active")}
          >
            Approved
          </button>
          <button
            className={`tab ${activeTab === "Deactive" ? "active" : ""}`}
            onClick={() => setActiveTab("Deactive")}
          >
            Rejected
          </button>
          <button
            className={`tab ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
        </div>

        <div className="admin-actions">
          <div className="search-container">
            <Input
              placeholder="Search by name, email or phone"
              prefix={<SearchOutlined className="search-icon" />}
              onChange={handleSearch}
              className="search-input"
              value={searchText}
              allowClear
            />
          </div>

          <div className="filter-container">
            <FilterOutlined className="filter-icon" />
            <Select
              className="status-filter"
              placeholder="Filter by Status"
              onChange={handleFilterChange}
              value={selectedStatus || undefined}
              allowClear
            >
              {statusTypes.map((status, index) => (
                <Option key={index} value={status}>
                  <strong style={{ color: getStatusColor(status) }}>
                    {status} ({statusCount[status] || 0} Users)
                  </strong>
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={filteredLandlords}
            rowKey="landlordId"
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Registrations`,
            }}
            onChange={handleTableChange}
            loading={loading}
            className="landlords-table"
            rowClassName={(record) => record.status === "Rejected" ? "rejected-row" : ""}
          />
        </div>
      </Card>
    </div>
  );
};

export default LandlordRegisAdmin;