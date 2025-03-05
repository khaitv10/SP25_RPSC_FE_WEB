const CustomerModal = ({ isOpen, customer, onClose }) => {
    if (!isOpen || !customer) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Customer Details</h2>
          {Object.entries(customer).map(([key, value]) => (
            <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}</p>
          ))}
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default CustomerModal;
  