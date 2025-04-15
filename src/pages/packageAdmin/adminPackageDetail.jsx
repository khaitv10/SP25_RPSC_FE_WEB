import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Card, Typography, Button, Descriptions, Tag, Modal, Input, message, Spin, Divider, Select, InputNumber } from "antd";
import dayjs from "dayjs";
import "./adminPackageDetail.scss";
import { getServiceDetailByPackageId, createServiceDetail, updatePrice, updateServicePackage } from "../../Services/serviceApi";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Option } = Select;

const AdminPackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [editPackage, setEditPackage] = useState({
    type: "",
    highLightTime: "",
    maxPost: "",
    label: "",
    status: ""
  });
  const [newService, setNewService] = useState({
    packageId: packageId,
    name: "",
    duration: "",
    description: "",
    price: "",
    status: "Active"
  });

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const data = await getServiceDetailByPackageId(packageId);
      setPackageInfo(data);
      // Initialize the edit package state with current values
      setEditPackage({
        type: data.type || "",
        highLightTime: data.highLightTime || "",
        maxPost: data.maxPost || null,
        label: data.label || "",
        status: data.status || "Active"
      });
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

  const handleEditPackage = () => {
    if (packageInfo) {
      setIsPackageModalOpen(true);
    }
  };

  const handleUpdatePackage = async () => {
    try {
      await updateServicePackage(
        packageId,
        editPackage.type,
        editPackage.highLightTime,
        null, // newPriorityTime (not being edited in UI)
        editPackage.maxPost,
        editPackage.label,
        editPackage.status
      );
      
      toast.success("🎉 Cập nhật gói dịch vụ thành công!");
      setIsPackageModalOpen(false);
      fetchPackageDetails();
    } catch (error) {
      toast.error(error.message || "❌ Lỗi khi cập nhật gói dịch vụ.");
    }
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
      newDescription: selectedService?.description,
      newStatus: selectedService?.status // Include status in the log
    });
  
    try {
      const response = await updatePrice(
        selectedService?.priceId, 
        formattedPrice,
        selectedService?.name,
        selectedService?.duration,
        selectedService?.description,
        selectedService?.status // Include status in the API call
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
        status: "Active"
      });
  
      setIsCreateModalOpen(false);
      fetchPackageDetails(); // Cập nhật lại danh sách dịch vụ
    } catch (error) {
      toast.error("❌ Lỗi khi tạo dịch vụ!");
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { color: "#10B981", bg: "#ECFDF5" };
      default:
        return { color: "#F43F5E", bg: "#FFF1F2" };
    }
  };

  const statusStyle = packageInfo?.status ? getStatusColor(packageInfo.status) : { color: "#10B981", bg: "#ECFDF5" };
  
  // Check if services are in use to disable edit buttons
  const isServicesInUse = packageInfo?.totalServiceIsUseNow > 0;
  
  return (
    <div className="admin-package-detail">
      <Card className="package-detail-card">
        <div className="package-header">
          <Button onClick={() => navigate(-1)} className="back-button">
            <span className="back-icon">←</span> Back
          </Button>
          <Title level={2} className="page-title">📦 Package Details</Title>
          <Button type="primary" className="add-service-button" onClick={() => setIsCreateModalOpen(true)}>
            <span className="add-icon">+</span> Add Service
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="Loading package data..." />
          </div>
        ) : (
          <>
            {packageInfo && (
              <div className="package-info-section">
                <div className="package-meta">
                  <div className="package-type-badge">
                    <span className="icon">📌</span> {packageInfo.type}
                  </div>
                  <div className="status-container">
                    <div className="status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                      {packageInfo.status}
                    </div>
                    <div className="active-services-badge">
                      <span className="icon">🔄</span> {packageInfo.totalServiceIsUseNow || 0} Service Is Use
                    </div>
                  </div>
                </div>
                
                <Divider className="section-divider" />
                
                <div className="package-details-container">
                  <div className="package-details-grid">
                    <div className="detail-item">
                      <div className="detail-label">⭐ Highlight Time</div>
                      <div className="detail-value">{packageInfo.highLightTime}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">📏 Max Post</div>
                      <div className="detail-value">
                        {packageInfo.maxPost ?? <Tag className="no-limit-tag">No Limit</Tag>}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">🏷️ Label</div>
                      <div className="detail-value">{packageInfo.label || "N/A"}</div>
                    </div>
                  </div>

                  {/* Edit Package Button - now inside the container */}
                  <Button 
                    type="primary" 
                    className="edit-package-button" 
                    onClick={handleEditPackage}
                    disabled={isServicesInUse}
                    title={isServicesInUse ? "Cannot edit while any service is in use" : "Edit package details"}
                  >
                    <span style={{ marginRight: "6px" }}>✏️</span> Edit Package
                  </Button>
                </div>
              </div>
            )}
            
            <div className="services-section">
              <div className="section-header">
                <h3 className="section-title">Service Details</h3>
                <div className="service-count">{packageInfo?.listDetails?.length || 0} Services</div>
              </div>
              
              <Table
                dataSource={packageInfo?.listDetails || []}
                columns={[
                  { 
                    title: "📋 Name", 
                    dataIndex: "name", 
                    key: "name",
                    render: (text) => <div className="service-name">{text}</div>
                  },
                  { 
                    title: "⏳ Duration", 
                    dataIndex: "duration", 
                    key: "duration", 
                    render: (text) => <div className="service-duration">{text} ngày</div>
                  },
                  { 
                    title: "📝 Description", 
                    dataIndex: "description", 
                    key: "description", 
                    render: (text) => <div className="service-description">{text}</div>
                  },
                  { 
                    title: "📅 Date", 
                    dataIndex: "applicableDate", 
                    key: "applicableDate", 
                    render: (date) => <div className="service-date">{dayjs(date).format("DD/MM/YYYY")}</div>
                  },
                  { 
                    title: "💰 Price", 
                    dataIndex: "price", 
                    key: "price", 
                    render: (price) => <div className="service-price">{price.toLocaleString()} VNĐ</div>
                  },
                  {
                    title: "🔄 Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                      <div 
                        className="service-status"
                        style={{ 
                          backgroundColor: status === "Active" ? "#ECFDF5" : "#FFF1F2",
                          color: status === "Active" ? "#10B981" : "#F43F5E",
                          borderRadius: "30px",
                          padding: "6px 12px",
                          fontWeight: "500",
                          display: "inline-block",
                          textAlign: "center"
                        }}
                      >
                        {status}
                      </div>
                    )
                  },
                  {
                    title: "✏️ Action",
                    key: "action",
                    render: (_, record) => (
                      <Button 
                        type="primary" 
                        className="edit-button" 
                        onClick={() => handleEditPrice(record)}
                        disabled={isServicesInUse}
                        title={isServicesInUse ? "Cannot edit while any service is in use" : "Edit service"}
                        style={{
                          backgroundColor: "#3b82f6",
                          borderRadius: "8px",
                          fontWeight: "500",
                          border: "none"
                        }}
                      >
                        Edit
                      </Button>
                    ),
                  },
                ]}
                rowKey="serviceDetailId"
                pagination={false}
                className="services-table"
              />
            </div>
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
        className="service-modal"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Service Name</label>
            <Input 
              placeholder="📋 Name" 
              value={selectedService?.name || ""} 
              onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })} 
            />
          </div>
          
          <div className="form-group">
            <label>Duration (Days)</label>
            <Input 
              type="number" 
              placeholder="⏳ Duration (days)" 
              value={selectedService?.duration || ""} 
              onChange={(e) => setSelectedService({ ...selectedService, duration: e.target.value })} 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <Input 
              placeholder="📝 Description" 
              value={selectedService?.description || ""} 
              onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })} 
            />
          </div>
          
          <div className="form-group">
            <label>Price (VND)</label>
            <Input 
              type="number" 
              placeholder="💰 Price (VND)" 
              value={newPrice} 
              onChange={(e) => setNewPrice(e.target.value)} 
              min="1" 
              step="1000" 
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <Select
              value={selectedService?.status || "Active"}
              onChange={(value) => setSelectedService({ ...selectedService, status: value })}
              style={{ width: '100%' }}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Modal Edit Package */}
      <Modal
        title="✏️ Edit Package Information"
        open={isPackageModalOpen}
        onOk={handleUpdatePackage}
        onCancel={() => setIsPackageModalOpen(false)}
        okText="Update Package"
        className="service-modal"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Package Type</label>
            <Input
              placeholder="📋 Type"
              value={editPackage.type}
              onChange={(e) => setEditPackage({ ...editPackage, type: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Highlight Time</label>
            <Input
              placeholder="⭐ Highlight Time"
              value={editPackage.highLightTime}
              onChange={(e) => setEditPackage({ ...editPackage, highLightTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Max Post</label>
            <InputNumber
              placeholder="📏 Max Post"
              value={editPackage.maxPost}
              onChange={(value) => setEditPackage({ ...editPackage, maxPost: value })}
              min={0}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '5px', fontSize: '12px', color: '#6b7280' }}>
              Leave empty or set to 0 for no limit
            </div>
          </div>

          <div className="form-group">
            <label>Label</label>
            <Input
              placeholder="🏷️ Label"
              value={editPackage.label}
              onChange={(e) => setEditPackage({ ...editPackage, label: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <Select
              value={editPackage.status}
              onChange={(value) => setEditPackage({ ...editPackage, status: value })}
              style={{ width: '100%' }}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Modal Create Service */}
      <Modal 
          title="➕ Create New Service" 
          open={isCreateModalOpen} 
          onOk={handleCreateService} 
          onCancel={() => setIsCreateModalOpen(false)} 
          okText="Create"
          okButtonProps={{ disabled: !newService.name.trim() || !newService.duration.trim() || !newService.price.trim() }}
          className="service-modal"
        >
          <div className="modal-form">
            <div className="form-group">
              <label>Service Name</label>
              <Input 
                placeholder="📋 Name" 
                value={newService.name} 
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label>Duration (Days)</label>
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
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <Input 
                placeholder="📝 Description" 
                value={newService.description} 
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label>Price (VND)</label>
              <Input 
                type="number"
                placeholder="💰 Price (VND)" 
                value={newService.price} 
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <Select
                value={newService.status}
                onChange={(value) => setNewService({ ...newService, status: value })}
                style={{ width: '100%' }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default AdminPackageDetail;