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
    <div className="h-screen flex flex-col">
      {/* Header Cố Định */}
      {!isAuthPage && (
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          {role === "Admin" ? <Header /> : <HeaderLandlord />}
        </div>
      )}

      <div className="flex flex-1 pt-16"> {/* pt-16 để tránh bị Header che mất */}
        {/* Sidebar Cố Định */}
        {!isAuthPage && (
          <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 pt-[100px]">
            {role === "Admin" ? <Sidebar /> : <SidebarLandlord />}
          </div>
        )}

        {/* Nội dung trang cuộn riêng */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 ml-64 mt-16">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

export default Layout;
