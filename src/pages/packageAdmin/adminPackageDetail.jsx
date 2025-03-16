import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    setPackageInfo({
      packageId: "142D8DF5-4CCC-425D-B616-CF9E960DB7AB",
      type: "Tin thường",
      highLight: "Màu mặc định, viết thường",
      size: "Nhỏ",
      status: "Active",
      listDetails: [
        {
          serviceDetailId: "3457C1E2-D1BA-4230-9FB4-C4CC934F5383",
          applicableDate: "2025-03-15T17:53:20.617",
          price: 2000,
          name: "Gói 1 ngày",
          duration: "1",
          description: "Gói dịch vụ 1 ngày",
          packageId: "142D8DF5-4CCC-425D-B616-CF9E960DB7AB",
          priceId: "446394D6-6487-47EF-A06B-79C5C0CF1653"
        },
        {
          serviceDetailId: "1F748D81-4D7D-44E7-8DD8-B785CD142AAF",
          applicableDate: "2025-03-15T17:53:20.617",
          price: 4000,
          name: "Gói 1 tuần",
          duration: "7",
          description: "Gói dịch vụ 1 tuần",
          packageId: "142D8DF5-4CCC-425D-B616-CF9E960DB7AB",
          priceId: "29DF47E7-A85C-4DA0-B696-A0250B8A8210"
        },
        {
          serviceDetailId: "B4A6518E-6BC3-4BA8-A928-DDE713A68801",
          applicableDate: "2025-03-15T17:53:20.617",
          price: 8000,
          name: "Gói 1 tháng",
          duration: "30",
          description: "Gói dịch vụ 1 tháng",
          packageId: "142D8DF5-4CCC-425D-B616-CF9E960DB7AB",
          priceId: "D732C061-A77E-43EE-B9BC-04C7BDF0B6F5"
        }
      ]
    });
  }, [packageId]);

  const handleEditPrice = (record) => {
    setSelectedService(record);
    setNewPrice(record.price.toString());
    setIsModalOpen(true);
  };

  const handleUpdatePrice = () => {
    const formattedPrice = parseFloat(newPrice);
    if (isNaN(formattedPrice) || formattedPrice <= 0) {
      message.error("Vui lòng nhập giá hợp lệ lớn hơn 0.");
      return;
    }
    
    setPackageInfo((prev) => {
      const updatedDetails = prev.listDetails.map((service) =>
        service.serviceDetailId === selectedService.serviceDetailId
          ? { ...service, price: formattedPrice }
          : service
      );
      return { ...prev, listDetails: updatedDetails };
    });
    message.success("Cập nhật giá thành công!");
    setIsModalOpen(false);
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
            <Descriptions.Item label="📌 Package Type">{packageInfo.type}</Descriptions.Item>
            <Descriptions.Item label="⭐ Highlight">{packageInfo.highLight}</Descriptions.Item>
            <Descriptions.Item label="📏 Size">{packageInfo.size}</Descriptions.Item>
            <Descriptions.Item label="⚡ Status">
              <Tag color={packageInfo.status === "Active" ? "green" : "red"}>{packageInfo.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}

        <Table
        
          dataSource={packageInfo?.listDetails || []}
          columns={[
            { title: "📋 Name", dataIndex: "name", key: "name", width: 200 },
            { title: "⏳ Duration", dataIndex: "duration", key: "duration", width: 150, render: (text) => `${text} ngày` },
            { title: "📝 Description", dataIndex: "description", key: "description", width: 250 },
            { title: "📅 Applicable Date", dataIndex: "applicableDate", key: "applicableDate", width: 180, render: (date) => dayjs(date).format("DD/MM/YYYY") },
            { title: "💰 Price", dataIndex: "price", key: "price", width: 120, render: (price) => formatPrice(price) },
            {
              title: "✏️ Action",
              key: "action",
              width: 100,
              render: (_, record) => (
                <Button type="primary" onClick={() => handleEditPrice(record)}>Edit</Button>
              ),
            },
          ]}
          
          rowKey="serviceDetailId"
          pagination={false}
        />
      </Card>

      <Modal title="Update Price" open={isModalOpen} onOk={handleUpdatePrice} onCancel={() => setIsModalOpen(false)} okText="Update">
        <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Enter new price" min="0" step="1000" />
      </Modal>
    </div>
  );
};

export default AdminPackageDetail;