import { useEffect, useState } from "react";
import { getAllServicePackage, createService } from "../../Services/serviceApi";
import { Table, Button, Tag, Input, Card, Space, Typography, Modal, Form, message } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./adminPackage.scss";

const { Title } = Typography;

const AdminPackage = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
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

  const handleCreateService = async () => {
    try {
      const values = await form.validateFields();
      const response = await createService(values);
      message.success("Service package created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchPackages(); // Refresh danh sách sau khi tạo
    } catch (error) {
      message.error(error || "Failed to create service package.");
    }
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
        <Title level={2}>📦 Service Package</Title>

        <div className="search-create-container">
            <Input.Search
              className="search-input"
              placeholder="🔍 Search by type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={fetchPackages}
              enterButton
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Package
            </Button>
          </div>



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

      {/* Modal Tạo Gói Dịch Vụ */}
      <Modal
        title="➕ Create Service Package"
        open={isModalOpen}
        onOk={handleCreateService}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="📌 Package Type" rules={[{ required: true, message: "Please enter package type" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="highLight" label="🌟 HighLight" rules={[{ required: true, message: "Please enter highlight" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="size" label="📏 Size" rules={[{ required: true, message: "Please enter size" }]}>
            <Input />
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPackage;
