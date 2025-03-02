import { useEffect, useState } from "react";
import CustomerTable from "../../../components/Admin/CustomerTable.jsx";

const mockCustomers = [
  { id: 1, name: "Jane Cooper", address: "Thu Duc", phone: "0903764392", email: "jane@gmail.com", role: "Customer", status: "Active", date: "13/01/2025" },
  { id: 2, name: "Floyd Miles", address: "None", phone: "0903764391", email: "floyd@yahoo.com", role: "Customer", status: "Active", date: "13/01/2025" },
  { id: 3, name: "Ronald Richards", address: "None", phone: "0903764390", email: "ronald@adobe.com", role: "Customer", status: "Active", date: "13/01/2025" },
  { id: 4, name: "Marvin McKinney", address: "Thu Duc", phone: "0903764394", email: "marvin@tesla.com", role: "Customer", status: "Active", date: "13/01/2025" },
  { id: 5, name: "Jerome Bell", address: "Thu Duc", phone: "0903764395", email: "jerome@google.com", role: "Customer", status: "Inactive", date: "13/01/2025" },
  { id: 6, name: "Kathryn Murphy", address: "Thu Dyc", phone: "0903764396", email: "kathryn@microsoft.com", role: "Customer", status: "Inactive", date: "13/01/2025" },
  { id: 7, name: "Jacob Jones", address: "Thu Duc", phone: "0903764397", email: "jacob@yahoo.com", role: "Customer", status: "Inactive", date: "13/01/2025" },
];

const AccountManagement = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    setCustomers(mockCustomers);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Account Management</h1>
      <CustomerTable customers={customers}/>
    </div>
  );
};

export default AccountManagement;
