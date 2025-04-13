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
import RoomManagement from "../pages/Landlord/RoomManagement/RoomManagement";
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
import AmenityManagement from "../pages/Landlord/RoomManagement/AmenityManagement";
import RoomTypeManagement from "../pages/Landlord/RoomManagement/RoomTypeManagement";
import RoomTypeDetailLandLord from "../pages/Landlord/RoomManagement/RoomTypeDetail";
import CreateRoomType from "../pages/Landlord/RoomManagement/CreateRoomType";
import RoomDetail from "../pages/Landlord/RoomManagement/RoomDetail";
import RoomCreate from "../pages/Landlord/RoomManagement/RoomCreate";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otpRegister" element={<OtpRegis />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register-landlord" element={<RegisterLandlord />} />

      {/* Admin routes */}
      <Route path="/admin/account" element={<PrivateRoute allowedRoles={["Admin"]}><AccountManagement /></PrivateRoute>} />
      <Route path="/admin/request" element={<PrivateRoute allowedRoles={["Admin"]}><RequestManagement /></PrivateRoute>} />
      <Route path="/admin/request/room-type/:roomTypeId" element={<PrivateRoute allowedRoles={["Admin"]}><RoomTypeDetail /></PrivateRoute>} />
      <Route path="/admin/package/:packageId" element={<PrivateRoute allowedRoles={["Admin"]}><AdminPackageDetail /></PrivateRoute>} />
      <Route path="/admin/service" element={<PrivateRoute allowedRoles={["Admin"]}><AdminPackage /></PrivateRoute>} />
      <Route path="/admin/contract" element={<PrivateRoute allowedRoles={["Admin"]}><ContractManagement /></PrivateRoute>} />
      <Route path="/admin/regis" element={<PrivateRoute allowedRoles={["Admin"]}><LandlordRegisAdmin /></PrivateRoute>} />
      <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={["Admin"]}><Dashboard /></PrivateRoute>} />

      {/* Admin sub-routes for landlord registration */}
      <Route path="/landlord-detail/:landlordId" element={<PrivateRoute allowedRoles={["Admin"]}><LandlordRegisDetailAdmin /></PrivateRoute>} />

      {/* Landlord routes */}
      <Route path="/landlord/dashboard" element={<PrivateRoute allowedRoles={["Landlord"]}><LandlordDashboard /></PrivateRoute>} />
      <Route path="/landlord/roomtype/room" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomManagement /></PrivateRoute>} />
      <Route path="/landlord/room/amentities" element={<PrivateRoute allowedRoles={["Landlord"]}><AmenityManagement /></PrivateRoute>} />
      <Route path="/landlord/roomtype" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomTypeManagement /></PrivateRoute>} />
      <Route path="/landlord/roomtype/:id" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomTypeDetailLandLord /></PrivateRoute>} />
      <Route path="/landlord/roomtype/create" element={<PrivateRoute allowedRoles={["Landlord"]}><CreateRoomType /></PrivateRoute>} />
      <Route path="/landlord/roomtype/room/roomdetail/:roomId" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomDetail /></PrivateRoute>} />
      <Route path="/landlord/roomtype/:roomTypeId/add-room" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomCreate /></PrivateRoute>} />
      <Route path="/landlord/service" element={<PrivateRoute allowedRoles={["Landlord"]}><PricingTable1 /></PrivateRoute>} />
      <Route path="/landlord/confirmpayment" element={<PrivateRoute allowedRoles={["Landlord"]}><ConfirmPayment /></PrivateRoute>} />
      <Route path="/landlord/manage" element={<PrivateRoute allowedRoles={["Landlord"]}><RentedRoomManagement /></PrivateRoute>} />
      <Route path="/landlord/rented-room/:roomStayId" element={<PrivateRoute allowedRoles={["Landlord"]}><RentedRoomDetail /></PrivateRoute>} />
      <Route path="/landlord/request" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomRequestManagement /></PrivateRoute>} />
      <Route path="/landlord/packagecontract" element={<PrivateRoute allowedRoles={["Landlord"]}><PackageContract /></PrivateRoute>} />
      <Route path="/landlord/feedback" element={<PrivateRoute allowedRoles={["Landlord"]}><FeedbackRoom /></PrivateRoute>} />
      <Route path="/landlord/feedback/:id" element={<PrivateRoute allowedRoles={["Landlord"]}><FeedbackDetail /></PrivateRoute>} />
      <Route path="/landlord/contract" element={<PrivateRoute allowedRoles={["Landlord"]}><ContractLand /></PrivateRoute>} />
      <Route path="/landlord/contract/contract-detail/:contractId" element={<PrivateRoute allowedRoles={["Landlord"]}><ContractLandDetail /></PrivateRoute>} />
      <Route path="/landlord/chat" element={<PrivateRoute allowedRoles={["Landlord"]}><ChatPage /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;
