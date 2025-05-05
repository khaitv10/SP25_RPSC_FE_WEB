import { useEffect, useState } from "react";
import { Card, Typography, Spin, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CustomerTable from "../../../components/Admin/CustomerTable.jsx";
import LandlordTable from "../../../components/Admin/LandlordTable.jsx";
import getAllCustomer from "../../../Services/Admin/customerAPI";
import getAllLandlords from "../../../Services/Admin/landlordAPI";
import "./AccountManagement.scss";

const { Title } = Typography;
const { Option } = Select;

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "customers") {
      fetchCustomers();
    } else {
      fetchLandlords();
    }
  }, [currentPage, selectedStatus, activeTab]);

  // Add debounce functionality for search like in AdminPackage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "customers") {
        fetchCustomers();
      } else {
        fetchLandlords();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const fetchLandlords = async () => {
    setLoading(true);
    try {
      const statusFilter = selectedStatus === "Status" ? "" : selectedStatus;
      const response = await getAllLandlords.getLandlords(
        currentPage,
        customersPerPage, 
        searchTerm,
        statusFilter
      );

      if (response && response.data) {
        const uniqueLandlords = response.data.landlords.map((landlord, index) => ({
          ...landlord,
          uniqueKey: landlord.userId || `index-${index}`,
        }));
        setLandlords(uniqueLandlords);
        setTotalLandlords(response.data.totalUser || response.data.totalLandlords || 0);
      } else {
        setLandlords([]);
        setTotalLandlords(0);
      }
    } catch (error) {
      console.error("Failed to fetch landlords:", error);
      setLandlords([]);
      setTotalLandlords(0);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page on status change
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1); // Reset to first page on tab change
    setSelectedStatus("Status"); // Reset status filter
    setSearchTerm(""); // Reset search
  };

  return (
    <div className="account-management">
      <Card className="management-card">
        <div className="management-header">
          <Title level={2} className="page-title">
            👤 Account Management
          </Title>
        </div>

        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => handleTabChange("customers")}
          >
            Customers
          </button>
          <button 
            className={`tab-button ${activeTab === "landlords" ? "active" : ""}`}
            onClick={() => handleTabChange("landlords")}
          >
            Landlords
          </button>
        </div>

        <div className="filters-row">
          <Input
            className="search-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            prefix={<SearchOutlined className="search-icon" />}
            allowClear
          />
          <Select
            className="status-select"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <Option value="Status">All Status</Option>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
            <Option value="Blocked">Blocked</Option>
            <Option value="Deactive">Rejected</Option>
          </Select>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip={`Loading ${activeTab} data...`} />
          </div>
        ) : (
          <>
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
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AccountManagement;