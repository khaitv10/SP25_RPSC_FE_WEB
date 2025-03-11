import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login/Login";
import Register from "../pages/Regis/Register";
import OtpRegis from "../pages/Regis/OtpRegis";
import ServiceLandlord from "../pages/packageLandlord/packageLandlord";
import Dashboard from "../pages/homePage/Dashboard";
import AccountManagement from "../pages/Admin/AccountManagement/AccountManagement";
import RequestManagement from "../pages/Admin/RequestManagement/RequestManagement";
import RoomTypeDetail  from "../pages/Admin/RequestManagement/RoomTypeDetail";
import LandlordDashboard from "../pages/homePage/LandlordDashboard";
import AdminPackage from "../pages/packageAdmin/adminPackage";
import RegisterLandlord from "../pages/Regis/RegisterLandlord";
import PackageContract from "../pages/PackageContract/PackageContract";
import LandlordRegisAdmin from "../pages/landlordRegisAdmin/LandlordRegisAdmin";
import LandlordRegisDetailAdmin from "../pages/landlordRegisAdmin/LandlordRegisDetailAdmin";
import AdminPackageDetail from "../pages/packageAdmin/adminPackageDetail";
const AppRoutes = () => {
  return (
    <Routes>

      {/* user */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otpRegister" element={<OtpRegis />} />

      {/* admin */}
      <Route path="/admin/account" element={<AccountManagement />} />
      <Route path="/admin/request" element={<RequestManagement />} />
      <Route path="/admin/request/room-type/:roomTypeId" element={<RoomTypeDetail />} />
      <Route path="/admin/package/:packageId" element={<AdminPackageDetail />} />
      <Route path="/admin/service" element={<AdminPackage />} />
      <Route path="/admin/service" element={<AdminPackage />} />
      <Route path="/admin/regis" element={<LandlordRegisAdmin />} />

      {/* landlord */}
      <Route path="/register-landlord" element={<RegisterLandlord />} />
      <Route path="/landlord/service" element={<ServiceLandlord />} />
      <Route path="/landlord-detail/:landlordId" element={<LandlordRegisDetailAdmin />} />
      <Route path="/packagecontract" element={<PackageContract />} />


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
