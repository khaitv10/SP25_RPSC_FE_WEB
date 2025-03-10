import React, { useEffect, useState } from "react";
import { getAllServicePackage } from "../../Services/serviceApi";
import { Table, Button, Tag, Input, Modal, Card, Space, Typography } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./adminPackage.scss";

const { Title } = Typography;

const AdminPackage = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, [search]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getAllServicePackage(1, 10, search);
      setPackages(data);
    } catch (error) {
      console.error("Error fetching service packages:", error);
    }
    setLoading(false);
  };

  const handleViewDetails = (packageId) => {
    navigate(`/admin/package/${packageId}`);
  };

  const columns = [
    {
      title: "📌 Package Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "📝 Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "⏳ Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} days`,
    },
    {
      title: "Service Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status === "Active" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record.packageId)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-package">
      <Card className="package-card">
        <Title level={2}>📦 Service Package</Title>
        <Space className="package-actions">
          <Button type="primary" icon={<PlusOutlined />}>Add new package</Button>
          <Input
            className="search-input"
            placeholder="🔍 Search by Package Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Space>
        <Table
          dataSource={packages}
          columns={columns}
          rowKey="packageId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered // Thêm viền cho bảng
          size="middle" // Làm bảng gọn gàng hơn
        />

      </Card>
    </div>
  );
};

export default AdminPackage;
