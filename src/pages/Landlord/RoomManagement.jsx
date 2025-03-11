import React from "react";
import RoomCard from "../../components/Landlord/RoomCard";
import "./RoomManagement.scss";

const rooms = [
  { id: 1, type: "Phòng cao cấp", area: "123 cm2", slot: 4, status: "Active", image: "room1.jpg" },
  { id: 2, type: "Phòng cao cấp", area: "123 cm2", slot: 4, status: "Active", image: "room2.jpg" },
  { id: 3, type: "Phòng cao cấp", area: "123 cm2", slot: 4, status: "Active", image: "room3.jpg" },
  { id: 4, type: "Phòng cao cấp", area: "123 cm2", slot: 4, status: "Active", image: "room4.jpg" },
  { id: 5, type: "Phòng cao cấp", area: "123 cm2", slot: 4, status: "Active", image: "room5.jpg" },
  { id: 6, type: "Phòng cao cấp", area: "123 cm2", slot: 4, status: "Active", image: "room6.jpg" },
];

const RoomManagement = () => {
  return (
    <div className="room-management">
      <h1 className="title">
        <span className="icon">🏠</span> My Rooms
      </h1>
      <div className="room-list">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      <button className="create-room-btn">Create new room</button>
    </div>
  );
};

export default RoomManagement;
