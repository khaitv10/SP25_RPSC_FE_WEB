import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Table from "../components/Table";

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

  return (
    <div className="flex">
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
