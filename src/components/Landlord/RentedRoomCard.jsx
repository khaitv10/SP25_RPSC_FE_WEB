import React from "react";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import "./RentedRoomCard.scss";
import defaultImg from "../../assets/room.jpg"; // 🟢 Ảnh mặc định nếu không có ảnh từ API

const RentedRoomCard = ({ room }) => {
    const navigate = useNavigate();
    const firstImage = room.imageUrls?.length > 0 ? room.imageUrls[0] : defaultImg; // 🟢 Dùng ảnh API hoặc ảnh mặc định

    return (
        <div
            className="rented-room-card"
            onClick={() => navigate(`/landlord/rented-room/${room.roomStayId}`)}
        >
            {/* Ảnh bên trái */}
            <img src={firstImage} alt={room.title} className="room-image" /> {/* 🟢 Hiển thị ảnh API */}

            {/* Nội dung phòng nằm giữa */}
            <div className="room-content">
                <h3>{room.title}</h3>
                <p><strong>Room Number:</strong> {room.roomNumber}</p>
                <p><strong>Location:</strong> {room.location}</p>
            </div>

            {/* Nút chi tiết bên phải */}
            <div className="room-actions">
                <span className="occupants">{room.maxOccupants || "N/A"} Occupants</span>
                <button
                    className="detail-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/landlord/rented-room/${room.roomStayId}`);
                    }}
                >
                    View Details <RightOutlined />
                </button>
            </div>
        </div>
    );
};

export default RentedRoomCard;
