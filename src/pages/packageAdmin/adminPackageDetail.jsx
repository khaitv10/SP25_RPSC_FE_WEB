import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Card, Typography, Button, Descriptions, Tag, Modal, Input, message, Spin } from "antd";
import dayjs from "dayjs";
import "./adminPackageDetail.scss";
import { getServiceDetailByPackageId, createServiceDetail, updatePrice } from "../../Services/serviceApi";
import toast from "react-hot-toast";

const { Title } = Typography;

const AdminPackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newService, setNewService] = useState({
    packageId: packageId,
    name: "",
    duration: "",
    description: "",
    price: "",
  });

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const data = await getServiceDetailByPackageId(packageId);
      setPackageInfo(data);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu gói dịch vụ!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (packageId) fetchPackageDetails();
  }, [packageId]);

  const handleEditPrice = (record) => {
    setSelectedService(record);
    setNewPrice(record.price.toString());
    setIsPriceModalOpen(true);
  };

  const handleUpdatePrice = async () => {
    const formattedPrice = parseFloat(newPrice);
    if (isNaN(formattedPrice) || formattedPrice <= 0) {
      message.error("Vui lòng nhập giá hợp lệ lớn hơn 0.");
      return;
    }
  
    console.log("🔍 Dữ liệu gửi lên API:", {
      priceId: selectedService?.priceId, 
      newPrice: formattedPrice,
      newName: selectedService?.name,
      newDuration: selectedService?.duration,
      newDescription: selectedService?.description
    });
  
    try {
      const response = await updatePrice(
        selectedService?.priceId, 
        formattedPrice,
        selectedService?.name,
        selectedService?.duration,
        selectedService?.description
      );
  
      console.log("✅ Phản hồi từ server:", response);
  
      message.success("🎉 Cập nhật dịch vụ thành công!");
  
      // Đóng modal và load lại dữ liệu từ server
      setIsPriceModalOpen(false);
      fetchPackageDetails();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      message.error(error.message || "❌ Lỗi khi cập nhật dịch vụ.");
    }
  };
  
  const handleCreateService = async () => {
    const { name, duration, price } = newService;
  
    // Kiểm tra các field bắt buộc
    if (!name.trim() || !duration.trim() || !price.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
  
    // Kiểm tra Duration phải là số nguyên từ 1 đến 365
    const parsedDuration = parseInt(duration, 10);
    if (!/^\d+$/.test(duration) || parsedDuration <= 0 || parsedDuration > 365) {
      toast.error("⏳ Duration phải là số nguyên từ 1 đến 365!");
      return;
    }
  
    // Kiểm tra Price phải là số hợp lệ
    const formattedPrice = parseFloat(price);
    if (isNaN(formattedPrice) || formattedPrice <= 0) {
      toast.error("💰 Price phải là số hợp lệ lớn hơn 0!");
      return;
    }
  
    try {
      await createServiceDetail(newService);
      toast.success("🎉 Thêm dịch vụ thành công!", { duration: 5000 }); // Hiển thị 5 giây
  
      // 🛠 Reset lại form nhập
      setNewService({
        packageId: packageId,
        name: "",
        duration: "",
        description: "",
        price: "",
      });
  
      setIsCreateModalOpen(false);
      fetchPackageDetails(); // Cập nhật lại danh sách dịch vụ
    } catch (error) {
      toast.error("❌ Lỗi khi tạo dịch vụ!");
    }
  };
  
  
  

  return (
    <div className="admin-package-detail">
      <Card className="package-detail-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Button onClick={() => navigate(-1)} size="large">⬅ Back</Button>
          <Title level={2}>📦 Package Details</Title>
          <Button type="primary" size="large" onClick={() => setIsCreateModalOpen(true)}>➕ Add Service</Button>
        </div>

        {loading ? (
          <Spin tip="Đang tải dữ liệu..." style={{ display: "flex", justifyContent: "center", marginBottom: 20 }} />
        ) : (
          <>
            {packageInfo && (
              <Descriptions bordered column={2} size="middle">
                  <Descriptions.Item label="📌 Package Type">{packageInfo.type}</Descriptions.Item>
                  <Descriptions.Item label="⭐ Highlight Time">{packageInfo.highLightTime}</Descriptions.Item>
                  <Descriptions.Item label="📏 Max Post">
                    {packageInfo.maxPost ?? <Tag color="blue">No Limit</Tag>}
                  </Descriptions.Item>
                  <Descriptions.Item label="🏷️ Label">{packageInfo.label || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="⚡ Status" span={2}>
                    <Tag color={packageInfo.status === "Active" ? "green" : "red"}>
                      {packageInfo.status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

            )}
            
            <Table
              dataSource={packageInfo?.listDetails || []}
              columns={[
                { title: "📋 Name", dataIndex: "name", key: "name", width: 200 },
                { title: "⏳ Duration", dataIndex: "duration", key: "duration", width: 150, render: (text) => `${text} ngày` },
                { title: "📝 Description", dataIndex: "description", key: "description", width: 250 },
                { title: "📅 Date", dataIndex: "applicableDate", key: "applicableDate", width: 180, render: (date) => dayjs(date).format("DD/MM/YYYY") },
                { title: "💰 Price", dataIndex: "price", key: "price", width: 120, render: (price) => `${price.toLocaleString()} VNĐ` },
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
          </>
        )}
      </Card>

           {/* Modal Edit Price */}
           <Modal 
        title="✏️ Update Service Details"
        open={isPriceModalOpen} 
        onOk={handleUpdatePrice} 
        onCancel={() => setIsPriceModalOpen(false)} 
        okText="Update"
      >
        <Input 
          placeholder="📋 Name" 
          value={selectedService?.name || ""} 
          onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })} 
          style={{ marginBottom: 10 }}
        />
        
        <Input 
          type="number" 
          placeholder="⏳ Duration (days)" 
          value={selectedService?.duration || ""} 
          onChange={(e) => setSelectedService({ ...selectedService, duration: e.target.value })} 
          style={{ marginBottom: 10 }}
        />
        
        <Input 
          placeholder="📝 Description" 
          value={selectedService?.description || ""} 
          onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })} 
          style={{ marginBottom: 10 }}
        />
        
        <Input 
          type="number" 
          placeholder="💰 Price (VND)" 
          value={newPrice} 
          onChange={(e) => setNewPrice(e.target.value)} 
          min="1" 
          step="1000" 
          style={{ marginBottom: 10 }}
        />
      </Modal>

      {/* Modal Create Service */}
      <Modal 
          title="➕ Create New Service" 
          open={isCreateModalOpen} 
          onOk={handleCreateService} 
          onCancel={() => setIsCreateModalOpen(false)} 
          okText="Create"
          okButtonProps={{ disabled: !newService.name.trim() || !newService.duration.trim() || !newService.price.trim() }}
        >
          <Input 
            placeholder="📋 Name" 
            value={newService.name} 
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <Input 
            type="number"
            placeholder="⏳ Duration (days)" 
            value={newService.duration} 
            onChange={(e) => {
              let value = e.target.value;

              // Chặn nhập ký tự không phải số
              if (!/^\d*$/.test(value)) return;

              let numberValue = parseInt(value, 10);
              
              // Giới hạn từ 1 đến 365
              if (numberValue > 365) numberValue = 365;
              if (numberValue < 1) numberValue = 1;

              setNewService({ ...newService, duration: numberValue.toString() });
            }}
            style={{ marginTop: 10 }}
          />


          <Input 
            placeholder="📝 Description" 
            value={newService.description} 
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            style={{ marginTop: 10 }}
          />
          <Input 
            type="number"
            placeholder="💰 Price (VND)" 
            value={newService.price} 
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            min="1"
            style={{ marginTop: 10 }}
          />
        </Modal>


    </div>
  );
};

export default AdminPackageDetail;
