import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Typography, Table, Tag, Button, Avatar, 
  Spin, Modal, Drawer, Divider, notification, Space, Badge, Input
} from 'antd';
import {
  CalendarOutlined, UserOutlined, MessageOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, QuestionCircleOutlined,
  FileTextOutlined, LoadingOutlined, HistoryOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { viewAllRequestExtendContract, getExtendRequestDetailByContractId, approveExtendContractRequest, rejectExtendContractRequest } from '../../Services/Landlord/contractLandlord';
import './RequestExtendContract.scss';

const { Title, Text } = Typography;

const RequestExtendContract = ({ updateTotalExtendRequests }) => {
  const navigate = useNavigate();
  
  // Core states
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [totalRequests, setTotalRequests] = useState(0);
  const [contractDetail, setContractDetail] = useState(null);
  const [landlordMessage, setLandlordMessage] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmationType, setConfirmationType] = useState('approve');
  
  // Pagination
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchExtendContractRequests();
  }, [pageIndex, pageSize]);

  // Update the badge count when total requests change
  useEffect(() => {
    if (updateTotalExtendRequests) {
      const pendingCount = requests.filter(req => 
        req.status.toLowerCase() === 'pending'
      ).length;
      updateTotalExtendRequests(pendingCount);
    }
  }, [requests, updateTotalExtendRequests]);

  const fetchExtendContractRequests = async () => {
    try {
      setLoading(true);
      const response = await viewAllRequestExtendContract(pageIndex, pageSize);
      
      if (response && response.requests) {
        const formattedRequests = response.requests.map(req => ({
          ...req,
          key: req.requestId,
          createdAt: new Date(req.createdAt).toLocaleDateString('en-GB'),
          statusColor: getStatusColor(req.status)
        }));
        
        setRequests(formattedRequests);
        setTotalRequests(response.totalRequests || 0);
      }
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load extension requests. Please try again.');
      console.error("Error fetching extension requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetail = async (contractId) => {
    try {
      setDetailLoading(true);
      const detailData = await getExtendRequestDetailByContractId(contractId);
      
      if (detailData) {
        setContractDetail({
          customerContract: detailData.customerContract,
          extendRequests: detailData.extendRequests.map(req => ({
            ...req,
            createdAt: new Date(req.createdAt).toLocaleDateString('en-GB'),
            statusColor: getStatusColor(req.status)
          }))
        });
      }
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load request details. Please try again.');
      console.error("Error fetching request details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'processing';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      default: return <QuestionCircleOutlined />;
    }
  };

  const showNotification = (type, title, message) => {
    notification[type]({
      message: title,
      description: message,
      placement: 'topRight',
      duration: 4,
    });
  };

  const handleTableChange = (pagination) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showRequestDetails = async (request) => {
    setSelectedRequest(request);
    setDrawerVisible(true);
    
    // Fetch detailed information when opening the drawer
    if (request.contractId) {
      await fetchRequestDetail(request.contractId);
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setContractDetail(null);
  };

  const showConfirmModal = (type) => {
    setConfirmationType(type);
    setLandlordMessage(''); // Reset message when opening modal
    setConfirmModalVisible(true);
  };

  const hideConfirmModal = () => {
    setConfirmModalVisible(false);
  };



  const handleConfirmAction = async () => {
    if (!selectedRequest || !selectedRequest.requestId) {
      showNotification('error', 'Error', 'Request ID is missing');
      return;
    }
  
    setProcessing(true);
    try {
      if (confirmationType === 'approve') {
        await approveExtendContractRequest(selectedRequest.requestId);
        showNotification('success', 'Success', 'Request has been approved successfully');
      } else {
        await rejectExtendContractRequest(selectedRequest.requestId, landlordMessage);
        showNotification('success', 'Success', 'Request has been rejected successfully');
      }
      
      hideConfirmModal();
      closeDrawer();
      fetchExtendContractRequests();
    } catch (error) {
      showNotification(
        'error', 
        'Error', 
        `Failed to ${confirmationType} request. Please try again.`
      );
      console.error(`Error ${confirmationType}ing request:`, error);
    } finally {
      setProcessing(false);
    }
  };
  
  const navigateToContractDetail = (contractId) => {
    navigate(`/landlord/contract/contract-detail/${contractId}`, {
      state: { from: "/landlord/request/" }
    });
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      
    },
    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="date-cell">
          <CalendarOutlined className="date-icon" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: 'Extension Duration',
      dataIndex: 'monthWantToRent',
      key: 'monthWantToRent',
      render: (months) => (
        <div className="duration-cell">
          <HistoryOutlined className="duration-icon" />
          <span>{`${months} ${months === 1 ? 'month' : 'months'}`}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag icon={getStatusIcon(status)} color={record.statusColor} className="status-tag-table">
          {status}
        </Tag>
      ),
    },
    {
  title: 'Action',
  key: 'action',
  render: (_, record) => (
    <Button 
      type="primary"
      onClick={() => showRequestDetails(record)}
      className="view-details-btn"
      icon={<EyeOutlined />}
    >
      View Details
    </Button>
  ),
},
  ];

  const renderDetailItem = (icon, label, value) => (
    <div className="detail-row">
      <Text strong className="detail-label">
        <span className="icon-wrapper">{icon}</span> {label}
      </Text>
      <Text className="detail-value">{value}</Text>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="contract-extension-container">
      <Card className="extension-card">
        <div className="card-header">
          <div className="header-left">
            <Title level={4} className="page-title">
              <FileTextOutlined className="title-icon" />
              Contract Extension Requests
            </Title>
            <Text type="secondary" className="subtitle">
              Manage customer requests to extend their rental contracts
            </Text>
          </div>
          
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-container">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
              <Text>Loading extension requests...</Text>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={requests}
              rowKey="requestId"
              pagination={{
                current: pageIndex,
                pageSize: pageSize,
                total: totalRequests,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                showTotal: (total) => `Total ${total} requests`,
              }}
              onChange={handleTableChange}
              locale={{ emptyText: 'No extension requests found' }}
              className="extension-table"
            />
          )}
        </div>
      </Card>

      {/* Request Details Drawer */}
      <Drawer
  title={
    <div className="drawer-title">
      <FileTextOutlined className="drawer-icon" />
      Contract Extension Request Details
    </div>
  }
  placement="right"
  width={520}
  onClose={closeDrawer}
  open={drawerVisible}
  className="extension-details-drawer"
  styles={{
    header: { 
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%)', 
      padding: '20px',
      borderBottom: '1px solid #e6f0fa'
    },
    body: { padding: '24px' }
  }}
  footer={
    selectedRequest && selectedRequest.status.toLowerCase() === 'pending' ? (
      <div className="drawer-footer">
        <Button 
          onClick={closeDrawer}
          className="cancel-button"
          disabled={processing}
        >
          Close
        </Button>
        <Space>
          <Button
            danger
            onClick={() => showConfirmModal('reject')}
            icon={<CloseCircleOutlined />}
            className="reject-button"
            disabled={processing}
          >
            Reject
          </Button>
          <Button
            type="primary"
            onClick={() => showConfirmModal('approve')}
            icon={<CheckCircleOutlined />}
            className="approve-button"
            disabled={processing}
          >
            Approve
          </Button>
        </Space>
      </div>
    ) : (
      <Button onClick={closeDrawer} type="primary" className="close-button">
        Close
      </Button>
    )
  }
>
  {detailLoading ? (
    <div className="loading-details-container">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
      <Text>Loading request details...</Text>
    </div>
  ) : (
    selectedRequest && (
      <div className="request-details">
        <div className="customer-section">

          <Title level={3} className="customer-name">
            {selectedRequest.customerName}
          </Title>
          <Tag 
            icon={getStatusIcon(selectedRequest.status)} 
            color={selectedRequest.statusColor} 
            className="status-tag"
          >
            {selectedRequest.status}
          </Tag>
        </div>

              <Divider className="section-divider" />

              <div className="detail-section">
                {renderDetailItem(
                  <ClockCircleOutlined />,
                  'Request Date',
                  selectedRequest.createdAt
                )}
                {renderDetailItem(
                  <CalendarOutlined />,
                  'Extension Duration',
                  `${selectedRequest.monthWantToRent} ${
                    selectedRequest.monthWantToRent === 1 ? 'month' : 'months'
                  }`
                )}
                {renderDetailItem(
                  <FileTextOutlined />,
                  'Contract ID',
                  selectedRequest.contractId
                )}
              </div>

              {contractDetail && contractDetail.customerContract && (
                <>
                  <Divider className="section-divider" />
                  
                  <div className="contract-section">
                    <Title level={4} className="section-title">
                      <FileTextOutlined className="section-icon" /> Contract Information
                    </Title>
                    <Card className="contract-info-card">
                      {renderDetailItem(
                        <CalendarOutlined />,
                        'Start Date',
                        formatDate(contractDetail.customerContract.startDate)
                      )}
                      {renderDetailItem(
                        <CalendarOutlined />,
                        'End Date',
                        formatDate(contractDetail.customerContract.endDate)
                      )}
                      {renderDetailItem(
                        <ClockCircleOutlined />,
                        'Current Status',
                        contractDetail.customerContract.status
                      )}
                      
                      <div className="contract-actions">
                        <Button 
                          type="primary" 
                          icon={<EyeOutlined />}
                          onClick={() => navigateToContractDetail(contractDetail.customerContract.contractId)}
                          className="view-contract-btn"
                        >
                          View Contract Details
                        </Button>
                        
                        {contractDetail.customerContract.term && (
                          <Button 
                            type="default"
                            href={contractDetail.customerContract.term}
                            target="_blank"
                            className="view-terms-btn"
                          >
                            View Terms Document
                          </Button>
                        )}
                      </div>
                    </Card>
                  </div>
                </>
              )}

              <Divider className="section-divider" />

              <div className="message-section">
                <Title level={4} className="section-title">
                  <MessageOutlined className="section-icon" /> Customer Message
                </Title>
                <Card className="message-card">
                  <div className="message-content">
                    {selectedRequest.messageCustomer || 'No message provided'}
                  </div>
                </Card>
              </div>
            </div>
          )
        )}
      </Drawer>

      {/* Confirm Modal */}
      {/* Confirm Modal */}
<Modal
  title={
    <div className="confirm-modal-title">
      {confirmationType === 'approve' ? 
        <CheckCircleOutlined className="confirm-icon approve" /> : 
        <CloseCircleOutlined className="confirm-icon reject" />
      }
      <span>
        Confirm {confirmationType === 'approve' ? 'Approval' : 'Rejection'}
      </span>
    </div>
  }
  open={confirmModalVisible}
  onCancel={hideConfirmModal}
  footer={[
    <Button key="cancel" onClick={hideConfirmModal} disabled={processing} className="cancel-modal-btn">
      Cancel
    </Button>,
    <Button
      key="confirm"
      type={confirmationType === 'approve' ? 'primary' : 'danger'}
      loading={processing}
      onClick={handleConfirmAction}
      className={confirmationType === 'approve' ? 'approve-modal-btn' : 'reject-modal-btn'}
    >
      {confirmationType === 'approve' ? 'Approve' : 'Reject'}
    </Button>,
  ]}
  centered
  className="confirm-modal"
>
  <div className="modal-content">
    <p className="confirm-message">
      Are you sure you want to {confirmationType} this contract extension request from{' '}
      <Text strong>{selectedRequest?.customerName}</Text>?
    </p>
    
    {confirmationType === 'approve' ? (
      <p className="confirm-note">
        The contract will be extended by {selectedRequest?.monthWantToRent || '?'} {
          selectedRequest?.monthWantToRent === 1 ? 'month' : 'months'
        }.
      </p>
    ) : (
      <>
        <p className="confirm-note">
          Please provide a reason for rejecting this extension request:
        </p>
        <Input.TextArea
          placeholder="Enter your message to the customer (optional)"
          value={landlordMessage}
          onChange={(e) => setLandlordMessage(e.target.value)}
          rows={4}
          className="landlord-message-input"
          style={{ marginTop: '10px', marginBottom: '10px' }}
        />
      </>
    )}
  </div>
</Modal>
    </div>
  );
};

export default RequestExtendContract;