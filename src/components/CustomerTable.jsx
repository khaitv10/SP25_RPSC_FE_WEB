import { useEffect, useState } from "react";

const mockCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  { id: 4, name: "Alice Johnson", email: "alice@example.com" },
  { id: 5, name: "Alice Johnson", email: "alice@example.com" },
  { id: 6, name: "Alice Johnson", email: "alice@example.com" },
  { id: 7, name: "Alice Johnson", email: "alice@example.com" },
  { id: 8, name: "Alice Johnson", email: "alice@example.com" },
  { id: 9, name: "Alice Johnson", email: "alice@example.com" },


];

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    setCustomers(mockCustomers);
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Customer List</h2>
      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Full Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.email}</td>
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
  );
};

export default CustomerTable;
