import React from 'react';
import { Drawer, Avatar, Typography, Divider, Space, Button, Card } from 'antd';
import { 
    PhoneOutlined, 
    MailOutlined, 
    IdcardOutlined, 
    UserOutlined, 
    TeamOutlined, 
    CalendarOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const RequestDetailsDrawer = ({ 
    visible, 
    onClose, 
    requestData, 
    onApprove, 
    onReject 
}) => {
    return (
        <Drawer
            title="Room Rental Request Details"
            placement="right"
            width={600}
            onClose={onClose}
            visible={visible}
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
                <Space className="drawer-footer" size="middle" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="large" onClick={onClose}>Close</Button>
                    <Button size="large" danger onClick={() => onReject(requestData)}>Reject</Button>
                    <Button size="large" type="primary" onClick={() => onApprove(requestData)}>Approve</Button>
                </Space>
            }
        >
            {requestData && (
                <div className="request-details">
                    <div className="customer-avatar" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Avatar 
                            size={120} 
                            src={requestData.avatar} 
                            style={{ border: '4px solid #01d837', marginBottom: '16px' }}
                        />
                        <Title level={3} style={{ margin: 0 }}>{requestData.customerName}</Title>
                    </div>

                    <Divider style={{ margin: '24px 0' }} />

                    <div className="detail-section" style={{ fontSize: '16px' }}>
                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><PhoneOutlined /> Phone Number:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.phone}</Text>
                        </div>

                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><MailOutlined /> Email:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.email}</Text>
                        </div>

                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><IdcardOutlined /> ID Card:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.idCard}</Text>
                        </div>

                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><UserOutlined /> Occupation:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.occupation}</Text>
                        </div>

                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><TeamOutlined /> Number of Tenants:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.numTenants} people</Text>
                        </div>

                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><CalendarOutlined /> Request Date:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.requestDate}</Text>
                        </div>

                        <div className="detail-row" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            margin: '16px 0',
                            padding: '8px',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px'
                        }}>
                            <Text strong style={{ fontSize: '16px' }}><CalendarOutlined /> Preferred Move-in Date:</Text>
                            <Text style={{ fontSize: '16px' }}>{requestData.preferredMoveInDate}</Text>
                        </div>
                    </div>

                    <Divider style={{ margin: '24px 0' }} />

                    <div className="message-section">
                        <Title level={4} style={{ marginBottom: '16px' }}>Message from Tenant:</Title>
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
                            {requestData.message}
                        </Card>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default RequestDetailsDrawer;