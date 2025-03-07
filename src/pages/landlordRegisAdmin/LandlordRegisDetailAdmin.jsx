import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Descriptions, Image, Button, Spin, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./LandlordRegisDetailAdmin.scss";
import { getLandlordById, updateLandlordStatus } from "../../Services/userAPI";
import { toast } from "react-toastify";

const { Title } = Typography;

const LandlordRegisDetailAdmin = () => {
  const { landlordId } = useParams();
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchLandlordDetail();
  }, []);

  const fetchLandlordDetail = async () => {
    try {
      setLoading(true);
      const response = await getLandlordById(landlordId);
      if (response?.isSuccess && response.data?.length > 0) {
        setLandlord(response.data[0]);
      } else {
        message.error("Failed to fetch landlord details!");
      }
    } catch (error) {
      message.error("Error fetching landlord details!");
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (userId, isApproved) => {
    try {
      setLoading(true);
      const response = await updateLandlordStatus(userId, isApproved);
      if (response.isSuccess) {
        toast.success("Bạn đã duyệt thành công!");
        setTimeout(() => {
          navigate("/admin/regis");
        }, 1500);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" className="loading-spinner" />;

  return (
    <div className="landlord-detail-container">
      <Card className="landlord-card">
        <Title level={2} className="title">Request Management</Title>
        <div className="content-wrapper">
          <div className="left-section">
            <Descriptions bordered column={1} className="details">
              <Descriptions.Item label="Company Name">{landlord.companyName}</Descriptions.Item>
              <Descriptions.Item label="Number of Rooms">{landlord.numberRoom}</Descriptions.Item>
              <Descriptions.Item label="License Number">{landlord.licenseNumber}</Descriptions.Item>
              <Descriptions.Item label="Landlord Name">{landlord.fullName}</Descriptions.Item>
              <Descriptions.Item label="Phone">{landlord.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Email">{landlord.email}</Descriptions.Item>
              <Descriptions.Item label="Gender">{landlord.gender}</Descriptions.Item>
              <Descriptions.Item label="Status" className={`status ${landlord.status.toLowerCase()}`}>{landlord.status}</Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {new Date(landlord.createdDate).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="right-section">
            {landlord?.businessImageUrls?.length > 0 ? (
              <div className="image-container">
                <Button icon={<LeftOutlined />} onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? landlord.businessImageUrls.length - 1 : prev - 1))} className="image-nav-button left" />
                <Image src={landlord.businessImageUrls[currentImageIndex]} width={350} className="business-image" />
                <Button icon={<RightOutlined />} onClick={() => setCurrentImageIndex((prev) => (prev === landlord.businessImageUrls.length - 1 ? 0 : prev + 1))} className="image-nav-button right" />
              </div>
            ) : (
              <span className="no-image">No image available</span>
            )}
          </div>
        </div>

        <div className="button-group">
          <Button type="primary" className="approve" onClick={() => handleUpdateStatus(landlordId, true)}>Approve</Button>
          <Button danger className="reject" onClick={() => handleUpdateStatus(landlordId, false)}>Reject</Button>
        </div>
      </Card>
    </div>
  );
};

export default LandlordRegisDetailAdmin;