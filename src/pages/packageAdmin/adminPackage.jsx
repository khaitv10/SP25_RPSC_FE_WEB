import { useEffect, useState } from "react";
import { getAllServicePackage } from "../../Services/serviceApi";
import { Table, Button, Tag, Input, Card, Space, Typography } from "antd";
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
      title: "📌 Package Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "🌟 HighLight",
      dataIndex: "highLight",
      key: "highLight",
    },
    {
      title: "📏 Size",
      dataIndex: "size",
      key: "size",
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

        <Title level={2} style={{ color: "black", fontWeight: "bold"}}>📦 Service Package</Title>
        <div className="search-container">
          <Input.Search
            className="search-input"
            placeholder="🔍 Search by type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={fetchPackages}
            enterButton
          />
        </div>
<div></div>
        <Table
          dataSource={packages}
          columns={columns}
          rowKey="packageId"
          loading={loading}
          bordered
          size="middle"
          pagination={false} 
        />
      </Card>
    </div>
  );
};

export default AdminPackage;
