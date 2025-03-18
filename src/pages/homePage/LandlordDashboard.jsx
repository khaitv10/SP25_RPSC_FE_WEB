import { useEffect } from "react";
import Card from "../../components/Card";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandlordDashboard = () => {
  // const roomData = [
  //   {
  //     RoomID: 101,
  //     landlord: "Nguyen Vi Tien",
  //     phone: "09123123123",
  //     email: "Landlord1@gmail.com",
  //     address: "Thu Duc",
  //     status: "Pending",
  //   },
  //   {
  //     RoomID: 102,
  //     landlord: "Nguyen Xuan Duc",
  //     phone: "0903746392",
  //     email: "Landlord2@gmail.com",
  //     address: "District 1",
  //     status: "Approved",
  //   },
  // ];

  // useEffect(() => {
  //   console.log("Landlord Dashboard mounted, checking localStorage...");
  //   const isLoggedIn = localStorage.getItem("loggedIn");

  //   if (isLoggedIn === "true") {
  //     toast.success("Login successful! Welcome to your Dashboard 🎉");

  //     setTimeout(() => {
  //       localStorage.removeItem("loggedIn");
  //       console.log("loggedIn removed from localStorage");
  //     }, 2000);
  //   }
  // }, []);

  // return (
  //   <div className="flex">
  //     <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  //     <div className="flex-1 p-4">
  //       <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
  //       <div className="grid grid-cols-4 gap-4 mt-4">
  //         <Card title="Total Properties" value="10" />
  //         <Card title="Pending Requests" value="3" />
  //       </div>
  //       <Chart />
  //       <Table data={roomData} />
  //     </div>
  //   </div>
  // );
};

export default LandlordDashboard;
