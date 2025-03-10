import React, { useEffect, useState } from "react";
import { getLandlordRegistrations } from "../../Services/userAPI";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, Input, Card, Space, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "./LandlordRegisAdmin.scss";
import dayjs from "dayjs";

const { Title } = Typography;

const LandlordRegisAdmin = () => {
  const [landlords, setLandlords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalUser, setTotalUser] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLandlords();
  }, [search]);

  const fetchLandlords = async () => {
    setLoading(true);
    try {
      const data = await getLandlordRegistrations(1, 10, search);
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "User Status",
      dataIndex: "userStatus",
      key: "userStatus",
      render: (userStatus) => (
        <Tag color={userStatus === "Pending" ? "red" : "blue"}>{userStatus}</Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space>
          <Button
            className="view-button"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/landlord-detail/${record.landlordId}`)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="landlord-admin">
      <Card className="landlord-card">
        <Title level={2} style={{ color: "#4a5568" }}>🏠 Landlord Registrations</Title>
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>Total Users: {totalUser}</p>
        <Space className="landlord-actions">
          <Input
            className="search-input"
            placeholder="🔍 Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Space>
        <Table
          dataSource={landlords}
          columns={columns}
          rowKey="landlordId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default LandlordRegisAdmin;
