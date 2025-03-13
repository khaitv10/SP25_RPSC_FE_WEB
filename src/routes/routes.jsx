import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login/Login";
import Register from "../pages/Regis/Register";
import OtpRegis from "../pages/Regis/OtpRegis";
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
import ContractManagement from "../pages/Admin/ContractManagement/ContractManagement";
import RoomManagement from "../pages/Landlord/RoomManagement";
import PricingTable from "../pages/packageLandlord/PricingTable";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
const AppRoutes = () => {
  return (
    <Routes>

      {/* user */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otpRegister" element={<OtpRegis />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* admin */}
      <Route path="/admin/account" element={<AccountManagement />} />
      <Route path="/admin/request" element={<RequestManagement />} />
      <Route path="/admin/request/room-type/:roomTypeId" element={<RoomTypeDetail />} />
      <Route path="/admin/package/:packageId" element={<AdminPackageDetail />} />
      <Route path="/admin/service" element={<AdminPackage />} />
      <Route path="/packagecontract" element={<PackageContract />} />
      <Route path="/admin/contract" element={<ContractManagement />} />
      <Route path="/admin/regis" element={<LandlordRegisAdmin />} />

      {/* landlord */}
      <Route path="/register-landlord" element={<RegisterLandlord />} />
      <Route path="/landlord-detail/:landlordId" element={<LandlordRegisDetailAdmin />} />
      <Route path="/packagecontract" element={<PackageContract />} />
      <Route path="/landlord/room" element={<RoomManagement />} />
      <Route path="/landlord/service" element={<PricingTable />} />


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
