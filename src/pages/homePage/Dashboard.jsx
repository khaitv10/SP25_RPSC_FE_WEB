import { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
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
    <div className="flex">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Card title="Total Landlord" value="23" />
          <Card title="Total Requests" value="5" />
        </div>
        <Chart />
        <Table data={roomData} />
      </div>
    </div>
  );
};

export default Dashboard;
