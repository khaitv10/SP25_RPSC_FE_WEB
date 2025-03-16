import { useState, useEffect } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import PropTypes from "prop-types";
import LandlordModal from "./LandlordModal";

const LandlordTable = ({
  landlords,
  totalLandlords,
  currentPage,
  setCurrentPage,
  landlordsPerPage,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
}) => {
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Landlords received in LandlordTable:", landlords);
    console.log("Total Landlords:", totalLandlords);
  }, [landlords, totalLandlords]);

  const handleViewDetails = (landlord) => {
    setSelectedLandlord(landlord);
    setIsModalOpen(true);
  };

  // Calculate total pages
  const totalPages = totalLandlords > 0 ? Math.ceil(totalLandlords / landlordsPerPage) : 1;
  useEffect(() => {
    console.log("Total Pages Calculated:", totalPages);
  }, [totalLandlords, landlordsPerPage]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="p-4 bg-white shadow-md rounded-md">
        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          {/* Filter Status */}
          <select
            className="p-2 border rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Status">On</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Search Phone Number */}
          <div className="relative flex items-center w-1/4 border rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search Phone Number"
              className="p-2 pl-10 w-full border-none focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 text-gray-500" />
          </div>
        </div>

        {/* Landlord Table */}
        <table className="min-w-full bg-white border rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Full Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Phone Number</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {landlords.length > 0 ? (
              landlords.map((landlord, index) => (
                <tr key={landlord.userId || index} className="border-t">
                  <td className="p-2">{landlord.fullName}</td>
                  <td className="p-2">{landlord.address}</td>
                  <td className="p-2">{landlord.phoneNumber}</td>
                  <td className="p-2">{landlord.email}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        landlord.userStatus === "Active"
                          ? "bg-green-300 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {landlord.userStatus}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#2563eb',
                        transition: 'transform 0.2s ease, color 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.2)";
                        e.currentTarget.style.color = "#1e40af";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.color = "#2563eb";
                      }}
                      onClick={() => handleViewDetails(landlord)}
                    >
                      <FaEye size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No landlords found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {"<"}
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="px-3 py-2 rounded-md bg-gray-200 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {">"}
            </button>
          </div>
        )}
      </div>

      {/* Modal Component */}
      <LandlordModal
        isOpen={isModalOpen}
        landlord={selectedLandlord}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Props Validation
LandlordTable.propTypes = {
  landlords: PropTypes.array.isRequired,
  totalLandlords: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  landlordsPerPage: PropTypes.number.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  setSelectedStatus: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default LandlordTable;
