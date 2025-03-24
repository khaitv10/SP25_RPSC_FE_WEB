import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandlordRegistrations, getTotalUsers } from "../../Services/userAPI";
import { getTransactionSummary } from "../../Services/Admin/landlordAPI"; // 🔹 Thêm API lấy tổng hợp giao dịch
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
  const [year, setYear] = useState(new Date().getFullYear().toString()); // ✅ Mặc định là năm nay
  const [chartData, setChartData] = useState([]); // 🔹 State lưu dữ liệu biểu đồ

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

    fetchTotalUsers();
    fetchLandlords();
    fetchTransactionSummary(year); // 🔹 Gọi API lấy dữ liệu biểu đồ
  }, [year]); // 🔥 Khi `year` thay đổi, gọi lại API

  // 🟢 Lấy tổng số landlords & customers
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

  // 🔹 Lấy danh sách landlords (giới hạn 5 người)
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

  // 📊 Lấy dữ liệu giao dịch theo năm để hiển thị biểu đồ
  const fetchTransactionSummary = async (selectedYear) => {
    try {
      const response = await getTransactionSummary(selectedYear);
      if (response?.isSuccess) {
        const formattedData = Object.entries(response.data).map(([key, value]) => ({
          month: key.split("-")[1], // Lấy tháng từ "2024-03"
          actualValue: value,
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      toast.error("Failed to fetch transaction summary");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-4xl font-bold text-gray-800 text-left mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Landlords" value={totalLandlords} className="shadow-lg bg-white rounded-xl p-6 text-center" />
        <Card title="Total Customers" value={totalCustomers} className="shadow-lg bg-white rounded-xl p-6 text-center" />
        <Card title="New Landlord Registrations" value={totalUser} className="shadow-lg bg-white rounded-xl p-6 text-center" />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <Chart year={year} setYear={setYear} data={chartData} /> {/* ✅ Truyền props */}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <Table data={landlords} onViewMore={() => navigate("/admin/regis")} />
      </div>
    </div>
  );
};

export default Dashboard;
