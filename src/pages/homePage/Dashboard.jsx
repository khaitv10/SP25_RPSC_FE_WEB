import { useEffect } from "react";
import Card from "../../components/Card";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const roomData = [
    {
      RoomID: 34,
      landlord: "Nguyen Xuan Duc",
      phone: "0903746392",
      email: "Landlord1@gmail.com",
      address: "Thu Duc",
      status: "Pending",
    },
    {
      RoomID: 35,
      landlord: "Nguyen Xuan Duc",
      phone: "0903746392",
      email: "Landlord1@gmail.com",
      address: "Thu Duc",
      status: "Pending",
    },
  ];

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
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-4xl font-bold text-gray-800 text-left mb-6">📊 Dashboard</h1>
      
      <div className="grid grid-cols-2  md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Landlord" value="23" className="shadow-lg bg-white rounded-xl p-6 text-center" />
        <Card title="Total Customer" value="153" className="shadow-lg bg-white rounded-xl p-6 text-center" />
        <Card title="New Landlord Registrations" value="5" className="shadow-lg bg-white rounded-xl p-6 text-center" />
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <Chart />
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6">
        <Table data={roomData} />
      </div>
    </div>
  );
};

export default Dashboard;
