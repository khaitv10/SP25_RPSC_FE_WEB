import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceDetailByPackageId, updatePrice } from "../../Services/serviceApi";
import { Table, Card, Typography, Button, Descriptions, Tag, Modal, Input, message } from "antd";
import dayjs from "dayjs";
import "./adminPackageDetail.scss";

const { Title } = Typography;

const AdminPackageDetail = () => {
  const { packageId } = useParams();
  const [packageInfo, setPackageInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceDetails();
  }, [packageId]);

  const fetchServiceDetails = async () => {
    try {
      const response = await getServiceDetailByPackageId(packageId);
      setPackageInfo(response);
    } catch (error) {
      console.error("Error fetching service details:", error);
      message.error("Failed to fetch package details.");
    }
  };

  const handleEditPrice = (record) => {
    setSelectedService(record);
    setNewPrice(record.price.toString());
    setIsModalOpen(true);
  };

  const handleUpdatePrice = async () => {
    const formattedPrice = parseFloat(newPrice);
  
    if (isNaN(formattedPrice) || formattedPrice <= 0) {
      message.error("Please enter a valid price greater than 0.");
      return;
    }
  
    try {
      console.log("Updating price for priceId:", selectedService.priceId); 
  
      const result = await updatePrice(selectedService.priceId, formattedPrice);
  
      message.success("Price updated successfully!");
      setIsModalOpen(false);
      fetchServiceDetails(); // Cập nhật lại dữ liệu
    } catch (error) {
      console.error("Error updating price:", error);
      message.error(error.response?.data?.message || "Failed to update price.");
    }
  };
  

  const formatPrice = (price) => `${price.toLocaleString()} VNĐ`;

  return (
    <div className="admin-package-detail">
      <Card className="package-detail-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Title level={2} style={{ margin: 0 }}>📦 Package Details</Title>
          <Button onClick={() => navigate(-1)} size="large">⬅ Back</Button>
        </div>

        {packageInfo && (
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item label="📌 Package Name">{packageInfo.name}</Descriptions.Item>
            <Descriptions.Item label="📝 Description">{packageInfo.description}</Descriptions.Item>
            <Descriptions.Item label="⏳ Duration">{packageInfo.duration} days</Descriptions.Item>
            <Descriptions.Item label="📌 Service Status">
              <Tag color={packageInfo.serviceStatus === "Active" ? "green" : "red"}>
                {packageInfo.serviceStatus === "Active" ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}

        <Table
          dataSource={packageInfo?.listDetails || []}
          columns={[
            { title: "📋 Type", dataIndex: "type", key: "type" },
            { 
              title: "📌 Limit Post", 
              dataIndex: "limitPost", 
              key: "limitPost", 
              render: (text) => text ?? "Unlimited" 
            },
            { 
              title: "💰 Price", 
              dataIndex: "price", 
              key: "price", 
              render: (price) => formatPrice(price) 
            },
            { 
              title: "📅 Applicable Date", 
              dataIndex: "applicableDate", 
              key: "applicableDate",
              render: (date) => dayjs(date).format("DD/MM/YYYY")
            },
            { 
              title: "⚡ Status", 
              dataIndex: "status", 
              key: "status",
              render: (status) => (
                <Tag color={status === "Active" ? "green" : "red"}>
                  {status === "Active" ? "Active" : "Inactive"}
                </Tag>
              ),
            },
            {
              title: "✏️ Action",
              key: "action",
              render: (_, record) => (
                <Button type="primary" onClick={() => handleEditPrice(record)}>Edit</Button>
              ),
            },
          ]}
          rowKey="serviceDetailId"
          pagination={false}
        />
      </Card>

      {/* Modal chỉnh sửa giá */}
      <Modal
        title="Update Price"
        open={isModalOpen}
        onOk={handleUpdatePrice}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
      >
        <Input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          placeholder="Enter new price"
          min="0"
          step="1000"
        />
      </Modal>
    </div>
  );
};

export default AdminPackageDetail;
