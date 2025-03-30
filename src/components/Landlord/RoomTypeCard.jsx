import PropTypes from "prop-types";

const RoomTypeCard = ({ roomType }) => {
  return (
    <div className="room-type-card bg-white rounded-2xl shadow-lg p-5 w-[30%] transition-transform duration-300 hover:scale-105">
      <h3 className="text-xl font-semibold">{roomType.name}</h3>
      <p className="text-gray-700">Description: {roomType.description}</p>
    </div>
  );
};

RoomTypeCard.propTypes = {
  roomType: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default RoomTypeCard;
