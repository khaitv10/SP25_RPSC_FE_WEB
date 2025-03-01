import { useEffect, useState } from "react";

const mockCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Customer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Customer" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Customer" },
  { id: 4, name: "Bob Brown", email: "bob@example.com", role: "Customer" },
  { id: 5, name: "Charlie Lee", email: "charlie@example.com", role: "Customer" },
  { id: 6, name: "David Kim", email: "david@example.com", role: "Customer" },
];

const AccountManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("All");

  const itemsPerPage = 4; // Số lượng hiển thị trên mỗi trang

  useEffect(() => {
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "All") {
      filtered = filtered.filter((customer) => customer.role === roleFilter);
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, customers]);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <select
          className="p-2 border rounded-md"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="Search Fullname"
          className="p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-md p-4">
        <table className="min-w-full bg-white border rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Full Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-2">{customer.name}</td>
                <td className="p-2">{customer.email}</td>
                <td className="p-2">{customer.role}</td>
                <td className="p-2">
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredCustomers.length / itemsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountManagement;
