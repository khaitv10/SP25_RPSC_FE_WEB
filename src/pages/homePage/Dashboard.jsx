import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { getLandlordRegistrations, getTotalUsers } from "../../Services/userAPI";
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
  const navigate = useNavigate(); // ✅ Hook để chuyển hướng

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
  }, []);

  // 🟢 Lấy tổng số landlords & customers
  const fetchTotalUsers = async () => {
    try {
      const response = await getTotalUsers();
      console.log("API Total Users Response:", response);

      if (response?.isSuccess) {
        setTotalLandlords(response.data.totalLandlords);
        setTotalCustomers(response.data.totalCustomers);
      }
    } catch (error) {
      console.error("Error fetching total users:", error);
      toast.error("Failed to fetch total user data");
    }
  };

  // 🔹 Lấy danh sách landlords (giới hạn 5 người)
  const fetchLandlords = async () => {
    try {
      const response = await getLandlordRegistrations(1, 10, "");
      console.log("API Landlord Registrations Response:", response);

      if (response?.isSuccess) {
        const limitedLandlords = response.data.landlords.slice(0, 5); // ✅ Chỉ lấy 5 cái
        setLandlords(limitedLandlords);
        setTotalUser(response.data.totalUser);
      }
    } catch (error) {
      console.error("Error fetching landlords:", error);
      toast.error("Failed to fetch landlord registrations");
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
        <Chart />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <Table data={landlords} onViewMore={() => navigate("/admin/regis")} /> {/* ✅ Truyền hàm onViewMore */}
      </div>
    </div>
  );
};

export default Dashboard;
