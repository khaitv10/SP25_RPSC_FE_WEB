import { useEffect, useState } from "react";
import CustomerTable from "../../../components/Admin/CustomerTable.jsx";
import getAllCustomer from "../../../Services/Admin/customerAPI";

const AccountManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, selectedStatus, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const statusFilter = selectedStatus === "Status" ? "" : selectedStatus;
      const response = await getAllCustomer.getCustomers(
        currentPage,
        customersPerPage,
        searchTerm,
        statusFilter
      );
      
      console.log("API Response:", response);
      if (response && response.data && Array.isArray(response.data.users)) {
        const uniqueCustomers = response.data.users.map((customer, index) => ({
          ...customer,
          uniqueKey: customer.userId || `index-${index}`
        }));
        setCustomers(uniqueCustomers);
        setTotalCustomers(response.data.totalUser || 0);
      } else {
        setCustomers([]);
        setTotalCustomers(0);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]);
      setTotalCustomers(0);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Account Management</h1>
      <CustomerTable 
        customers={customers} 
        totalCustomers={totalCustomers} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        customersPerPage={customersPerPage} 
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default AccountManagement;
