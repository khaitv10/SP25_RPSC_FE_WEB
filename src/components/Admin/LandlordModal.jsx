import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const LandlordModal = ({ isOpen, landlord, onClose }) => {
  if (!isOpen || !landlord) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-auto relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Landlord Details</h2>

        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-6 mb-4">
          {/* Avatar */}
          {landlord.avatar ? (
            <img
              src={landlord.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}

          {/* Landlord Basic Info */}
          <div>
            <p className="text-lg font-semibold">{landlord.fullName}</p>
            <p className="text-gray-600">{landlord.email}</p>
            <p className="text-gray-600">{landlord.phoneNumber}</p>
            <p className="text-gray-600">{landlord.gender}</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Address:</strong> {landlord.address}</p>
          <p><strong>Properties Owned:</strong> {landlord.propertiesOwned}</p>
          <p><strong>Experience:</strong> {landlord.experience}</p>
          <p><strong>Rental History:</strong> {landlord.rentalHistory}</p>
          <p><strong>Preferred Tenant Type:</strong> {landlord.preferredTenantType}</p>
        </div>
      </div>
    </div>
  );
};

LandlordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  landlord: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    gender: PropTypes.string,
    avatar: PropTypes.string,
    address: PropTypes.string,
    propertiesOwned: PropTypes.string,
    experience: PropTypes.string,
    rentalHistory: PropTypes.string,
    preferredTenantType: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default LandlordModal;