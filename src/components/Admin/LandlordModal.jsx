import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const LandlordModal = ({ isOpen, landlord, onClose }) => {
  if (!isOpen || !landlord) return null;

  // Default avatar in case landlord.avatar is null or undefined
  const defaultAvatar = "https://res.cloudinary.com/dzoxs1sd7/image/upload/v1744566485/ztszkoqjhamvi56rqnwj.jpg";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative transition-transform transform scale-95 hover:scale-100 duration-300">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition transform hover:scale-110"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Landlord Details</h2>

        {/* Avatar & Basic Info */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <img
            src={landlord.avatar || defaultAvatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-md transition-transform transform hover:scale-105"
          />

          {/* Landlord Basic Info */}
          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold text-gray-700">{landlord.fullName}</p>
            <p className="text-gray-500 text-lg">{landlord.email}</p>
            <p className="text-gray-500 text-lg">{landlord.phoneNumber}</p>
            <p className="text-gray-500 text-lg">{landlord.gender}</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-6 text-md bg-gray-100 p-4 rounded-lg shadow-inner">
          <div className="info-item"><strong>Company Name:</strong> {landlord.companyName || 'Not provided'}</div>
          <div className="info-item"><strong>License Number:</strong> {landlord.licenseNumber || 'Not provided'}</div>
          {/* <div className="info-item"><strong>Number of Rooms:</strong> {landlord.numberRoom || 0}</div> */}
          <div className="info-item"><strong>Status:</strong> {landlord.status}</div>
          <div className="info-item"><strong>Address:</strong> {landlord.address || 'Not provided'}</div>
          <div className="info-item"><strong>Created Date:</strong> {landlord.createdDate ? new Date(landlord.createdDate).toLocaleString() : 'Not available'}</div>
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