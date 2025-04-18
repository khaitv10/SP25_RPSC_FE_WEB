import { useState, useEffect } from "react";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Table, Button, Input, Select, Tag, Spin } from "antd";
import PropTypes from "prop-types";
import LandlordModal from "./LandlordModal";

const { Option } = Select;

const LandlordTable = ({
  landlords,
  totalLandlords,
  currentPage,
  setCurrentPage,
  landlordsPerPage,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm
}) => {
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Landlords received in LandlordTable:", landlords);
    console.log("Total Landlords:", totalLandlords);
  }, [landlords, totalLandlords]);

  const handleViewDetails = (landlord) => {
    setSelectedLandlord(landlord);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    return status === "Active" 
      ? { color: "#10B981", bg: "#ECFDF5" } 
      : { color: "#F43F5E", bg: "#FFF1F2" };
  };

  const columns = [
    {
      title: "👤 Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <div className="landlord-name">{text}</div>
    },
    {
      title: "🏠 Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="landlord-address">{text}</div>
    },
    {
      title: "📱 Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => <div className="landlord-phone">{text}</div>
    },
    {
      title: "📧 Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div className="landlord-email">{text}</div>
    },
    {
      title: "🔄 Status",
      dataIndex: "userStatus",
      key: "userStatus",
      render: (status) => {
        const style = getStatusColor(status);
        return (
          <div 
            className="landlord-status"
            style={{ 
              backgroundColor: style.bg,
              color: style.color,
              textAlign: "center",
              borderRadius: "30px",
              padding: "6px 12px",
              fontWeight: 500,
              display: "inline-block",
              minWidth: "80px"
            }}
          >
            {status}
          </div>
        );
      }
    },
    {
      title: "✏️ Action",
      key: "action",
      render: (_, record) => (
        <Button
          className="view-button"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          title="View details"
          style={{
            borderRadius: "8px",
            backgroundColor: "#3b82f6",
            border: "none",
            color: "white",
            fontWeight: 500,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "38px",
            width: "38px",
            padding: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(37, 99, 235, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      )
    }
  ];

  return (
    <div className="landlords-container">
      

      {loading ? (
        <div className="loading-container" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px"
        }}>
          <Spin size="large" tip="Loading landlords data..." />
        </div>
      ) : (
        <Table
          dataSource={landlords}
          columns={columns}
          rowKey={(record) => record.userId || record.uniqueKey}
          className="landlords-table"
          pagination={{
            current: currentPage,
            pageSize: landlordsPerPage,
            total: totalLandlords,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false
          }}
        />
      )}

      <LandlordModal
        isOpen={isModalOpen}
        landlord={selectedLandlord}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Props Validation
LandlordTable.propTypes = {
  landlords: PropTypes.array.isRequired,
  totalLandlords: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  landlordsPerPage: PropTypes.number.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  setSelectedStatus: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default LandlordTable;