import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login/Login";
import Register from "../pages/Regis/Register";
import OtpRegis from "../pages/Regis/OtpRegis";
import ServiceLandlord from "../pages/packageLandlord/packageLandlord";
import Dashboard from "../pages/homePage/Dashboard";
import AccountManagement from "../pages/Admin/AccountManagement/AccountManagement";
import LandlordDashboard from "../pages/homePage/LandlordDashboard";
import AdminPackage from "../pages/packageAdmin/adminPackage";
import RegisterLandlord from "../pages/Regis/RegisterLandlord";
import LandlordRegisAdmin from "../pages/landlordRegisAdmin/LandlordRegisAdmin";
import LandlordRegisDetailAdmin from "../pages/landlordRegisAdmin/LandlordRegisDetailAdmin";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-landlord" element={<RegisterLandlord />} />
      <Route path="/otpRegister" element={<OtpRegis />} />
      <Route path="/landlord/service" element={<ServiceLandlord />} />
      <Route path="/admin/account" element={<AccountManagement />} />
      <Route path="/admin/service" element={<AdminPackage />} />
      <Route path="/admin/regis" element={<LandlordRegisAdmin />} />
      <Route path="/landlord-detail/:landlordId" element={<LandlordRegisDetailAdmin />} />


      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/landlord/dashboard"
        element={
          <PrivateRoute allowedRoles={["Landlord"]}>
            <LandlordDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
