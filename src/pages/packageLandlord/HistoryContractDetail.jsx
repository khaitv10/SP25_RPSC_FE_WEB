import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Spin, Tag, Timeline, Descriptions, Modal, message, Row, Col, Divider, Tooltip, Badge } from "antd";
import { FilePdfOutlined, DownloadOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined, CalendarOutlined, ExclamationCircleOutlined, ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getLandlordContractById, extendLandlordPackage } from "../../Services/Landlord/contractLandlord";

import "./HistoryContractDetail.scss";

const { Title, Text } = Typography;
const { confirm } = Modal;

const HistoryContractDetail = () => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extendLoading, setExtendLoading] = useState(false);
  const [viewingPdf, setViewingPdf] = useState(false);
  const { contractId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);
        const contractData = await getLandlordContractById(contractId);
        setContract(contractData);
      } catch (error) {
        message.error("Failed to load contract details");
        console.error("Error fetching contract details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return typeof amount === 'number' 
      ? amount.toLocaleString('vi-VN') + ' VNĐ' 
      : 'N/A';
  };

  const handleViewContract = () => {
    // Open PDF in new tab
    if (contract?.lcontractUrl) {
      window.open(contract.lcontractUrl, '_blank');
    } else {
      message.error("Contract document is not available");
    }
  };

  const handleDownloadContract = () => {
    if (contract?.lcontractUrl) {
      const link = document.createElement('a');
      link.href = contract.lcontractUrl;
      link.download = `Contract-${contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.error("Contract document is not available for download");
    }
  };

  const handleBackToHistory = () => {
    navigate('/landlord/contracts');
  };

  // Modified handleExtendContract function
  const handleExtendContract = async () => {
    setExtendLoading(true);
    console.log("Starting contract extension process...");
    
    // Make sure contract data is available
    if (!contract) {
      message.error("Contract data not available");
      setExtendLoading(false);
      return;
    }
    
    console.log("Contract data:", {
      landlordId: contract.landlordId,
      packageId: contract.packageId,
      serviceDetailId: contract.serviceDetailId,
      contractStatus: contract.status
    });
  
    try {
      console.log("Proceeding with extendLandlordPackage API call...");
      
      const response = await extendLandlordPackage(
        contract.landlordId,
        contract.packageId,
        contract.serviceDetailId
      );
      
      console.log("Extension API response:", response);
      
      if (response?.data?.checkoutUrl) {
        console.log("✅ Extension successful, redirecting to:", response.data.checkoutUrl);
        message.success("Redirecting to payment page...");
        window.location.href = response.data.checkoutUrl;
      } else {
        console.error("❌ API call succeeded but returned unexpected format:", response);
        message.error("Failed to extend contract: Invalid response format");
      }
    } catch (error) {
      console.error("❌ Extension API call failed:", error);
      message.error("Failed to extend contract: " + (error.message || "Unknown error"));
    } finally {
      setExtendLoading(false);
    }
  };

  const getStatusTagColor = (status) => {
    const statusMap = {
      "Active": "success",
      "Expired": "error",
      "Pending": "warning",
      "Cancelled": "default"
    };
    return statusMap[status] || "default";
  };

  const getTransactionTypeColor = (type) => {
    const typeMap = {
      "EXTEND": "purple",
      "Buyed": "blue",
      "CANCELED": "red"
    };
    return typeMap[type] || "blue";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text className="loading-text">Loading contract details...</Text>
      </div>
    );
  }

  return (
    <div className="contract-detail-container">
      <div className="header-actions">
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackToHistory}
          className="back-button"
        >
          Back to Contracts
        </Button>
      </div>

      <Card className="contract-detail-card fade-in">
        <div className="card-header">
          <div className="title-container">
            <Title level={2} className="contract-title">
              <span className="contract-icon">📄</span> Contract Details
            </Title>
            <Badge 
              status={contract?.status === "Active" ? "success" : "error"} 
              text={<span className="contract-status">{contract?.status}</span>}
            />
          </div>
          <div className="contract-actions">
            {contract?.status === "Expired" && (
              <Tooltip title="Extend this contract">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  onClick={handleExtendContract}
                  loading={extendLoading}
                  className="action-button extend-button"
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Extend Contract
                </Button>
              </Tooltip>
            )}
            <Tooltip title="View Contract PDF">
              <Button 
                type="primary" 
                icon={<FilePdfOutlined />} 
                onClick={handleViewContract}
                className="action-button view-button"
              >
                View Contract
              </Button>
            </Tooltip>
            <Tooltip title="Download Contract">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleDownloadContract}
                className="action-button download-button"
              >
                Download
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="contract-body">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card 
                title={<span className="section-title"><CalendarOutlined /> Contract Information</span>} 
                className="info-card contract-info slide-in-left"
              >
                <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle" className="details-table">
                  <Descriptions.Item label="Package Name">{contract?.packageName}</Descriptions.Item>
                  <Descriptions.Item label="Service Detail">{contract?.serviceDetailName}</Descriptions.Item>
                  <Descriptions.Item label="Price">{formatCurrency(contract?.price)}</Descriptions.Item>
                  <Descriptions.Item label="Duration">{contract?.duration} days</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusTagColor(contract?.status)} className="status-tag">
                      {contract?.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Contract ID">
                    <Tooltip title={contract?.lcontractId}>
                      <span className="contract-id">{contract?.lcontractId?.substring(0, 8)}...</span>
                    </Tooltip>
                  </Descriptions.Item>
                </Descriptions>

                <Divider className="section-divider" />

                <div className="dates-section">
                  <Title level={5} className="subsection-title">Important Dates</Title>
                  <Row gutter={[16, 16]} className="date-cards">
                    <Col xs={24} md={8}>
                      <Card className="date-card signed-date">
                        <div className="date-icon">
                          <CheckCircleOutlined />
                        </div>
                        <div className="date-info">
                          <div className="date-label">Signed Date</div>
                          <div className="date-value">{formatDate(contract?.signedDate)}</div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card className="date-card start-date">
                        <div className="date-icon">
                          <CalendarOutlined />
                        </div>
                        <div className="date-info">
                          <div className="date-label">Start Date</div>
                          <div className="date-value">{formatDate(contract?.startDate)}</div>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card className="date-card end-date">
                        <div className="date-icon">
                          <ClockCircleOutlined />
                        </div>
                        <div className="date-info">
                          <div className="date-label">End Date</div>
                          <div className="date-value">{formatDate(contract?.endDate)}</div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card 
                title={<span className="section-title"><DollarOutlined /> Service Details</span>} 
                className="info-card service-info slide-in-right"
              >
                <div className="service-content">
                  <div className="service-item">
                    <div className="item-label">Package:</div>
                    <div className="item-value package-value">{contract?.packageName}</div>
                  </div>
                  
                  <div className="service-item">
                    <div className="item-label">Service:</div>
                    <div className="item-value service-value">{contract?.serviceDetailName}</div>
                  </div>
                  
                  <div className="service-item">
                    <div className="item-label">Description:</div>
                    <div className="item-value description-value">{contract?.serviceDetailDescription}</div>
                  </div>
                  
                  <div className="price-section">
                    <div className="price-label">Price:</div>
                    <div className="price-value">{formatCurrency(contract?.price)}</div>
                  </div>
                  
                  <div className="duration-section">
                    <div className="duration-label">Duration:</div>
                    <div className="duration-value">{contract?.duration} days</div>
                  </div>
                </div>
                
                {contract?.landlordSignatureUrl && (
                  <div className="signature-section">
                    <Title level={5} className="signature-title">Your Signature</Title>
                    <div className="signature-image-container">
                      <img 
                        src={contract.landlordSignatureUrl} 
                        alt="Landlord Signature" 
                        className="signature-image" 
                      />
                    </div>
                  </div>
                )}

                {contract?.status === "Expired" && (
                  <div className="extend-section">
                    <Button 
                      type="primary" 
                      icon={<ReloadOutlined />}
                      onClick={handleExtendContract}
                      loading={extendLoading}
                      block
                      className="extend-button-large"
                      style={{ marginTop: '24px', height: '40px', backgroundColor: "#52c41a" }}
                    >
                      Extend This Contract
                    </Button>
                    <div className="extend-note">
                      Quickly renew your contract to continue using our services
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Row className="transaction-section fade-in-up">
            <Col span={24}>
              <Card 
                title={<span className="section-title"><DollarOutlined /> Transaction History</span>} 
                className="transaction-card"
              >
                {contract?.transactions && contract.transactions.length > 0 ? (
                  <div className="transaction-list">
                    {contract.transactions.map((transaction) => (
                      <div key={transaction.transactionId} className="transaction-item">
                        <div className="transaction-date">
                          <div className="date">{formatDate(transaction.paymentDate)}</div>
                          <div className="status-indicator" style={{ backgroundColor: transaction.status === "PAID" ? "#52c41a" : "#f5222d" }}></div>
                        </div>
                        
                        <div className="transaction-content">
                          <div className="transaction-header">
                            <span className="transaction-number">#{transaction.transactionNumber}</span>
                            <Tag color={getTransactionTypeColor(transaction.type)} className="transaction-type">
                              {transaction.type}
                            </Tag>
                          </div>
                          
                          <div className="transaction-details-group">
                            <div className="transaction-details">
                              <div className="transaction-amount">
                                <DollarOutlined /> Amount: {formatCurrency(transaction.amount)}
                              </div>
                              <div className="transaction-method">
                                Payment Method: {transaction.paymentMethod}
                              </div>
                              <div className="transaction-status">
                                Status: <Tag color={transaction.status === "PAID" ? "green" : "red"}>{transaction.status}</Tag>
                              </div>
                            </div>
                            
                            <div className="transaction-info">
                              {transaction.transactionInfo}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-transactions">
                    <ExclamationCircleOutlined className="empty-icon" />
                    <Text>No transaction records available</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default HistoryContractDetail;



