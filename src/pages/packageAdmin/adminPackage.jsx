import { useEffect, useState } from "react";
import { getAllServicePackage, createService } from "../../Services/serviceApi";
import { Table, Button, Card, Typography, Modal, Form, Input, Spin, Tag } from "antd";
import { EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
  }, []);

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

  // Add debounce functionality for search like in ContractManagement
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPackages();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleViewDetails = (packageId) => {
    navigate(`/admin/package/${packageId}`);
  };

  const handleCreateService = async () => {
    try {
      const values = await form.validateFields();
      await createService(values);
      Modal.success({
        title: "Success",
        content: "🎉 Service package created successfully!",
        okText: "Got it",
        okButtonProps: { style: { background: "#3b82f6", borderRadius: "8px" } }
      });
      setIsModalOpen(false);
      form.resetFields();
      fetchPackages();
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "❌ Failed to create service package.",
        okText: "Try Again",
        okButtonProps: { style: { borderRadius: "8px" } }
      });
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" 
      ? { color: "#10B981", bg: "#ECFDF5" } 
      : { color: "#F43F5E", bg: "#FFF1F2" };
  };

  const columns = [
    {
      title: "📌 Package Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <div className="package-type">{text}</div>
    },
    {
      title: "🌟 HighLight Time",
      dataIndex: "highLightTime",
      key: "highLightTime",
      render: (text) => <div className="highlight-time">{text}</div>
    },
    {
      title: "📏 Max Post",
      dataIndex: "maxPost",
      key: "maxPost",
      render: (maxPost) => (
        <div className="max-post">
          {maxPost ? maxPost : <Tag className="no-limit-tag">No Limit</Tag>}
        </div>
      )
    },
    {
      title: "🏷️ Label",
      dataIndex: "label",
      key: "label",
      render: (text) => <div className="package-label">{text}</div>
    },
    {
      title: "🔄 Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const style = getStatusColor(status);
        return (
          <div 
            className="package-status"
            style={{ 
              backgroundColor: style.bg,
              color: style.color
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
          onClick={() => handleViewDetails(record.packageId)}
          title="View details"
        />
      )
    }
  ];

  return (
    <div className="admin-package">
      <Card className="package-card">
        <div className="package-header">
          <Title level={2} className="page-title">📦 Service Packages</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined className="add-icon" />}
            className="create-package-button"
            onClick={() => setIsModalOpen(true)}
          >
            Create Package
          </Button>
        </div>

        <div className="search-container">
          <Input
            placeholder="🔍 Search by package type..."
            prefix={<SearchOutlined className="search-icon" />}
            onChange={handleSearch}
            className="search-input"
            value={search}
            allowClear
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="Loading packages data..." />
          </div>
        ) : (
          <Table
            dataSource={packages}
            columns={columns}
            rowKey="packageId"
            className="packages-table"
            pagination={false}
          />
        )}
      </Card>

      <Modal
        title="➕ Create Service Package"
        open={isModalOpen}
        onOk={handleCreateService}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
        className="create-modal"
      >
        <Form form={form} layout="vertical" className="modal-form">
          <Form.Item 
            name="type" 
            label="📌 Package Type" 
            rules={[{ required: true, message: "Please enter package type" }]}
          >
            <Input placeholder="Enter package type" />
          </Form.Item>
          
          <Form.Item 
            name="highLightTime" 
            label="🌟 HighLight Time" 
            rules={[{ required: true, message: "Please enter highlight time" }]}
          >
            <Input placeholder="Enter highlight time" />
          </Form.Item>
          
          <Form.Item 
            name="priorityTime" 
            label="⏱️ Priority Time"
          >
            <Input type="number" placeholder="Enter priority time" />
          </Form.Item>
          
          <Form.Item 
            name="maxPost" 
            label="📏 Max Post"
          >
            <Input type="number" placeholder="Enter max post (leave blank for No Limit)" />
          </Form.Item>
          
          <Form.Item 
            name="label" 
            label="🏷️ Label" 
            rules={[{ required: true, message: "Please enter label" }]}
          >
            <Input placeholder="Enter label" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPackage;