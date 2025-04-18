import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Descriptions, Image, Button, Spin, message } from "antd";
import { LeftOutlined, RightOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getRoomTypeDetail, approveRoomType, rejectRoomType } from "../../../Services/Admin/roomTypeAPI";
import "./RoomTypeDetail.scss";
import { toast } from "react-toastify";
import pic from "../../../assets/room.jpg";

const { Title } = Typography;

const RoomTypeDetail = () => {
    const { roomTypeId } = useParams();
    const [roomType, setRoomType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoomTypeDetail();
    }, []);

    const fetchRoomTypeDetail = async () => {
        try {
            setLoading(true);
            const response = await getRoomTypeDetail(roomTypeId);

            let data = response.data;
            if (!data.roomImageUrls || data.roomImageUrls.length === 0) {
                //data.roomImageUrls = ["https://dummyimage.com/600x400/cccccc/000000&text=No+Image"];
                data.roomImageUrls = [pic];
            }

            setRoomType(data);
        } catch (error) {
            message.error("Failed to fetch room type details!");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (roomTypeId) => {
        if (!roomTypeId) {
            toast.error("Room Type ID is invalid!");
            return;
        }
    
        try {
            setLoading(true);
            const response = await approveRoomType(roomTypeId);
    
            if (response.data?.isSuccess) {
                toast.success("Approve room type successfully!");
                setTimeout(() => {
                    navigate("/admin/request");
                }, 1000);
            } else {
                toast.error(response.data?.message || "Approve failed!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error approving room type");
        } finally {
            setLoading(false);
        }
    };
    

    const handleReject = async (roomTypeId) => {
        if (!roomTypeId) {
            toast.error("Room Type ID is invalid!");
            return;
        }
        
        try {
            setLoading(true);
            const response = await rejectRoomType(roomTypeId);

            if (response.data?.isSuccess) {
                toast.success("Reject room type successfully!");
                setTimeout(() => {
                    navigate("/admin/request");
                }, 1000);
            } else {
                toast.error(response.data?.message || "Reject failed!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error rejecting room type");
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <Spin size="large" className="loading-spinner" />;

    return (
        <div className="room-detail-container">
            <Card className="room-type-card">
                <Button
                    type="default"
                    className="back-button"
                    onClick={() => navigate("/admin/request")}
                >
                    <LeftOutlined /> Back
                </Button>

                <Title level={2} className="title">Room Type Details</Title>

                <div className="content-wrapper">
                    {/* Left Section - Details */}
                    <div className="left-section">
                        <Descriptions bordered column={1} className="details">
                            <Descriptions.Item label={<strong>Room Type Name</strong>}>{roomType.roomTypeName || ""}</Descriptions.Item>
                            <Descriptions.Item label={<strong>Deposit</strong>}>{roomType.deposite || "0"} VNĐ</Descriptions.Item>
                            <Descriptions.Item label={<strong>Square</strong>}>{roomType.square ? `${roomType.square} m²` : ""}</Descriptions.Item>
                            <Descriptions.Item label={<strong>Status</strong>}>{roomType.status || ""}</Descriptions.Item>
                            <Descriptions.Item label={<strong>Created At</strong>}>
                                {roomType.createdAt ? new Date(roomType.createdAt).toLocaleString() : ""}
                            </Descriptions.Item>
                            <Descriptions.Item label={<strong>Address</strong>}>{roomType.address || ""}</Descriptions.Item>
                            <Descriptions.Item label={<strong>Company Name</strong>}>{roomType.landlordName || ""}</Descriptions.Item>
                            <Descriptions.Item label={<strong>Room Prices</strong>}>
                                {roomType.roomPrices && roomType.roomPrices.length > 0 ? `${roomType.roomPrices.join(", ")} VNĐ` : ""}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Services List */}
                        <Title level={4} className="services-title">Services</Title>
                        {roomType.roomServiceNames && roomType.roomServiceNames.length > 0 ? (
                            <ul className="service-list">
                                {roomType.roomServiceNames.map((service, index) => (
                                    <li key={index}>
                                        <span className="service-name">{service}</span>
                                        <span className="service-price">{roomType.roomServicePrices[index]} VNĐ</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-services">No services available.</p>
                        )}
                    </div>

                    {/* Right Section - Image Carousel */}
                    <div className="right-section">
                        <div className="image-container">
                            <Image
                                src={roomType.roomImageUrls[currentImageIndex]}
                                className="room-type-image"
                                preview={false}
                            />
                            <Button
                                icon={<LeftOutlined />}
                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? roomType.roomImageUrls.length - 1 : prev - 1))}
                                className="image-nav-button left"
                            />
                            <Button
                                icon={<RightOutlined />}
                                onClick={() => setCurrentImageIndex((prev) => (prev === roomType.roomImageUrls.length - 1 ? 0 : prev + 1))}
                                className="image-nav-button right"
                            />
                        </div>
                    </div>
                </div>

                {/* Approve / Reject Buttons */}
                <div className="button-group">
                    <Button
                        className="approve"
                        onClick={() => handleApprove(roomTypeId)}
                        disabled={loading} 
                    >
                        <CheckCircleOutlined /> Approve
                    </Button>
                    <Button
                        className="reject"
                        onClick={() => handleReject(roomTypeId)}
                        disabled={loading} 
                    >
                        <CloseCircleOutlined /> Reject
                    </Button>
                </div>


            </Card>
        </div>
    );
};

export default RoomTypeDetail;
