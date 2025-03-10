import { useEffect, useState } from "react";
import CustomerTable from "../../../components/Admin/CustomerTable.jsx";
import LandlordTable from "../../../components/Admin/LandlordTable.jsx";
import getAllCustomer from "../../../Services/Admin/customerAPI";
import getAllLandlords from "../../../Services/Admin/landlordAPI";
import "./AccountManagement.scss"; 

const AccountManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalLandlords, setTotalLandlords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");

  useEffect(() => {
    if (activeTab === "customers") {
      fetchCustomers();
    } else {
      fetchLandlords();
    }
  }, [currentPage, selectedStatus, searchTerm, activeTab]);

  const fetchCustomers = async () => {
    try {
      const statusFilter = selectedStatus === "Status" ? "" : selectedStatus;
      const response = await getAllCustomer.getCustomers(
        currentPage,
        customersPerPage,
        searchTerm,
        statusFilter
      );

      if (response && response.data && Array.isArray(response.data.users)) {
        const uniqueCustomers = response.data.users.map((customer, index) => ({
          ...customer,
          uniqueKey: customer.userId || `index-${index}`,
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

  const fetchLandlords = async () => {
    try {
      const response = await getAllLandlords.getLandlords(
        currentPage,
        customersPerPage,
        searchTerm
      );

      if (response && response.data && Array.isArray(response.data.landlords)) {
        const uniqueLandlords = response.data.landlords.map((landlord, index) => ({
          ...landlord,
          uniqueKey: landlord.userId || `index-${index}`,
        }));
        setLandlords(uniqueLandlords);
        setTotalLandlords(response.data.totalLandlords || 0);
      } else {
        setLandlords([]);
        setTotalLandlords(0);
      }
    } catch (error) {
      console.error("Failed to fetch landlords:", error);
      setLandlords([]);
      setTotalLandlords(0);
    }
  };

  return (
    <div className="account-management-container">
      <h1 className="title">Account Management</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={activeTab === "customers" ? "active" : ""}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </button>
        <button
          className={activeTab === "landlords" ? "active" : ""}
          onClick={() => setActiveTab("landlords")}
        >
          Landlords
        </button>
      </div>

      {/* Conditional Rendering for Tables */}
      {activeTab === "customers" ? (
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
      ) : (
        <LandlordTable
          landlords={landlords}
          totalLandlords={totalLandlords}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          landlordsPerPage={customersPerPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </div>
  );
};

export default AccountManagement;
