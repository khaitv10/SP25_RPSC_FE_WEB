import { useState } from "react";

const Table = ({ data, onViewMore }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  
  // Filter data to only show Pending status landlords
  const filteredData = data
    .filter(landlord => landlord.status?.toLowerCase() === 'pending')
    .slice(0, 5); // Only show first 5 items
  
  // Status badge styles
  const getStatusBadgeStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case 'active':
        return "bg-green-100 text-green-800 border border-green-300";
      case 'rejected':
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-amber-100 text-amber-600 p-1 rounded-lg mr-2">🏠</span>
          Pending Landlord Requests
        </h2>
        <button 
          onClick={onViewMore}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center font-medium shadow-md hover:shadow-lg"
        >
          View All Requests
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending requests
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landlord</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((landlord, index) => (
                <tr 
                  key={landlord.landlordId || index}
                  className={`transition-all duration-200 ${hoveredRow === index ? 'bg-blue-50' : ''}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{landlord.landlordId.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {landlord.fullName?.charAt(0) || "?"}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{landlord.fullName}</div>
                        <div className="text-sm text-gray-500">Joined {formatDate(landlord.createdDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{landlord.email}</div>
                    <div className="text-sm text-gray-500">{landlord.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${getStatusBadgeStyle(landlord.status)}`}>
                      {landlord.status}
                    </span>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;