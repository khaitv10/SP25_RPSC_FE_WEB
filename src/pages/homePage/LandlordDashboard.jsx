import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { ToastContainer, toast } from "react-toastify";
import { getRoomCountsByLandlord } from "../../Services/Landlord/roomStayApi";
import "react-toastify/dist/ReactToastify.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  HomeOutlined, 
  CheckCircleOutlined, 
  TeamOutlined, 
  FileSearchOutlined,
  BarChartOutlined
} from "@ant-design/icons";

const LandlordDashboard = () => {
  const [roomCounts, setRoomCounts] = useState({
    totalRooms: 0,
    totalRoomsActive: 0,
    totalRoomsRenting: 0,
    totalCustomersRenting: 0,
    totalRentRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomCounts = async () => {
      try {
        setLoading(true);
        const data = await getRoomCountsByLandlord();
        console.log("✅ API Data:", data);
        setRoomCounts({
          totalRooms: data.totalRooms,
          totalRoomsActive: data.totalRoomsActive,
          totalRoomsRenting: data.totalRoomsRenting,
          totalCustomersRenting: data.totalCustomersRenting,
          totalRentRequests: data.totalRequests,
        });
      } catch (error) {
        console.error("❌ Error fetching room counts:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomCounts();
  }, []);

  // Data for Room Status Chart
  const roomStatusData = [
    { name: "Renting Rooms", value: roomCounts.totalRoomsRenting, color: "#FF5733" },
    { name: "Available Rooms", value: roomCounts.totalRoomsActive, color: "#2ECC71" },
    { name: "Other Rooms", value: roomCounts.totalRooms - (roomCounts.totalRoomsActive + roomCounts.totalRoomsRenting), color: "#3498DB" }
  ].filter(item => item.value > 0);

  // Data for Customer/Request Chart
  const customerRequestData = [
    { name: "Customers Renting", value: roomCounts.totalCustomersRenting, color: "#9B59B6" },
    { name: "Pending Requests", value: roomCounts.totalRentRequests, color: "#F1C40F" },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-md border border-gray-200">
          <p className="font-bold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">{`Count: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`Percentage: ${((payload[0].value / 
            (payload[0].name.includes("Room") ? roomCounts.totalRooms : (roomCounts.totalCustomersRenting + roomCounts.totalRentRequests))) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <BarChartOutlined className="mr-2" /> Landlord Dashboard
          </h1>
          <p className="text-gray-600">Overview of your properties and rental activities</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card title="Total Rooms" value={roomCounts.totalRooms} icon={<HomeOutlined />} 
                loading={loading} color="bg-blue-500" />
          <Card title="Active Rooms" value={roomCounts.totalRoomsActive} icon={<CheckCircleOutlined />} 
                loading={loading} color="bg-green-500" />
          <Card title="Renting Rooms" value={roomCounts.totalRoomsRenting} icon={<HomeOutlined />} 
                loading={loading} color="bg-orange-500" />
          <Card title="Customers Renting" value={roomCounts.totalCustomersRenting} icon={<TeamOutlined />} 
                loading={loading} color="bg-purple-500" />
          <Card title="Rent Requests" value={roomCounts.totalRentRequests} icon={<FileSearchOutlined />} 
                loading={loading} color="bg-yellow-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Room Status Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Room Status Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              {roomCounts.totalRooms > 0 ? 
                `${((roomCounts.totalRoomsRenting / roomCounts.totalRooms) * 100).toFixed(1)}% of your rooms are currently rented out` : 
                "Add your first room to see statistics"}
            </div>
          </div>

          {/* Customer Request Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customers & Pending Requests</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerRequestData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {customerRequestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4 text-sm text-gray-500">
              {roomCounts.totalRentRequests > 0 ? 
                `You have ${roomCounts.totalRentRequests} pending requests to review` : 
                "No pending requests at the moment"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-700">Occupancy Rate</h3>
                <p className="text-3xl font-bold mt-2">
                  {roomCounts.totalRooms > 0 ? 
                    `${((roomCounts.totalRoomsRenting / roomCounts.totalRooms) * 100).toFixed(1)}%` : 
                    "0%"
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {roomCounts.totalRooms > 0 && roomCounts.totalRoomsRenting === roomCounts.totalRooms ? 
                    "Full occupancy achieved!" : 
                    `${roomCounts.totalRoomsRenting} out of ${roomCounts.totalRooms} rooms rented`
                  }
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-700">Availability</h3>
                <p className="text-3xl font-bold mt-2">
                  {roomCounts.totalRooms > 0 ? 
                    `${((roomCounts.totalRoomsActive / roomCounts.totalRooms) * 100).toFixed(1)}%` : 
                    "0%"
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {roomCounts.totalRoomsActive > 0 ? 
                    `${roomCounts.totalRoomsActive} rooms available for rent` : 
                    "No rooms currently available"
                  }
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-700">Customer Ratio</h3>
                <p className="text-3xl font-bold mt-2">
                  {roomCounts.totalRoomsRenting > 0 ? 
                    `${(roomCounts.totalCustomersRenting / roomCounts.totalRoomsRenting).toFixed(1)}` : 
                    "0"
                  }
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Average customers per rented room
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;