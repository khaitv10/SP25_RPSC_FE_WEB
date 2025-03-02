import { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import PropTypes from 'prop-types';  // Import PropTypes

const CustomerTable = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 2; // Number of customers per page

  const filteredCustomers = customers.filter(customer =>
    (selectedRole === "All" || customer.role === selectedRole) &&
    (selectedStatus === "All" || customer.status === selectedStatus) &&
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Slice the customers for the current page
  const displayedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <select
            className="p-2 border rounded-md"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="All">Role</option>
            <option value="Customer">Customer</option>
            <option value="Landlord">Landlord</option>
          </select>
          <select
            className="p-2 border rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Search Bar and Icon Button */}
        <div className="ml-auto flex items-center">
          <input
            type="text"
            placeholder="Search Full Name"
            className="p-2 w-40 border rounded-l-md focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-900"
            onClick={() => { /* You can add a handler for search action here if needed */ }}
          >
            <FaSearch size={18} />
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Full Name</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Phone Number</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {displayedCustomers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.address}</td>
              <td className="p-2">{customer.phone}</td>
              <td className="p-2">{customer.email}</td>
              <td className="p-2">{customer.role}</td>
              <td className="p-2">
                <span className={`px-3 py-1 rounded-full ${customer.status === "Active" ? "bg-green-300 text-green-800" : "bg-red-200 text-red-800"}`}>
                  {customer.status}
                </span>
              </td>
              <td className="p-2 text-center">
                <button className="flex items-center gap-2 text-blue-300 hover:text-blue-500 transition">
                  <span>Details</span>
                  <FaEye size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4">
        {/* Page Number Buttons */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
            <button
              key={pageNumber}
              className={`p-2 rounded-md text-sm ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} hover:bg-blue-500 hover:text-white`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add PropTypes for validation
CustomerTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomerTable;
