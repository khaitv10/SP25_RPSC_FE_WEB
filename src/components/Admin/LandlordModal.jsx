import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import profilePic from "../../assets/avatar.jpg";

const LandlordModal = ({ isOpen, landlord, onClose }) => {
  if (!isOpen || !landlord) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Landlord Details</h2>

        {/* Avatar & Basic Info */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <img
            src={landlord.avatar || profilePic}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-md"
          />

          {/* Landlord Basic Info */}
          <div className="mt-4 text-center">
            <p className="text-xl font-semibold text-gray-700">{landlord.fullName}</p>
            <p className="text-gray-500">{landlord.email}</p>
            <p className="text-gray-500">{landlord.phoneNumber}</p>
            <p className="text-gray-500">{landlord.gender}</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="info-item"><strong>Company Name:</strong> {landlord.companyName}</div>
          <div className="info-item"><strong>License Number:</strong> {landlord.licenseNumber}</div>
          <div className="info-item"><strong>Number of Rooms:</strong> {landlord.numberRoom}</div>
          <div className="info-item"><strong>Status:</strong> {landlord.status}</div>
          <div className="info-item"><strong>Address:</strong> {landlord.address}</div>
          <div className="info-item"><strong>Created Date:</strong> {new Date(landlord.createdDate).toLocaleString()}</div>
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
    companyName: PropTypes.string,
    licenseNumber: PropTypes.string,
    numberRoom: PropTypes.number,
    status: PropTypes.string,
    createdDate: PropTypes.string,
    address: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default LandlordModal;
