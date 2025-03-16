import React, { useState, useEffect } from "react";
import { Table, Tag, Select, Button, Space, Card, Typography, Input, Tooltip, message } from "antd";
import { EyeOutlined, SearchOutlined, FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import "./ContractManagement.scss";
import { getAllLandlordContract } from "../../../Services/Admin/landlordAPI";

const { Title } = Typography;
const { Option } = Select;

// Define package colors
const getPackageColor = (packageName) => {
  if (!packageName) return "black";

  const lowercaseName = packageName.toLowerCase();

  if (lowercaseName.includes("tin thường")) return "black";
  if (lowercaseName.includes("tin vip 1")) return "#003cff"; // Blue
  if (lowercaseName.includes("tin vip 2")) return "#fa460a"; // Orange
  if (lowercaseName.includes("tin vip 3")) return "#d102c7"; // Pink
  if (lowercaseName.includes("tin vip 4")) return "#e8071d"; // Red

  return "black"; // Default color
};

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [packageTypes, setPackageTypes] = useState([]);
  const [packageUsage, setPackageUsage] = useState({});

  // Format date string from API's ISO format to dd/mm/yyyy
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
    } catch (error) {
      return dateString;
    }
  };

  // Fetch contract data from API
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const status = activeTab === "All" ? "" : activeTab;
      const response = await getAllLandlordContract.getLandlordContracts(
        pagination.current,
        pagination.pageSize,
        searchText,
        status
      );

      // Check if the API response has the expected structure
      if (response && response.isSuccess && response.data) {
        // Transform the data to match what the component expects
        const transformedContracts = response.data.contracts.map(contract => ({
          package: contract.packageName,
          price: `${contract.price.toLocaleString()} VND`,
          landlord: contract.landlordName,
          phone: contract.phoneNumber,
          type: `${contract.packageName} (${contract.duration} ngày)`,
          startDate: formatDate(contract.startDate),
          endDate: formatDate(contract.endDate),
          status: contract.status,
          contractImage: contract.lcontractUrl,
          id: `${contract.landlordName}-${contract.startDate}` // Create a unique id
        }));

        setContracts(transformedContracts);
        setPagination({
          ...pagination,
          total: response.data.totalContract || 0
        });

        // Extract unique package types and calculate usage
        const packages = {};
        const packageCount = {};

        transformedContracts.forEach(contract => {
          if (contract.package) {
            if (!packages[contract.package]) {
              packages[contract.package] = true;
            }

            packageCount[contract.package] = (packageCount[contract.package] || 0) + 1;
          }
        });

        setPackageTypes(Object.keys(packages));
        setPackageUsage(packageCount);
      } else {
        console.error("Invalid API response format:", response);
        message.error("API response format is unexpected");
      }
    } catch (error) {
      message.error("Failed to fetch contract data");
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and reload when filters change
  useEffect(() => {
    fetchContracts();
  }, [activeTab, pagination.current, pagination.pageSize]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.current === 1) {
        fetchContracts();
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
    setSelectedPackage(value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination
    });
  };

  const viewContractImage = (imageUrl) => {
    if (imageUrl) {
      const newWindow = window.open(imageUrl, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    } else {
      message.info("No contract image available");
    }
  };

  const filteredContracts = contracts.filter((contract) =>
    (!selectedPackage || contract.package === selectedPackage)
  );

  const columns = [
    {
      title: "Package Service",
      dataIndex: "package",
      key: "package",
      render: (text) => (
        <div className="package-cell">
          <span
            className="cell-content package-name"
            style={{ color: getPackageColor(text), fontWeight: "bold" }}
          >
            {text}
          </span>
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
              value={searchText}
              allowClear
            />
          </div>

          <div className="filter-container">
            <FilterOutlined className="filter-icon" />
            <Select
              className="package-filter"
              placeholder="Filter by Package"
              onChange={handleFilterChange}
              value={selectedPackage || undefined} // Make sure undefined is used when empty
              allowClear
              showSearch={false} // Disable search to ensure placeholder shows
            >
              {packageTypes.map((pkg, index) => (
                <Option key={index} value={pkg}>
                  <strong style={{ color: getPackageColor(pkg) }}>
                    {pkg} ({packageUsage[pkg] || 0} Users)
                  </strong>
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={filteredContracts}
            rowKey={(record) => record.id}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]}-${range[1]} on ${total} Contracts`,
            }}
            onChange={handleTableChange}
            loading={loading}
            className="contracts-table"
            rowClassName={(record) => record.status === "Inactive" ? "inactive-row" : ""}
          />
        </div>
      </Card>
    </div>
  );
};

export default ContractManagement;