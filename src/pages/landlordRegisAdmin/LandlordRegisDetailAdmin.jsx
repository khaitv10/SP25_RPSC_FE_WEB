import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Descriptions, Image, Button, Spin, Modal, Input, message, Badge } from "antd";
import { 
  LeftOutlined, 
  RightOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileImageOutlined
} from "@ant-design/icons";
import { getLandlordById, updateLandlordStatus } from "../../Services/userAPI";
import { toast } from "react-toastify";
import "./LandlordRegisDetailAdmin.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

const LandlordRegisDetailAdmin = () => {
  const { landlordId } = useParams();
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchLandlordDetail();
  }, [landlordId]);

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
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (userId, isApproved, reason = "") => {
    try {
      setLoading(true);
      const response = await updateLandlordStatus(userId, isApproved, reason);
      if (response.isSuccess) {
        toast.success(`Landlord registration ${isApproved ? 'approved' : 'rejected'} successfully!`);
        setTimeout(() => {
          navigate("/admin/regis");
        }, 1500);
      } else {
        const errorMsg = response?.message || response?.data?.message || "Update failed!";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Error updating status!");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      message.warning("Please enter a reason for rejection!");
      return;
    }
    handleUpdateStatus(landlordId, false, rejectionReason);
    setIsRejectModalOpen(false);
    setRejectionReason("");
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return <Badge status="success" text={<Text strong className="status approved">Approved</Text>} />;
      case 'rejected':
        return <Badge status="error" text={<Text strong className="status rejected">Rejected</Text>} />;
      case 'pending':
      default:
        return <Badge status="warning" text={<Text strong className="status pending">Pending</Text>} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading details..." />
      </div>
    );
  }

  return (
    <div className="landlord-regis-detail-admin-container">
      <div className="landlord-detail-container">
        <Card className="landlord-card">
          <Button 
            type="default" 
            className="back-button" 
            onClick={() => navigate("/admin/regis")}
            icon={<LeftOutlined />}
          >
            Back to List
          </Button>

          <div className="status-indicator">
            {getStatusBadge(landlord?.status)}
            {landlord?.status?.toLowerCase() === 'pending' && (
              <div className="pending-indicator">
                <ClockCircleOutlined /> Awaiting Review
              </div>
            )}
          </div>

          <Title level={2} className="title">
            Landlord Registration Details
          </Title>

          <div className="content-wrapper">
            {/* Left Section - Details */}
            <div className="left-section">
              <div className="section-header">
                <Title level={4}>Business Information</Title>
              </div>
              
              <Descriptions bordered column={1} className="details">
                <Descriptions.Item label="Company Name">{landlord.companyName}</Descriptions.Item>
                <Descriptions.Item label="Number of Rooms">{landlord.numberRoom}</Descriptions.Item>
                <Descriptions.Item label="License Number">{landlord.licenseNumber}</Descriptions.Item>
                <Descriptions.Item label="Landlord Name">{landlord.fullName}</Descriptions.Item>
                <Descriptions.Item label="Phone">{landlord.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Email">{landlord.email}</Descriptions.Item>
                <Descriptions.Item label="Gender">{landlord.gender}</Descriptions.Item>
                <Descriptions.Item label="Registration Date">
                  {new Date(landlord.createdDate).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Right Section - Image Gallery */}
            <div className="right-section">
              <div className="section-header">
                <Title level={4}><FileImageOutlined /> Business License Images</Title>

              </div>
              
              {landlord?.businessImageUrls?.length > 0 ? (
                <div className="image-gallery">
                  <div className="image-container">
                    <Button
                      icon={<LeftOutlined />}
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? landlord.businessImageUrls.length - 1 : prev - 1))}
                      className="image-nav-button left"
                      disabled={landlord.businessImageUrls.length <= 1}
                    />
                    <Image
                      src={landlord.businessImageUrls[currentImageIndex]}
                      className="business-image"
                      preview={{ 
                        visible: false,
                        mask: "View Full Image"
                      }}
                    />
                    <Button
                      icon={<RightOutlined />}
                      onClick={() => setCurrentImageIndex((prev) => (prev === landlord.businessImageUrls.length - 1 ? 0 : prev + 1))}
                      className="image-nav-button right"
                      disabled={landlord.businessImageUrls.length <= 1}
                    />
                  </div>
                  
                  {landlord.businessImageUrls.length > 1 && (
                    <div className="image-thumbnails">
                      {landlord.businessImageUrls.map((url, index) => (
                        <div 
                          key={index}
                          className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image src={url} preview={false} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-image">
                  <FileImageOutlined />
                  <span>No images available</span>
                </div>
              )}
            </div>
          </div>

          {/* Approve / Reject Buttons - Only shown when status is pending */}
          {landlord?.status?.toLowerCase() === 'pending' && (
            <div className="button-group">
              <Button
                className="approve"
                onClick={() => handleUpdateStatus(landlordId, true)}
                icon={<CheckCircleOutlined />}
              >
                Approve
              </Button>
              <Button
                className="reject"
                onClick={() => setIsRejectModalOpen(true)}
                icon={<CloseCircleOutlined />}
              >
                Reject
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Rejection Modal */}
      <Modal
        title="Confirm Rejection"
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onOk={handleReject}
        okText="Confirm Rejection"
        cancelText="Cancel"
        className="rejection-modal"
      >
        <p>Please specify the reason for rejecting this landlord registration:</p>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter detailed rejection reason..."
          maxLength={500}
          showCount
        />
      </Modal>
    </div>
  );
};

export default LandlordRegisDetailAdmin;