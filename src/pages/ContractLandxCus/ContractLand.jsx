import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Space, Card, Typography, Input, Tooltip, message } from "antd";
import { EyeOutlined, SearchOutlined, CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import "./ContractLand.scss";
import { getCustomerContracts } from "../../Services/Landlord/contractLandlord";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ContractLand = () => {
  const [contracts, setContracts] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const navigate = useNavigate();

  const handleViewDetail = (contractId) => {
    navigate(`/landlord/contract/contract-detail/${contractId}`);
  };

  // Format date string to dd/mm/yyyy
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
      const response = await getCustomerContracts(
        pagination.current,
        pagination.pageSize,
        searchText,
        activeTab === "All" ? "" : activeTab
      );

      if (response && response.contracts) {
        const transformedContracts = response.contracts.map(contract => {
            let timeRemainingInDays = "N/A"; // Giá trị mặc định nếu không có
          
            if (contract.timeRemaining) {
              const match = contract.timeRemaining.match(/^(\d+)\./); // Lấy số nguyên trước dấu chấm
              if (match) {
                timeRemainingInDays = `${match[1]} days`; // Chỉ lấy số ngày
              }
            }
          
            return {
              contractId: contract.contractId,
              customer: contract.customer.fullName,
              customerPhone: contract.customer.phoneNumber,
              room: `${contract.room.roomNumber} - ${contract.room.title}`,
              roomType: contract.room.roomType,
              startDate: formatDate(contract.startDate),
              endDate: formatDate(contract.endDate),
              status: contract.status,
              timeRemaining: timeRemainingInDays, // ✅ Đã chuyển đổi
              id: `${contract.contractId}-${contract.customer.fullName}`
            };
          });


        setContracts(transformedContracts);
        setPagination(prev => ({
          ...prev,
          total: response.totalContracts || 0
        }));
      } else {
        console.error("Invalid API response format:", response);
        message.error("Failed to fetch contract data");
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
      title: "Contract ID",
      dataIndex: "contractId",
      key: "contractId",
      render: (text) => <span className="cell-content contract-id">{text}</span>
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer, record) => (
        <div className="customer-cell">
          <span className="cell-content customer-name">{customer}</span>
          <span className="cell-content customer-phone">{record.customerPhone}</span>
        </div>
      )
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room, record) => (
        <div className="room-cell">
          <HomeOutlined className="room-icon" />
          <span className="cell-content room-details">{room}</span>
          <span className="cell-content room-type">{record.roomType}</span>
        </div>
      )
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
        title: "Time Remaining",
        dataIndex: "timeRemaining",
        key: "timeRemaining",
        render: (text) => (
            <span className="cell-content time-remaining">
            {text}
            </span>
        )
        },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          "Pending": "orange",
          "Active": "green",
          "Inactive": "red"
        };
        return (
          <Tag
            className={`status-tag ${status.toLowerCase()}`}
            color={colorMap[status] || "default"}
          >
            {status}
          </Tag>
        );
      },
    },

    {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Tooltip title="View Details">
            <Button 
              shape="circle" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record.contractId)}
            />
          </Tooltip>
        ),
      }
  ];

  return (
    <div className="contract-management">
      <Card className="contract-card">
        <Title level={2} className="title">
          <span className="title-icon">🏠</span> Customer Contracts
        </Title>

        <div className="contract-tabs">
          {["Pending", "Active", "Inactive", "All"].map((status) => (
            <button
              key={status}
              className={`tab ${activeTab === status ? "active" : ""}`}
              onClick={() => setActiveTab(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="contract-actions">
          <div className="search-container">
            <Input
              placeholder="Search by customer or room"
              prefix={<SearchOutlined className="search-icon" />}
              onChange={handleSearch}
              className="search-input"
              value={searchText}
              allowClear
            />
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={contracts}
            rowKey={(record) => record.id}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]}-${range[1]} on ${total} Contracts`,
            }}
            onChange={handleTableChange}
            loading={loading}
            className="contracts-table"
            rowClassName={(record) => 
              record.status === "Inactive" ? "inactive-row" : 
              record.status === "Pending" ? "pending-row" : ""
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ContractLand;