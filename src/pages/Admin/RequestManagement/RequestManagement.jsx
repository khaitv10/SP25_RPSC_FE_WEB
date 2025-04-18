import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Button, Tag, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import getAllRoomTypePending from "../../../Services/Admin/roomTypeAPI";
import dayjs from "dayjs";
import "./RequestManagement.scss";

const { Title } = Typography;

const RequestManagement = () => {
  const [pendingRoomTypes, setPendingRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingRoomTypes(currentPage);
  }, [currentPage]);

  const fetchPendingRoomTypes = async (page) => {
    try {
      setLoading(true);
      const response = await getAllRoomTypePending.getPendingRoomTypes(page, pageSize);
      setPendingRoomTypes(response || []);
      setTotalRequests(response?.length || 0);
    } catch (error) {
      console.error("Failed to fetch pending room types:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Room Type Name",
      dataIndex: "roomTypeName",
      key: "roomTypeName",
    },
    {
      title: "Deposit",
      dataIndex: "deposite",
      key: "deposite",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Square (m²)",
      dataIndex: "square",
      key: "square",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Landlord",
      dataIndex: "landlordName",
      key: "landlordName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          className="view-button"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/request/room-type/${record.roomTypeId}`)}
        >
        </Button>
      ),
    },
  ];

  return (
    <div className="request-management">
      <Card className="request-card">
        <Title level={2} style={{ color: "black", fontWeight: "bold"}}>📋 Request Management</Title>

        <Table
          dataSource={pendingRoomTypes}
          columns={columns}
          rowKey="roomTypeId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalRequests,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
};

export default RequestManagement;
