import React, { useEffect, useState } from "react";
import { getLandlordRegistrations } from "../../Services/userAPI";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, Input, Card, Pagination, Typography, Row, Col } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import "./LandlordRegisAdmin.scss";
import dayjs from "dayjs";

const { Title } = Typography;
const { Search } = Input;

const LandlordRegisAdmin = () => {
  const [landlords, setLandlords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalUser, setTotalUser] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLandlords();
  }, [search, currentPage, pageSize]);

  const fetchLandlords = async () => {
    setLoading(true);
    try {
      const data = await getLandlordRegistrations(currentPage, pageSize, search);
      if (data?.isSuccess) {
        setLandlords(data.data.landlords);
        setTotalUser(data.data.totalUser);
      }
    } catch (error) {
      console.error("Error fetching landlords:", error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag className={`status-tag ${status}`}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          className="view-button"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/landlord-detail/${record.landlordId}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="landlord-admin">
      <Card className="landlord-card">
        <div className="admin-header">
          <div className="header-title">
            <Title level={2}>🏠 Landlord Registrations</Title>
            <p className="header-subtitle">Manage and review landlord registration requests</p>
          </div>
          <Search
            placeholder="Search landlords..."
            allowClear
            enterButton={<SearchOutlined />}
            className="search-input"
            onSearch={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="table-container">
          <Table
            dataSource={landlords}
            columns={columns}
            rowKey="landlordId"
            loading={loading}
            pagination={false}
          />
        </div>
        
        <div className="table-footer">
          <div className="total-count">Total {totalUser} registrations</div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalUser}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['10', '20', '50']}
          />
        </div>
      </Card>
    </div>
  );
};

export default LandlordRegisAdmin;