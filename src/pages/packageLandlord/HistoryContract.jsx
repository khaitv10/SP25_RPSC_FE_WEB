import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Card, Typography, Input, Tooltip, message } from "antd";
import { EyeOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import { getLandlordContracts} from "../../Services/Landlord/contractLandlord";
import { useNavigate } from "react-router-dom";
import "./HistoryContract.scss";

const { Title } = Typography;

const HistoryContract = () => {
  const [contracts, setContracts] = useState([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const handleViewContractDetail = (contractId) => {
    navigate(`/landlord/contract-detail/${contractId}`);
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === "All" ? "" : activeTab;
      
      const data = await getLandlordContracts(
        pagination.current, 
        pagination.pageSize, 
        statusParam,
        searchText
      );
      
      if (data?.contracts && Array.isArray(data.contracts)) {
        setContracts(data.contracts);
        setPagination(prev => ({
          ...prev,
          total: data.totalContract || 0
        }));
      } else {
        message.error("Invalid data format: Expected 'contracts' array");
      }
    } catch (error) {
      message.error("Error fetching contracts");
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [activeTab, pagination.current, pagination.pageSize]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
      render: (text) => <span className="cell-content package-name">{text}</span>
    },
    {
      title: "Service Detail",
      dataIndex: "serviceDetailName",
      key: "serviceDetailName",
      render: (text) => <span className="cell-content service-detail">{text}</span>
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (amount) => <span className="cell-content price">{typeof amount === 'number' ? amount.toLocaleString() : amount} VNĐ</span>
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (days) => <span className="cell-content duration">{days} days</span>
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => <span className="cell-content date">{formatDate(date)}</span>
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => <span className="cell-content date">{formatDate(date)}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = { 
          "Active": "green", 
          "Expired": "red",
        };
        return <Tag className={`status-tag ${status?.toLowerCase()}`} color={colorMap[status] || "default"}>{status}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            shape="circle" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewContractDetail(record.lcontractId)} 
          />
        </Tooltip>
      ),
    }
  ];

  return (
    <div className="history-contract">
      <Card className="contract-card">
        <div className="title-row">
          <Title level={2} className="title">
            <span className="title-icon">📄</span> Contract History
          </Title>
        </div>

        <div className="contract-tabs">
          {["Active", "Expired", "All"].map((status) => (
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
              placeholder="Search by package name or service"
              prefix={<SearchOutlined className="search-icon" />}
              onChange={handleSearch}
              className="search-input"
              value={searchText}
              allowClear
            />
          </div>

          <div className="action-buttons">
            <Button 
              type="primary" 
              icon={<FileTextOutlined />} 
              size="large" 
              onClick={() => navigate('/landlord/service')}
              className="subscription-button"
            >
              New Subscription
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={contracts}
            rowKey="lcontractId"
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Contracts`,
            }}
            onChange={handleTableChange}
            loading={loading}
            className="contracts-table"
            rowClassName={(record) => 
              record.status === "Expired" ? "expired-row" : 
              record.status === "Pending" ? "pending-row" :
              record.status === "Cancelled" ? "cancelled-row" : ""
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default HistoryContract;