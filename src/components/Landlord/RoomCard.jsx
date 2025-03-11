import React from "react";
import PropTypes from "prop-types";
import "./RoomCard.scss";
import img from "../../assets/room.jpg";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <img src={img} alt="Room" className="room-image" />
      <div className="room-info">
        {/* Status Badge */}
        <span className={`status ${room.status.toLowerCase()}`}>{room.status}</span>
        <p><strong>Type:</strong> {room.type}</p>
        <p><strong>Area:</strong> {room.area}</p>
        <p><strong>Slot:</strong> {room.slot}</p>
      </div>
      <button className="details-btn">Details</button>
    </div>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    slot: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoomCard;
