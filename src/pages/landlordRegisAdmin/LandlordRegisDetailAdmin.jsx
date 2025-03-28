import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Descriptions, Image, Button, Spin, Modal, Input, message } from "antd";
import { LeftOutlined, RightOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getLandlordById, updateLandlordStatus } from "../../Services/userAPI";
import { toast } from "react-toastify";
import "./LandlordRegisDetailAdmin.scss";

const { Title } = Typography;
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

  const handleUpdateStatus = async (userId, isApproved, reason = "") => {
    try {
      setLoading(true);
      const response = await updateLandlordStatus(userId, isApproved, reason);
      if (response.isSuccess) {
        toast.success("Status updated successfully!");
        setTimeout(() => {
          navigate("/admin/regis");
        }, 1000);
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

  if (loading) return <Spin size="large" className="loading-spinner" />;

  return (
    <div className="landlord-detail-container">
      <Card className="landlord-card">
        <Button type="default" className="back-button" onClick={() => navigate("/admin/regis")}>
          <LeftOutlined /> Back
        </Button>

        <Title level={2} className="title">Landlord Registration Detail</Title>

        <div className="content-wrapper">
          {/* Left Section - Details */}
          <div className="left-section">
            <Descriptions bordered column={1} className="details">
              <Descriptions.Item label={<strong>Company Name</strong>}>{landlord.companyName}</Descriptions.Item>
              <Descriptions.Item label={<strong>Number of Rooms</strong>}>{landlord.numberRoom}</Descriptions.Item>
              <Descriptions.Item label={<strong>License Number</strong>}>{landlord.licenseNumber}</Descriptions.Item>
              <Descriptions.Item label={<strong>Landlord Name</strong>}>{landlord.fullName}</Descriptions.Item>
              <Descriptions.Item label={<strong>Phone</strong>}>{landlord.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label={<strong>Email</strong>}>{landlord.email}</Descriptions.Item>
              <Descriptions.Item label={<strong>Gender</strong>}>{landlord.gender}</Descriptions.Item>
              <Descriptions.Item label={<strong>Created Date</strong>}>
                {new Date(landlord.createdDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={<strong>Status</strong>} className={`status ${landlord.status.toLowerCase()}`}>
                {landlord.status}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Right Section - Image Gallery */}
          <div className="right-section">
            <Title level={4} className="image-title">Business License Images</Title>
            {landlord?.businessImageUrls?.length > 0 ? (
              <div className="image-container">
                <Button
                  icon={<LeftOutlined />}
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? landlord.businessImageUrls.length - 1 : prev - 1))}
                  className="image-nav-button left"
                />
                <Image
                  src={landlord.businessImageUrls[currentImageIndex]}
                  width={350}
                  className="business-image"
                  preview={false}
                />
                <Button
                  icon={<RightOutlined />}
                  onClick={() => setCurrentImageIndex((prev) => (prev === landlord.businessImageUrls.length - 1 ? 0 : prev + 1))}
                  className="image-nav-button right"
                />
              </div>
            ) : (
              <span className="no-image">No image available</span>
            )}
          </div>
        </div>

        {/* Approve / Reject Buttons */}
        <div className="button-group">
          <Button
            className="approve"
            onClick={() => handleUpdateStatus(landlordId, true)}
          >
            <CheckCircleOutlined /> Approve
          </Button>
          <Button
            className="reject"
            onClick={() => setIsRejectModalOpen(true)}
          >
            <CloseCircleOutlined /> Reject
          </Button>
        </div>
      </Card>

      {/* Rejection Modal */}
      <Modal
        title="Confirm Rejection"
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onOk={handleReject}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Please enter the reason for rejection:</p>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </Modal>
    </div>
  );
};

export default LandlordRegisDetailAdmin;
