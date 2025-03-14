import React, { useState } from "react";
import { Table, Tag, Select, Button, Space, Card, Typography, Input, Tooltip } from "antd";
import { EyeOutlined, SearchOutlined, FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import "./ContractManagement.scss";
import img from "../../../assets/room.jpg";

const { Title } = Typography;
const { Option } = Select;

// Thêm thông tin về số người đang sử dụng gói dịch vụ
const packageUsage = {
  "Gói 1 tháng": 24,
  "Gói 1 tuần": 8,
  "Gói 3 tháng": 15
};

const contracts = [
  { package: "Gói 1 tháng", price: "300,000 VND", landlord: "Nguyen Xuan Tien", phone: "0903764392", type: "Tin Vip 1", startDate: "23/12/2024", endDate: "23/01/2025", status: "Active", contractImage: img  },
  { package: "Gói 1 tuần", price: "150,000 VND", landlord: "Tran Vu Tien", phone: "0903764391", type: "Tin Vip 1", startDate: "23/12/2024", endDate: "30/12/2024", status: "Active", contractImage: img },
  { package: "Gói 3 tháng", price: "900,000 VND", landlord: "Nguyen Nhat Tien", phone: "0903764390", type: "Tin Vip 1", startDate: "23/12/2024", endDate: "23/03/2025", status: "Active", contractImage: img  },
  { package: "Gói 3 tháng", price: "500,000 VND", landlord: "Nguyen Vu Tien", phone: "0903712345", type: "Tin Vip 1", startDate: "23/12/2024", endDate: "23/03/2025", status: "Active", contractImage: img  },
];

const ContractManagement = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  const [searchText, setSearchText] = useState("");

  const handleFilterChange = (value) => {
    setSelectedPackage(value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const viewContractImage = (imageUrl, landlordName) => {
    // Mở ảnh trong tab mới của trình duyệt
    const newWindow = window.open(imageUrl, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
  };

  const filteredContracts = contracts.filter((contract) =>
    (activeTab === "All" || contract.status === activeTab) &&
    (!selectedPackage || contract.package === selectedPackage) &&
    (!searchText || 
      contract.landlord.toLowerCase().includes(searchText.toLowerCase()) ||
      contract.phone.includes(searchText))
  );

  const columns = [
    { 
      title: "Package Service", 
      dataIndex: "package", 
      key: "package",
      render: (text) => (
        <div className="package-cell">
          <span className="cell-content package-name">{text}</span>
        </div>
      )
    },
    { 
      title: "Price", 
      dataIndex: "price", 
      key: "price",
      render: (text) => <span className="cell-content price">{text}</span>
    },
    { 
      title: "Landlord", 
      dataIndex: "landlord", 
      key: "landlord",
      render: (text) => <span className="cell-content landlord-name">{text}</span>
    },
    { 
      title: "Phone", 
      dataIndex: "phone", 
      key: "phone",
      render: (text) => <span className="cell-content">{text}</span>
    },
    { 
      title: "Type", 
      dataIndex: "type", 
      key: "type",
      render: (text) => <span className="cell-content">{text}</span>
    },
    { 
      title: "Start Date", 
      dataIndex: "startDate", 
      key: "startDate",
      render: (text) => (
        <div className="date-cell">
          <CalendarOutlined className="calendar-icon" />
          <span>{text}</span>
        </div>
      )
    },
    { 
      title: "End Date", 
      dataIndex: "endDate", 
      key: "endDate",
      render: (text) => (
        <div className="date-cell">
          <CalendarOutlined className="calendar-icon" />
          <span>{text}</span>
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
          color={status === "Active" ? "green" : "red"}
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
          <Tooltip title="View contract image">
            <Button 
              icon={<EyeOutlined />} 
              className="view-button" 
              onClick={() => viewContractImage(record.contractImage, record.landlord)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="contract-management">
      <Card className="contract-card">
        <Title level={2} className="title">
          <span className="title-icon">📝</span> Contract Management
        </Title>

        <div className="contract-tabs">
          <button
            className={`tab ${activeTab === "Active" ? "active" : ""}`}
            onClick={() => setActiveTab("Active")}
          >
            Active
          </button>
          <button
            className={`tab ${activeTab === "Inactive" ? "active" : ""}`}
            onClick={() => setActiveTab("Inactive")}
          >
            Inactive
          </button>
          <button
            className={`tab ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
        </div>

        <div className="contract-actions">
          <div className="search-container">
            <Input
              placeholder="Search by landlord or phone"
              prefix={<SearchOutlined className="search-icon" />}
              onChange={handleSearch}
              className="search-input"
              allowClear
            />
          </div>
          
          <div className="filter-container">
            <FilterOutlined className="filter-icon" />
            <Select
              className="package-filter"
              placeholder="Filter by Package"
              onChange={handleFilterChange}
              allowClear
            >
              {Array.from(new Set(contracts.map((contract) => contract.package))).map((pkg, index) => (
                <Option key={index} value={pkg}>
                  <strong>{pkg} ({packageUsage[pkg] || 0} người dùng)</strong>
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={filteredContracts}
            rowKey="phone"
            pagination={{ 
              defaultPageSize: 10,
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} hợp đồng`,
            }}
            className="contracts-table"
            rowClassName={(record) => record.status === "Inactive" ? "inactive-row" : ""}
          />
        </div>
      </Card>

    </div>
  );
};

export default ContractManagement;