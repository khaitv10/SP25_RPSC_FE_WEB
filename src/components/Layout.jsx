import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import Sidebar from "./Sidebar";
import SidebarLandlord from "./SidebarLanlord";
import Header from "./Header";
import HeaderLandlord from "./HeaderLandlord";
import AppRoutes from "../routes/routes"; 

const Layout = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const isAuthPage = useMemo(
    () => ["/login", "/register", "/otpRegister"].includes(location.pathname),
    [location.pathname]
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      {!isAuthPage && (role === "Admin" ? <Header /> : <HeaderLandlord />)}

      <div className="flex flex-1">
        {/* Sidebar */}
        {!isAuthPage && (role === "Admin" ? <Sidebar /> : <SidebarLandlord />)}

        {/* Nội dung trang */}
        <div className="flex-1 p-4 bg-gray-100 min-h-screen">
          <AppRoutes /> {/* Render Routes */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
