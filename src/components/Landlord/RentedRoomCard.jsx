import React from "react";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import "./RentedRoomCard.scss";
import img from "../../assets/room.jpg";

const RentedRoomCard = ({ room }) => {
    const navigate = useNavigate();

    return (
        <div
            className="rented-room-card"
            onClick={() => navigate(`/landlord/rented-room/${room.RoomId}`)} // Click vào toàn bộ Card
        >
            {/* Ảnh bên trái */}
            <img src={img} alt={room.Title} className="room-image" />

            {/* Nội dung phòng nằm giữa */}
            <div className="room-content">
                <h3>{room.Title}</h3>
                <p><strong>Room Number:</strong> {room.RoomNumber}</p>
                <p><strong>Location:</strong> {room.Location}</p>
            </div>

            {/* Số người ở và nút chi tiết bên phải */}
            <div className="room-actions">
                <span className="occupants">{room.MaxOccupants || ""} Occupants</span>
                <button
                    className="detail-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn click lan ra cả Card
                        navigate(`/landlord/rented-room/${room.RoomId}`);
                    }}
                >
                    View Details <RightOutlined />
                </button>
            </div>
        </div>
    );
};

export default RentedRoomCard;
