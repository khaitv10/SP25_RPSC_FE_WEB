import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login/Login";
import Register from "../pages/Regis/Register";
import OtpRegis from "../pages/Regis/OtpRegis";
import Dashboard from "../pages/homePage/Dashboard";
import AccountManagement from "../pages/Admin/AccountManagement/AccountManagement";
import RequestManagement from "../pages/Admin/RequestManagement/RequestManagement";
import RoomTypeDetail from "../pages/Admin/RequestManagement/RoomTypeDetail";
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
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import HistoryContract from "../pages/packageLandlord/HistoryContract";
import HistoryContractDetail from "../pages/packageLandlord/HistoryContractDetail";
import LandlordProfile from "../pages/Landlord/LandlordProfile/LandlordProfile";
import LeaveRoomRequestList from "../pages/Landlord/LeaveRoomRequestList";
import PostList from "../pages/Landlord/PostList";
import ConfirmPayment from "../pages/PackageContract/ConfirmPayment";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="account" element={<PrivateRoute allowedRoles={["Admin"]}><AccountManagement /></PrivateRoute>} />
      <Route path="request" element={<PrivateRoute allowedRoles={["Admin"]}><RequestManagement /></PrivateRoute>} />
      <Route path="request/room-type/:roomTypeId" element={<PrivateRoute allowedRoles={["Admin"]}><RoomTypeDetail /></PrivateRoute>} />
      <Route path="package/:packageId" element={<PrivateRoute allowedRoles={["Admin"]}><AdminPackageDetail /></PrivateRoute>} />
      <Route path="service" element={<PrivateRoute allowedRoles={["Admin"]}><AdminPackage /></PrivateRoute>} />
      <Route path="contract" element={<PrivateRoute allowedRoles={["Admin"]}><ContractManagement /></PrivateRoute>} />
      <Route path="regis" element={<PrivateRoute allowedRoles={["Admin"]}><LandlordRegisAdmin /></PrivateRoute>} />
      <Route path="dashboard" element={<PrivateRoute allowedRoles={["Admin"]}><Dashboard /></PrivateRoute>} />
      <Route path="landlord-detail/:landlordId" element={<PrivateRoute allowedRoles={["Admin"]}><LandlordRegisDetailAdmin /></PrivateRoute>} />

      {/* Fallback route for /admin/* */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const LandlordRoutes = () => {
  return (
    <Routes>
      {/* Landlord routes */}
      <Route path="dashboard" element={<PrivateRoute allowedRoles={["Landlord"]}><LandlordDashboard /></PrivateRoute>} />
      <Route path="roomtype/room" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomManagement /></PrivateRoute>} />
      <Route path="room/amentities" element={<PrivateRoute allowedRoles={["Landlord"]}><AmenityManagement /></PrivateRoute>} />
      <Route path="roomtype" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomTypeManagement /></PrivateRoute>} />
      <Route path="roomtype/:id" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomTypeDetailLandLord /></PrivateRoute>} />
      <Route path="roomtype/create" element={<PrivateRoute allowedRoles={["Landlord"]}><CreateRoomType /></PrivateRoute>} />
      <Route path="roomtype/room/roomdetail/:roomId" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomDetail /></PrivateRoute>} />
      <Route path="roomtype/:roomTypeId/add-room" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomCreate /></PrivateRoute>} />
      <Route path="service" element={<PrivateRoute allowedRoles={["Landlord"]}><PricingTable1 /></PrivateRoute>} />
      <Route path="confirmpayment" element={<PrivateRoute allowedRoles={["Landlord"]}><ConfirmPayment /></PrivateRoute>} />
      <Route path="manage" element={<PrivateRoute allowedRoles={["Landlord"]}><RentedRoomManagement /></PrivateRoute>} />
      <Route path="rented-room/:roomStayId" element={<PrivateRoute allowedRoles={["Landlord"]}><RentedRoomDetail /></PrivateRoute>} />
      <Route path="request" element={<PrivateRoute allowedRoles={["Landlord"]}><RoomRequestManagement /></PrivateRoute>} />
      <Route path="leave-requests" element={<PrivateRoute allowedRoles={["Landlord"]}><LeaveRoomRequestList /></PrivateRoute>} />
      <Route path="packagecontract" element={<PrivateRoute allowedRoles={["Landlord"]}><PackageContract /></PrivateRoute>} />
      <Route path="feedback" element={<PrivateRoute allowedRoles={["Landlord"]}><FeedbackRoom /></PrivateRoute>} />
      <Route path="feedback/:id" element={<PrivateRoute allowedRoles={["Landlord"]}><FeedbackDetail /></PrivateRoute>} />
      <Route path="contract" element={<PrivateRoute allowedRoles={["Landlord"]}><ContractLand /></PrivateRoute>} />
      <Route path="contract/contract-detail/:contractId" element={<PrivateRoute allowedRoles={["Landlord"]}><ContractLandDetail /></PrivateRoute>} />
      <Route path="chat" element={<PrivateRoute allowedRoles={["Landlord"]}><ChatPage /></PrivateRoute>} />
      <Route path="history-contract" element={<PrivateRoute allowedRoles={["Landlord"]}><HistoryContract /></PrivateRoute>} />
      <Route path="/contract-detail/:contractId" element={<PrivateRoute allowedRoles={["Landlord"]}><HistoryContractDetail /></PrivateRoute>} />
      <Route path="landlord-profile" element={<PrivateRoute allowedRoles={["Landlord"]}><LandlordProfile /></PrivateRoute>} />
      <Route path="post" element={<PrivateRoute allowedRoles={["Landlord"]}><PostList /></PrivateRoute>} />

      {/* Fallback route for /landlord/* */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const PublicRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otpRegister" element={<OtpRegis />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register-landlord" element={<RegisterLandlord />} />
      
      {/* Fallback route for all other paths */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;