import PropTypes from "prop-types";
import "./AmentyCard.scss";

export const AmenityCard = ({ amenity }) => {
  return (
    <div className="amenity-card">
      <div className="amenity-info">
        <p>
          <strong>ID:</strong> {amenity.RoomAmenityId}
        </p>
        <p>
          <strong>Name:</strong> {amenity.Name}
        </p>
        <p>
          <strong>Compensation:</strong> {amenity.Compensation}
        </p>
      </div>
    </div>
  );
};

AmenityCard.propTypes = {
  amenity: PropTypes.shape({
    RoomAmenityId: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
    Compensation: PropTypes.number.isRequired,
  }).isRequired,
};
