import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import profilePic from "../../assets/avatar.jpg";

const CustomerModal = ({ isOpen, customer, onClose }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Customer Details</h2>

        <div className="flex flex-col items-center mb-6">
          <img
            //src={customer.avatar || profilePic}
            src={profilePic}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-md"
          />

          <div className="mt-4 text-center">
            <p className="text-xl font-semibold text-gray-700">{customer.fullName}</p>
            <p className="text-gray-500">{customer.email}</p>
            <p className="text-gray-500">{customer.phoneNumber}</p>
            <p className="text-gray-500">{customer.gender}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="info-item"><strong>Address:</strong> {customer.address}</div>
          <div className="info-item"><strong>Preferences:</strong> {customer.preferences}</div>
          <div className="info-item"><strong>Life Style:</strong> {customer.lifeStyle}</div>
          <div className="info-item"><strong>Budget Range:</strong> {customer.budgetRange}</div>
          <div className="info-item"><strong>Preferred Location:</strong> {customer.preferredLocation}</div>
          <div className="info-item"><strong>Requirement:</strong> {customer.requirement}</div>
        </div>
      </div>
    </div>
  );
};

CustomerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  customer: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    gender: PropTypes.string,
    avatar: PropTypes.string,
    address: PropTypes.string,
    preferences: PropTypes.string,
    lifeStyle: PropTypes.string,
    budgetRange: PropTypes.string,
    preferredLocation: PropTypes.string,
    requirement: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default CustomerModal;
