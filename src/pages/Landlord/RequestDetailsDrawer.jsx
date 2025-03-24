import React, { useState } from 'react';
import { Drawer, Avatar, Typography, Divider, Space, Button, Card, message, Modal } from 'antd';
import {
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    TeamOutlined,
    CalendarOutlined,
    HomeOutlined,
    DollarOutlined,
    CompassOutlined,
    ProfileOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    LoadingOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { notification } from 'antd';
import roomRentalService from "../../Services/Landlord/roomAPI";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

const RequestDetailsDrawer = ({
    visible,
    onClose,
    requestData,
    onApprove,
    refreshData  
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const navigate = useNavigate();

    // Enhanced debugging
    console.log("FULL Request Data received by drawer:", JSON.stringify(requestData, null, 2));

    const showConfirmModal = () => {
        setConfirmModalVisible(true);
    };

    const hideConfirmModal = () => {
        setConfirmModalVisible(false);
    };

    const handleApprove = async () => {
        hideConfirmModal();
        setIsLoading(true);
    
        try {
            if (!requestData) {
                message.error("No request data available");
                setIsLoading(false);
                return;
            }
    
            const customerId = requestData.customerId;
            const roomRentRequestsId = requestData.roomRentRequestsId;
    
            if (!customerId || !roomRentRequestsId) {
                message.error("Missing required fields");
                setIsLoading(false);
                return;
            }
    
            const response = await roomRentalService.acceptCustomerRentRoom(roomRentRequestsId, customerId);
    
            if (response && response.isSuccess) {
                sessionStorage.setItem('approval_success', 'true');
    
                // Cấu hình notification xuất hiện ở giữa màn hình
                notification.config({
                    placement: 'top', // Hiển thị ở phía trên
                    top: 20, // Khoảng cách từ trên xuống
                    left: '50%', // Đặt ở giữa màn hình
                    transform: 'translateX(-50%)', // Căn giữa theo chiều ngang
                    duration: 4,
                });
    
                // Đảm bảo thông báo xuất hiện trước khi đóng drawer
                setTimeout(() => {
                    notification.open({
                        message: 'Success',
                        description: 'Room rental request has been approved successfully',
                    });
                    onClose(); // Đóng drawer sau khi thông báo được hiển thị
                }, 500);
    
                if (onApprove && typeof onApprove === 'function') {
                    onApprove(requestData);
                }
    
                if (refreshData && typeof refreshData === 'function') {
                    refreshData();
                } else {
                    window.location.href = '/landlord/request';
                }
            } else {
                message.error(response?.message || "Cannot approve room rental request");
            }
        } catch (error) {
            console.error("Error approving room rental request:", error);
            message.error("Cannot approve room rental request: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };
    
    
    


    // Rest of your component remains unchanged
    return (
        <>
            <Drawer
                title="Room Rental Request Details"
                placement="right"
                width={600}
                onClose={onClose}
                open={visible}
                className="request-details-drawer"
                styles={{
                    header: {
                        fontSize: '24px',
                        fontWeight: 'bold',
                        backgroundColor: '#f0f7ff',
                        padding: '20px'
                    },
                    body: {
                        padding: '24px'
                    }
                }}
                footer={
                    <div
                        className="drawer-footer"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            padding: '16px 0',
                            borderTop: '1px solid #f0f0f0'
                        }}
                    >
                        <Button
                            size="large"
                            onClick={onClose}
                            disabled={isLoading}
                            style={{
                                borderRadius: '6px',
                                fontWeight: 500,
                                boxShadow: '0 2px 0 rgba(0,0,0,0.02)'
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            size="large"
                            type="primary"
                            onClick={showConfirmModal}
                            disabled={isLoading}
                            style={{
                                background: '#01d837',
                                borderColor: '#01d837',
                                borderRadius: '6px',
                                fontWeight: 500,
                                boxShadow: '0 2px 0 rgba(1,216,55,0.1)',
                                minWidth: '120px'
                            }}
                            icon={isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                        >
                            Approve
                        </Button>
                    </div>
                }
            >
                {requestData && (
                    <div className="request-details">
                        <div className="customer-avatar" style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Avatar
                                size={120}
                                src={requestData.avatar}
                                icon={!requestData.avatar && <UserOutlined />}
                                style={{ border: '4px solid #01d837', marginBottom: '16px' }}
                            />
                            <Title level={3} style={{ margin: 0 }}>{requestData.customerName || requestData.fullName}</Title>
                        </div>

                        <Divider style={{ margin: '24px 0' }} />

                        <Title level={4}>Contact Information</Title>
                        <div className="detail-section" style={{ fontSize: '16px' }}>
                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><PhoneOutlined /> Phone:</Text>
                                <Text style={{ fontSize: '16px' }}>{requestData.phone || requestData.phoneNumber || 'Not provided'}</Text>
                            </div>

                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><MailOutlined /> Email:</Text>
                                <Text style={{ fontSize: '16px' }}>{requestData.email || 'Not provided'}</Text>
                            </div>

                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><CalendarOutlined /> Status:</Text>
                                <Text style={{
                                    fontSize: '16px',
                                    color: requestData.status === 'Pending' ? '#fa8c16' :
                                        requestData.status === 'Approved' ? '#52c41a' : '#f5222d'
                                }}>
                                    {requestData.status || 'Undefined'}
                                </Text>
                            </div>
                        </div>

                        <Divider style={{ margin: '24px 0' }} />

                        <Title level={4}>Preferences</Title>
                        <div className="detail-section" style={{ fontSize: '16px' }}>
                            {requestData.preferences && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><ProfileOutlined /> Preferences:</Text>
                                    <Text style={{ fontSize: '16px', maxWidth: '60%', textAlign: 'right' }}>{requestData.preferences}</Text>
                                </div>
                            )}

                            {requestData.lifeStyle && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><UserOutlined /> Lifestyle:</Text>
                                    <Text style={{ fontSize: '16px' }}>{requestData.lifeStyle}</Text>
                                </div>
                            )}

                            {requestData.budgetRange && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><DollarOutlined /> Budget:</Text>
                                    <Text style={{ fontSize: '16px' }}>{requestData.budgetRange}</Text>
                                </div>
                            )}

                            {requestData.preferredLocation && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><CompassOutlined /> Preferred Location:</Text>
                                    <Text style={{ fontSize: '16px' }}>{requestData.preferredLocation}</Text>
                                </div>
                            )}

                            {requestData.requirement && (
                                <div className="detail-row" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '16px 0',
                                    padding: '8px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><HomeOutlined /> Requirements:</Text>
                                    <Text style={{ fontSize: '16px', maxWidth: '60%', textAlign: 'right' }}>{requestData.requirement}</Text>
                                </div>
                            )}

                            <div className="detail-row" style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '16px 0',
                                padding: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '8px'
                            }}>
                                <Text strong style={{ fontSize: '16px', marginRight: 'auto' }}><ClockCircleOutlined /> Rental Duration:</Text>
                                <Text style={{ fontSize: '16px' }}>
                                    {(requestData.monthWantRent !== undefined && requestData.monthWantRent !== null)
                                        ? `${requestData.monthWantRent} ${Number(requestData.monthWantRent) === 1 ? 'month' : 'months'}`
                                        : '6 months'}
                                </Text>
                            </div>
                        </div>

                        <Divider style={{ margin: '24px 0' }} />

                        <div className="message-section">
                            <Title level={4} style={{ marginBottom: '16px' }}>Message from tenant:</Title>
                            <Card
                                className="message-card"
                                style={{
                                    fontSize: '16px',
                                    padding: '8px',
                                    backgroundColor: '#f6ffed',
                                    border: '1px solid #b7eb8f',
                                    borderRadius: '8px'
                                }}
                            >
                                {requestData.message || 'No message provided'}
                            </Card>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Confirm Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <QuestionCircleOutlined style={{ color: '#1890ff', fontSize: '22px' }} />
                        <span>Confirm Approval</span>
                    </div>
                }
                open={confirmModalVisible}
                onCancel={hideConfirmModal}
                footer={[
                    <Button key="cancel" onClick={hideConfirmModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        loading={isLoading}
                        onClick={handleApprove}
                        style={{
                            background: '#01d837',
                            borderColor: '#01d837'
                        }}
                    >
                        Confirm
                    </Button>,
                ]}
                centered
                maskClosable={false}
            >
                <p style={{ fontSize: '16px', marginBottom: '0' }}>
                    Are you sure you want to approve this room rental request from{' '}
                    <Text strong>{requestData?.customerName || requestData?.fullName || 'this tenant'}</Text>?
                </p>
                <p style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '12px' }}>
                    Once approved, the tenant will be notified and the room status will be updated.
                </p>
            </Modal>
        </>
    );
};

RequestDetailsDrawer.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    requestData: PropTypes.object.isRequired,
    onApprove: PropTypes.func.isRequired,
    refreshData: PropTypes.func.isRequired
};

export default RequestDetailsDrawer;