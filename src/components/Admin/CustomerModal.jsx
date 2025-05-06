import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaEnvelope, FaPhone, FaVenusMars, 
         FaMapMarkerAlt, FaHeart, FaWalking, FaMoneyBillWave, 
         FaLocationArrow, FaClipboardList } from "react-icons/fa";

import dfava from "../../assets/default_avatar.jpg";

const CustomerModal = ({ isOpen, customer, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Short delay for animation
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen || !customer) return null;

  // Use a default avatar in case the customer.avatar is null or undefined
  const defaultAvatar = dfava;

   // Format budget with dots and VND
   const formatBudget = (budget) => {
    if (!budget) return '';
    // Remove any existing formatting to start fresh
    const cleanBudget = budget.replace(/[.,\s₫VND]/g, '');
    // Format with dots as thousand separators and add VND
    return cleanBudget.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
  };

  // Function to determine whether to show a field
  const shouldShowField = (field) => field && field !== 'Not provided' && field !== 'Not specified';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className={`bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative 
                   ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} 
                   transition-all duration-500 ease-out transform`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-green-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500 rounded-full opacity-10"></div>
        
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-all duration-300 
                    transform hover:scale-110 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        {/* Header with subtle gradient underline */}
        <div className="relative mb-8">
          <h2 className="text-3xl font-bold text-center text-blue-800">Customer Details</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
        </div>

        {/* Profile section with hover effects */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full 
                           opacity-75 group-hover:opacity-100 transform transition-all duration-300 
                           -m-1 group-hover:scale-105"></div>
            <img
              src={customer.avatar || defaultAvatar}
              alt={`${customer.fullName}'s avatar`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg 
                        transition-transform duration-500 relative z-10 object-cover"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
          </div>

          <div className="mt-5 text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              {customer.fullName}
            </h3>
            
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <FaEnvelope className="mr-2 text-blue-600" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <FaPhone className="mr-2 text-green-600" />
                <span className="text-sm">{customer.phoneNumber}</span>
              </div>
              {customer.gender && (
                <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <FaVenusMars className="mr-2 text-purple-600" />
                  <span className="text-sm">{customer.gender}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details cards with hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shouldShowField(customer.address) && (
            <DetailCard icon={<FaMapMarkerAlt className="text-red-500" />} 
                      title="Address" 
                      value={customer.address} />
          )}
          
          {shouldShowField(customer.preferences) && (
            <DetailCard icon={<FaHeart className="text-pink-500" />} 
                      title="Preferences" 
                      value={customer.preferences} />
          )}
          
          {shouldShowField(customer.lifeStyle) && (
            <DetailCard icon={<FaWalking className="text-green-500" />} 
                      title="Life Style" 
                      value={customer.lifeStyle} />
          )}
          
          {shouldShowField(customer.budgetRange) && (
            <DetailCard icon={<FaMoneyBillWave className="text-green-600" />} 
                      title="Budget Range" 
                      value={formatBudget(customer.budgetRange)} />
          )}

          {shouldShowField(customer.preferredLocation) && (
            <DetailCard icon={<FaLocationArrow className="text-blue-500" />} 
                      title="Preferred Location" 
                      value={customer.preferredLocation} />
          )}
          
          {shouldShowField(customer.requirement) && (
            <DetailCard icon={<FaClipboardList className="text-indigo-500" />} 
                      title="Requirement" 
                      value={customer.requirement} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-full
                      hover:from-green-700 hover:to-green-900 transition-all duration-300 transform 
                      hover:scale-105 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail card component for each info item
const DetailCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300
                  transform hover:scale-102 border border-gray-100 flex items-start space-x-3">
      <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
        {icon}
      </div>
      <div className="flex-grow">
        <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
        <p className="text-sm text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
};

DetailCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
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