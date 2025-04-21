import React, { useState } from 'react';
import { Typography, Tabs, Badge } from 'antd';
import { BellOutlined, LogoutOutlined, FileTextOutlined } from '@ant-design/icons';
import './RoomRequestManagement.scss';
import LeaveRoomRequestList from './LeaveRoomRequestList';
import RoomRentalRequestList from './RoomRentalRequestList';
import RequestExtendContract from './RequestExtendContract'; // Import the RequestExtendContract component

const { Title } = Typography;
const { TabPane } = Tabs;

const RoomRequestManagement = () => {
    const [activeTab, setActiveTab] = useState('hasRequests');
    const [totalRooms, setTotalRooms] = useState(0);
  const [totalExtendRequests, setTotalExtendRequests] = useState(0); // State for extend contract requests count
 
  // This function can be passed down to the RoomRentalRequestList component to update the badge count
  const updateTotalRooms = (count) => {
    setTotalRooms(count);
  };

  // This function can be passed down to the RequestExtendContract component to update the badge count
  const updateTotalExtendRequests = (count) => {
    setTotalExtendRequests(count);
  };

  // Function to get the appropriate title icon based on active tab
  const getTitleIcon = () => {
    switch(activeTab) {
      case 'hasRequests':
        return <BellOutlined className="title-icon" />;
      case 'leaveRequests':
        return <LogoutOutlined className="title-icon" />;
      case 'extendRequests':
        return <FileTextOutlined className="title-icon" />;
      default:
        return <BellOutlined className="title-icon" />;
    }
  };

  // Function to get the appropriate title text based on active tab
  const getTitleText = () => {
    switch(activeTab) {
      case 'hasRequests':
        return 'Room Requests Management';
      case 'leaveRequests':
        return 'Leave Room Requests';
      case 'extendRequests':
        return 'Contract Extension Requests';
      default:
        return 'Room Requests Management';
    }
  };

    return (
        <div className="room-request-management">
            <div className="room-request-header">
                <Title level={2}>
          {getTitleIcon()} {getTitleText()}
                </Title>
                </div>
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="request-tabs">
                <TabPane
                    tab={
                        <Badge count={totalRooms} offset={[10, 0]} className="tab-badge">
              <span>Room Rental Requests</span>
                        </Badge>
                    }
                    key="hasRequests"
                >
          <RoomRentalRequestList updateTotalRooms={updateTotalRooms} />
        </TabPane>
        <TabPane
          tab={
            <Badge count={0} offset={[10, 0]} className="tab-badge">
              <span>Leave Room Requests</span>
            </Badge>
          }
          key="leaveRequests"
        >
          <LeaveRoomRequestList />
        </TabPane>
        <TabPane
          tab={
            <Badge count={totalExtendRequests} offset={[10, 0]} className="tab-badge">
              <span>Contract Extension Requests</span>
            </Badge>
          }
          key="extendRequests"
        >
          <RequestExtendContract updateTotalExtendRequests={updateTotalExtendRequests} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default RoomRequestManagement;