import React, { useEffect, useState } from "react";
import { getAllServicePackage, getServiceDetailByPackageId } from "../../Services/serviceApi";
import { Table, Button, Tag, Input, Modal, Card, Space, Typography } from "antd";
import { EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import "./adminPackage.scss";
import dayjs from "dayjs";
const { Title } = Typography;

const AdminPackage = () => {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

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

  const handleViewDetails = async (packageId) => {
    setIsModalVisible(true);
    setSelectedPackage(packageId);
    try {
      const details = await getServiceDetailByPackageId(packageId);
      setServiceDetails(details);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} VNĐ`;
  };

  const columns = [
    {
      title: "Package coin",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} days`,
    },
    {
      title: "Status",
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
          <Button icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-package">
      <Card className="package-card">
        <Title level={2}>Service Package</Title>
        <Space className="package-actions">
          <Button type="primary" icon={<PlusOutlined />}>Add new coin package</Button>
          <Input
            className="search-input"
            placeholder="Search by Package coin"
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
        />
      </Card>

      <Modal
        title="Service Package Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1040}
      >
        <Title level={3}>Package ID: {selectedPackage}</Title>
        {serviceDetails.length > 0 ? (
          <Table
          dataSource={serviceDetails}
          columns={[
            { title: "Type", dataIndex: "type", key: "type" },
            { title: "Limit Post", dataIndex: "limitPost", key: "limitPost", render: (text) => text ?? "Unlimited" },
            { title: "Price", dataIndex: "price", key: "price", render: (price) => formatPrice(price) },
            { 
              title: "Applicable Date", 
              dataIndex: "applicableDate", 
              key: "applicableDate",
              render: (date) => dayjs(date).format("DD/MM/YYYY") // Chuyển đổi sang format dd/mm/yyyy
            },
          ]}
          rowKey="serviceDetailId"
          pagination={false}
        />
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
};

export default AdminPackage;
