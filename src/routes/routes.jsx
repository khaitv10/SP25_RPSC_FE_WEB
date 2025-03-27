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
import RentedRoomManagement from "../pages/Landlord/RentedRoomManagement";
import RentedRoomDetail from "../pages/Landlord/RentedRoomDetail";

import RoomRequestManagement from "../pages/Landlord/RoomRequestManagement";

import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import PricingTable1 from "../pages/packageLandlord/PricingTable1";
import ConfirmPayment from "../pages/PackageContract/confirmPayment";
import FeedbackRoom from "../pages/Landlord/FeedbackRoom/FeedbackRoom";
import FeedbackDetail from "../pages/Landlord/FeedbackRoom/FeedbackDetail";
import ContractLand from "../pages/ContractLandxCus/ContractLand";
import ContractLandDetail from "../pages/ContractLandxCus/ContractLandDetail";
import ChatPage from "../pages/ChatLandlord/ChatPage";

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
      <Route path="/admin/contract" element={<ContractManagement />} />
      <Route path="/admin/regis" element={<LandlordRegisAdmin />} />

      {/* landlord */}
      <Route path="/register-landlord" element={<RegisterLandlord />} />
      <Route path="/landlord-detail/:landlordId" element={<LandlordRegisDetailAdmin />} />
      <Route path="/landlord/room" element={<RoomManagement />} />
      <Route path="/landlord/service" element={<PricingTable1 />} />
      <Route path="/landlord/confirmpayment" element={<ConfirmPayment />} />

      <Route path="/landlord/manage" element={<RentedRoomManagement />} />
      <Route path="/landlord/rented-room/:roomStayId" element={<RentedRoomDetail />} />
      <Route path="/landlord/request" element={<RoomRequestManagement />} />
      <Route path="/landlord/packagecontract" element={<PackageContract />} />
      <Route path="/landlord/feedback" element={<FeedbackRoom/>} />
      <Route path="/landlord/feedback/:id" element={<FeedbackDetail/>} />
      <Route path="/landlord/contract" element={<ContractLand/>} />
      <Route path="/landlord/contract/contract-detail/:contractId" element={<ContractLandDetail />} />
      <Route path="/landlord/chat" element={<ChatPage/>} />





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
