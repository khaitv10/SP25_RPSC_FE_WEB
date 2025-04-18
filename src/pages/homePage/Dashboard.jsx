import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandlordRegistrations, getTotalUsers } from "../../Services/userAPI";
import { getTransactionSummary } from "../../Services/Admin/landlordAPI";
import Card from "../../components/Card";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [landlords, setLandlords] = useState([]);
  const [totalLandlords, setTotalLandlords] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard mounted, checking localStorage...");
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (isLoggedIn === "true") {
      toast.success("Login successful! Welcome to the Dashboard 🎉");

      setTimeout(() => {
        localStorage.removeItem("loggedIn");
        console.log("loggedIn removed from localStorage");
      }, 2000);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTotalUsers(),
          fetchLandlords(),
          fetchTransactionSummary(year)
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const fetchTotalUsers = async () => {
    try {
      const response = await getTotalUsers();
      if (response?.isSuccess) {
        setTotalLandlords(response.data.totalLandlords);
        setTotalCustomers(response.data.totalCustomers);
      }
    } catch (error) {
      toast.error("Failed to fetch total user data");
    }
  };

  const fetchLandlords = async () => {
    try {
      const response = await getLandlordRegistrations(1, 10, "");
      if (response?.isSuccess) {
        setLandlords(response.data.landlords.slice(0, 5));
        setTotalUser(response.data.totalUser);
      }
    } catch (error) {
      toast.error("Failed to fetch landlord registrations");
    }
  };

  const fetchTransactionSummary = async (selectedYear) => {
    try {
      const response = await getTransactionSummary(selectedYear);
      if (response?.isSuccess) {
        const formattedData = Object.entries(response.data).map(([key, value]) => ({
          month: key.split("-")[1],
          actualValue: value,
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      toast.error("Failed to fetch transaction summary");
    }
  };

  // Cards data for more visual appeal
  const cardData = [
    {
      title: "Total Landlords",
      value: totalLandlords,
      icon: "👥",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: "🧑‍💼",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-white"
    },
    {
      title: "New Registrations",
      value: totalUser,
      icon: "📝",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white"
    },
    {
      title: "Pending Approvals",
      value: landlords.filter(l => l.status === "Pending").length,
      icon: "⏳",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      textColor: "text-white"
    }
  ];

  // Generate year options (current year + 3 previous years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      {/* Header Section */}
      <div className="bg-white shadow-md px-6 py-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">📊</span>
          Dashboard Overview
        </h1>
      </div>
      
      <div className="px-6 pb-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cardData.map((card, index) => (
                <div 
                  key={index} 
                  className={`${card.color} ${card.textColor} rounded-xl shadow-lg p-6 transform transition-all duration-300
 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{card.icon}</span>
                    <span className="text-3xl font-bold">{card.value}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-medium opacity-90">{card.title}</h3>
                </div>
              ))}
            </div>

            {/* Chart Section with Year Selector */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="bg-purple-100 text-purple-600 p-1 rounded-lg mr-2">📈</span>
                    Revenue Overview {year}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Monthly financial transaction summary</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Year:</span>
                  <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {yearOptions.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6">
                {/* Pass only data to Chart, not year/setYear */}
                <Chart data={chartData} />
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Table data={landlords} onViewMore={() => navigate("/admin/regis")} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;