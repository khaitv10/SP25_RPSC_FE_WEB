import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import SidebarLandlord from "./components/SidebarLanlord";
import Header from "./components/Header";
import HeaderLandlord from "./components/HeaderLandlord";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard";
import LandlordDashboard from "./pages/LandlordDashboard";

const PrivateRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return element;
};

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const role = localStorage.getItem("role");

  return (
    <div className="flex flex-col h-screen">
      {!isLoginPage && (role === "Admin" ? <Header /> : <HeaderLandlord />)}
      <div className="flex flex-1">
        {!isLoginPage && (role === "Admin" ? <Sidebar /> : <SidebarLandlord />)}
        <div className="flex-1 p-4 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={<PrivateRoute element={<Dashboard />} allowedRoles={["Admin"]} />}
            />
            <Route
              path="/landlord/dashboard"
              element={<PrivateRoute element={<LandlordDashboard />} allowedRoles={["Landlord"]} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
