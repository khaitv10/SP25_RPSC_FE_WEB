import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import profilePic from "../../assets/avatar.jpg";

const img = 'https://instagram.fsgn2-8.fna.fbcdn.net/v/t51.29350-15/350970694_3321822604796846_4687603280114794613_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fsgn2-8.fna.fbcdn.net&_nc_cat=102&_nc_oc=Q6cZ2AGj2WUA0QZaSpQsJfnt9-NIBOMpIUP0B8ZjKnoiFSvHDKM5jbIuimC02zw7y1jz2qk&_nc_ohc=NOJaPFRYc-IQ7kNvgH_NxLY&_nc_gid=34b89f2b3e584501a59446c978ec4960&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzExNTU1MzI0MjgzMTI2NDU1MQ%3D%3D.3-ccb7-5&oh=00_AYAmrx00wtB_kEmKxWN9pUp091mzJOLpfTwyhMoAgtDJyQ&oe=67CD046F&_nc_sid=7a9f4b';

const CustomerModal = ({ isOpen, customer, onClose }) => {
  if (!isOpen || !customer) return null;

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

        <h2 className="text-2xl font-bold mb-4 text-center">Customer Details</h2>

        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-6 mb-4">
          {/* Avatar */}
          {customer.avatar ? (
            <img
              src={profilePic}
              //src={customer.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}

          {/* Customer Basic Info */}
          <div>
            <p className="text-lg font-semibold">{customer.fullName}</p>
            <p className="text-gray-600">{customer.email}</p>
            <p className="text-gray-600">{customer.phoneNumber}</p>
            <p className="text-gray-600">{customer.gender}</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>Preferences:</strong> {customer.preferences}</p>
          <p><strong>Life Style:</strong> {customer.lifeStyle}</p>
          <p><strong>Budget Range:</strong> {customer.budgetRange}</p>
          <p><strong>Preferred Location:</strong> {customer.preferredLocation}</p>
          <p><strong>Requirement:</strong> {customer.requirement}</p>
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
